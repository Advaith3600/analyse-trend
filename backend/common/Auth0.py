import os
import requests
from urllib.parse import quote

class Auth0:
    def __init__(self) -> None:
        self.clientID = os.environ.get("AUTH0_CLIENT_ID")
        self.clientSecret = os.environ.get("AUTH0_CLIENT_SECRET")
        self.issuerBaseUrl = 'https://' + os.environ.get("AUTH0_DOMAIN")

    def get_token(self):
        response = requests.post(
            f'{self.issuerBaseUrl}/oauth/token/', 
            headers={'content-type': 'application/x-www-form-urlencoded'},
            data={
                'grant_type': 'client_credentials',
                'client_id': self.clientID,
                'client_secret': self.clientSecret,
                'audience': f'{self.issuerBaseUrl}/api/v2/'
            }
        )

        return response.json()['access_token'] if response.status_code == 200 else None
    
    def _parse_url(self, url):
        return quote(url, safe=':/&=?')
    
    def get_data(self, endpoint, token):
        response = requests.get(
            self._parse_url(f'{self.issuerBaseUrl}{endpoint}'), 
            headers={'Authorization': token},
        )

        return response.status_code, response.json() if response.status_code == 200 else {}

    def patch_data(self, endpoint, token, data):
        response = requests.patch(
            self._parse_url(f'{self.issuerBaseUrl}{endpoint}'), 
            headers={'Authorization': token},
            json=data
        )

        return response.status_code, response.json()
