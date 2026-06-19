"""Oikos Proxy — HTTP bridge between the HA frontend and the Oikos standalone backend.

Why this exists
---------------
In Docker standalone mode the Oikos panel (JavaScript) runs in the BROWSER and must
call the Oikos backend (port 3564). When the user accesses Home Assistant remotely
(Nabu Casa, reverse proxy) the browser can only reach HA, not the backend port, so
those calls fail.

This integration registers a view inside HA at ``/api/oikos/<path>`` that forwards
requests to the backend. Because it is served by HA itself, it is reachable wherever
HA is — Nabu Casa included — exactly like ingress does for the add-on.

Security
--------
The view requires Home Assistant authentication (``requires_auth = True``): only
logged-in HA users can use it. The ``Authorization`` header is forwarded to the
backend, which re-validates it (defense in depth).

Configuration
-------------
The backend address is resolved, in order:
  1. ``oikos_proxy: { url: ... }`` in configuration.yaml
  2. the ``backend.txt`` file in the integration folder (written by the installer)
  3. the ``OIKOS_BACKEND_URL`` environment variable
  4. default ``http://oikos:3564``
"""
from __future__ import annotations

import logging
import os

from aiohttp import ClientError, web

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType

_LOGGER = logging.getLogger(__name__)

DOMAIN = "oikos_proxy"
DEFAULT_BACKEND = "http://oikos:3564"

# Headers not forwarded as-is (handled by the HTTP layer).
_REQ_STRIP = {"host", "content-length", "connection", "keep-alive",
              "proxy-authorization", "transfer-encoding", "upgrade"}
_RESP_STRIP = _REQ_STRIP | {"content-encoding"}  # aiohttp decompresses → header would lie


def _resolve_backend(hass: HomeAssistant, config: ConfigType) -> str:
    conf = config.get(DOMAIN) or {}
    if isinstance(conf, dict) and conf.get("url"):
        return str(conf["url"]).rstrip("/")
    try:
        path = hass.config.path("custom_components", DOMAIN, "backend.txt")
        with open(path, "r", encoding="utf-8") as fh:
            val = fh.read().strip()
            if val:
                return val.rstrip("/")
    except OSError:
        pass
    return (os.environ.get("OIKOS_BACKEND_URL") or DEFAULT_BACKEND).rstrip("/")


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    backend = _resolve_backend(hass, config)
    hass.http.register_view(OikosProxyView(backend))
    _LOGGER.info("Oikos Proxy active: /api/oikos/* → %s", backend)
    return True


class OikosProxyView(HomeAssistantView):
    """Forwards /api/oikos/<path> to the Oikos standalone backend."""

    url = "/api/oikos/{path:.*}"
    name = "api:oikos"
    requires_auth = True

    def __init__(self, backend: str) -> None:
        self._backend = backend

    async def _proxy(self, request: web.Request, path: str) -> web.StreamResponse:
        hass: HomeAssistant = request.app["hass"]
        session = async_get_clientsession(hass)
        target = f"{self._backend}/{path}"
        headers = {k: v for k, v in request.headers.items()
                   if k.lower() not in _REQ_STRIP}
        body = await request.read()
        try:
            async with session.request(
                request.method,
                target,
                params=request.query,
                headers=headers,
                data=body if body else None,
                allow_redirects=False,
            ) as upstream:
                payload = await upstream.read()
                out = {k: v for k, v in upstream.headers.items()
                       if k.lower() not in _RESP_STRIP}
                return web.Response(status=upstream.status, body=payload, headers=out)
        except (ClientError, OSError) as err:
            _LOGGER.warning("Oikos backend unreachable (%s): %s", target, err)
            return web.json_response(
                {"error": f"Oikos backend unreachable: {err}",
                 "code": "backend_unreachable"},
                status=502,
            )

    async def get(self, request: web.Request, path: str) -> web.StreamResponse:
        return await self._proxy(request, path)

    async def post(self, request: web.Request, path: str) -> web.StreamResponse:
        return await self._proxy(request, path)

    async def put(self, request: web.Request, path: str) -> web.StreamResponse:
        return await self._proxy(request, path)

    async def delete(self, request: web.Request, path: str) -> web.StreamResponse:
        return await self._proxy(request, path)
