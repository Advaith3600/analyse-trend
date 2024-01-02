import { getSession, updateSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import { getAuth0AppToken } from "@/utils";

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req, res);
    if (! session) return res.status(401).json({ success: false });

    const accessToken = await getAuth0AppToken();
    await axios.patch(
        `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${session.user.sub}`, 
        { name: req.body['name'] },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    
    await updateSession(req, res, { ...session, user: { ...session.user, name: req.body['name'] } });

    res.status(200).json({ success: true });
})