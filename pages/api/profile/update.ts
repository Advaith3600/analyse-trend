import { getAccessToken, getSession, updateSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
    const { accessToken } = await getAccessToken(req, res);
    await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analyse_trend/profile/`, { name: req.body['name'] }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const session = await getSession(req, res);
    if (session) await updateSession(req, res, { ...session, user: { ...session.user, name: req.body['name'] } });
    res.status(200).json({ success: true });
})