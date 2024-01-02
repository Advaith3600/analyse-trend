import axios from 'axios';

export const getAppAuth0Token = async () => {
  const ISSUER_BASE = process.env.AUTH0_ISSUER_BASE_URL as string;

  const res = await axios.request({
    method: 'POST',
    url: `${ISSUER_BASE}/oauth/token/`,
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID as string,
      client_secret: process.env.AUTH0_CLIENT_SECRET as string,
      audience: `${ISSUER_BASE}/api/v2/`,
    })
  });

  return res?.data?.access_token;
}