"""Fail-closed Netzwerkregeln für die lokale, versandlose Formular-QA."""
from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.parse import urlsplit

LEAD_SOURCES = frozenset({
    'multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
    'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig',
    'pv-reinigung-leipzig', 'solarpark-betreuung',
})


def local_base_url(value: str) -> str:
    parsed = urlsplit(value)
    if (parsed.scheme != 'http' or parsed.hostname not in {'127.0.0.1', 'localhost', '::1'}
            or parsed.username is not None or parsed.password is not None
            or parsed.path not in {'', '/'} or parsed.query or parsed.fragment
            or parsed.port is None):
        raise ValueError('QA_BASE_URL muss eine HTTP-Loopback-Adresse mit explizitem Port sein')
    return value.rstrip('/')


def same_origin(url: str, host: str) -> bool:
    candidate, expected = urlsplit(url), urlsplit(host)
    return (candidate.scheme, candidate.netloc) == (expected.scheme, expected.netloc)


def request_policy(url: str, method: str, host: str, navigation: bool = False,
                   resource_type: str = '', simulate_lead: bool = False) -> str:
    """Nur lokale GETs; der einzige mögliche POST ist eine Browser-Simulation."""
    host = local_base_url(host)
    parsed = urlsplit(url)
    if method != 'GET':
        if (simulate_lead and method == 'POST' and same_origin(url, host)
                and parsed.path == '/api/lead/' and not parsed.query):
            return 'stub_lead'
        return 'abort_non_get'
    if not same_origin(url, host):
        return 'abort_external'
    if navigation and (parsed.query or parsed.path.startswith('/api/')):
        return 'abort_navigation'
    if resource_type in {'image', 'font', 'media'}:
        return 'abort_asset'
    return 'continue_get'


def install_network_guard(context, host: str, simulate_lead: bool = False):
    host = local_base_url(host)
    state = {'success': False, 'posts': [], 'navigations': [],
             'blocked_non_get': 0, 'blocked_external_get': 0, 'continued_get': 0}

    def intercept(route):
        request = route.request
        decision = request_policy(request.url, request.method, host,
                                  request.is_navigation_request(), request.resource_type,
                                  simulate_lead)
        if decision == 'stub_lead':
            # Nur im Speicher für bestehende Assertions; niemals Payloads protokollieren.
            state['posts'].append({'url': request.url, 'body': request.post_data or ''})
            response = {'success': state['success'], 'message': 'Simulierte Antwort'}
            if state['success']:
                response.update(messageId='qa-double-opt-in-id', verificationRequired=True)
            route.fulfill(status=200, content_type='application/json', body=json.dumps(response))
        elif decision == 'continue_get':
            state['continued_get'] += 1
            route.continue_()
        else:
            if decision == 'abort_non_get':
                state['blocked_non_get'] += 1
            if decision == 'abort_external':
                state['blocked_external_get'] += 1
            if request.is_navigation_request():
                state['navigations'].append(urlsplit(request.url).path)
            route.abort()

    context.route('**/*', intercept)
    context.route_web_socket('**/*', lambda socket: socket.close())
    return state


def output_path(filename: str) -> Path:
    directory = Path(os.environ.get('QA_OUTPUT_DIR', Path(__file__).parent))
    directory.mkdir(parents=True, exist_ok=True)
    return directory / filename


def safe_error(error: Exception) -> str:
    # Playwright- und Assertion-Texte können Formularwerte, URLs oder Token enthalten.
    return f'{type(error).__name__}: QA-Prüfung fehlgeschlagen (Rohdetails nicht gespeichert)'
