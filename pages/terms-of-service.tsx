import { getAuth0AppToken, getCredits } from "@/utils";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { useContext, useEffect } from "react";
import AppContext from '@/context';
import { Flex, Text } from "@chakra-ui/react";

export const getServerSideProps = async (ctx: { req: NextApiRequest; res: NextApiResponse; }) => {
    const session = await getSession(ctx.req, ctx.res);
    if (!session) return { props: { credits: null } };

    const accessToken = await getAuth0AppToken();
    const credits = await getCredits(accessToken, session.user.sub);

    return { props: { credits } };
}

const TermsOfServicePage = (props: { credits: number | null }) => {
    const appContext = useContext(AppContext);

    useEffect(() => {
        appContext.setCredits(props.credits);
    }, []);

    return (
        <Flex direction="column" maxW="900px" mx="auto" mt={{ base: "4.5rem", md: '2rem' }}>
            <Text>Last Updated: 4th January 2024</Text>

            <Text fontSize="3xl" fontWeight="bold" mt="1rem">Terms of Service</Text>

            <Text mt="0.5rem"></Text>

            <div className="default-styling">
                <h2>1. Terms</h2>

                <p>By accessing this Website, accessible from https://analysetrend.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>

                <h2>2. Use License</h2>

                <p>Permission is granted to temporarily download one copy of the materials on AnalyseTrend's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>

                <ul>
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose or for any public display;</li>
                    <li>attempt to reverse engineer any software contained on AnalyseTrend's Website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
                </ul>

                <p>This will let AnalyseTrend to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format. These Terms of Service has been created with the help of the <a href="https://www.termsofservicegenerator.net">Terms Of Service Generator</a>.</p>

                <h2>3. Disclaimer</h2>

                <p>All the materials on AnalyseTrend's Website are provided "as is". AnalyseTrend makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, AnalyseTrend does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>

                <h2>4. Limitations</h2>

                <p>AnalyseTrend or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on AnalyseTrend's Website, even if AnalyseTrend or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>

                <h2>5. Revisions and Errata</h2>

                <p>The materials appearing on AnalyseTrend's Website may include technical, typographical, or photographic errors. AnalyseTrend will not promise that any of the materials in this Website are accurate, complete, or current. AnalyseTrend may change the materials contained on its Website at any time without notice. AnalyseTrend does not make any commitment to update the materials.</p>

                <h2>6. Links</h2>

                <p>AnalyseTrend has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by AnalyseTrend of the site. The use of any linked website is at the user's own risk.</p>

                <h2>7. Site Terms of Use Modifications</h2>

                <p>AnalyseTrend may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.</p>

                <h2>8. Your Privacy</h2>

                <p>Please read our Privacy Policy.</p>

                <h2>9. Governing Law</h2>

                <p>Any claim related to AnalyseTrend's Website shall be governed by the laws of in without regards to its conflict of law provisions.</p>

            </div>
        </Flex>
    )
}

export default TermsOfServicePage;