import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
    const { accessToken } = await getAccessToken(req, res);
    res.status(200).json({ accessToken });
});