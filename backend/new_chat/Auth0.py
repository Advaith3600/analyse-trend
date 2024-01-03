import os
import requests
from urllib.parse import quote

class Auth0:
    def __init__(self) -> None:
        self.clientID = os.environ.get("AUTH0_CLIENT_ID")
        self.clientSecret = os.environ.get("AUTH0_CLIENT_SECRET")
        self.issuerBaseUrl = os.environ.get("AUTH0_ISSUER_BASE_URL")

    def _parse_url(self, url):
        return quote(url, safe=':/&=?')

    
