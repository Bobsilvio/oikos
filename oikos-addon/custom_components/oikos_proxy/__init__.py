"""Oikos Proxy — ponte HTTP tra il frontend HA e il backend Oikos standalone.

Perché esiste
-------------
In modalità Docker standalone il pannello Oikos (JavaScript) gira nel BROWSER e
deve chiamare il backend Oikos (porta 3000). Quando l'utente accede a Home
Assistant da remoto (Nabu Casa, reverse proxy) il browser raggiunge SOLO HA, non
la porta del backend → le chiamate falliscono.

Questa integrazione registra una view dentro HA a ``/api/oikos/<path>`` che inoltra
le richieste al backend. Essendo servita da HA stesso, è raggiungibile ovunque lo
sia HA — Nabu Casa compresa — esattamente come l'ingress fa per l'add-on.

Sicurezza
---------
La view richiede l'autenticazione di Home Assistant (``requires_auth = True``):
solo utenti HA loggati possono usarla. L'header ``Authorization`` viene inoltrato
al backend, che lo rivalida (difesa in profondità). Così il backend non ha più
bisogno di esporre la porta 3000 sull'host: basta che HA lo raggiunga sulla rete
Docker interna (default ``http://oikos:3000``).

Configurazione
--------------
L'indirizzo del backend viene risolto, in ordine:
  1. ``oikos_proxy: { url: ... }`` in configuration.yaml
  2. file ``backend.txt`` nella cartella dell'integrazione (scritto dall'installer)
  3. variabile d'ambiente ``OIKOS_BACKEND_URL``
  4. default ``http://oikos:3000``
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

# Header che non vanno inoltrati così come sono (gestiti dal layer HTTP).
_REQ_STRIP = {"host", "content-length", "connection", "keep-alive",
              "proxy-authorization", "transfer-encoding", "upgrade"}
_RESP_STRIP = _REQ_STRIP | {"content-encoding"}  # aiohttp decomprime → l'header mentirebbe


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
    _LOGGER.info("Oikos Proxy attivo: /api/oikos/* → %s", backend)
    return True


class OikosProxyView(HomeAssistantView):
    """Inoltra /api/oikos/<path> al backend Oikos standalone."""

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
            _LOGGER.warning("Oikos backend non raggiungibile (%s): %s", target, err)
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
