import axios from 'axios';

const ISSUER_BASE = process.env.AUTH0_ISSUER_BASE_URL as string;

export const getAuth0AppToken = async () => {
  const res = await axios.post(`${ISSUER_BASE}/oauth/token/`, {
    grant_type: 'client_credentials',
    client_id: process.env.AUTH0_CLIENT_ID as string,
    client_secret: process.env.AUTH0_CLIENT_SECRET as string,
    audience: `${ISSUER_BASE}/api/v2/`,
  }, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });

  return res?.data?.access_token;
}

export const getCredits = async (token: string, sub: string) => {
  const response = await axios.request({
    method: 'GET',
    url: `${ISSUER_BASE}/api/v2/users/${sub}`,
    headers: {authorization: `Bearer ${token}`}
  });

  return response?.data?.app_metadata?.credits;
}