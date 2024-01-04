import { getAuth0AppToken, getCredits } from "@/utils";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { useContext, useEffect } from "react";
import AppContext from '@/context';
import { Flex, Link, Text } from "@chakra-ui/react";

export const getServerSideProps = async (ctx: { req: NextApiRequest; res: NextApiResponse; }) => {
    const session = await getSession(ctx.req, ctx.res);
    if (! session) return { props: { credits: null } };
  
    const accessToken = await getAuth0AppToken();
    const credits = await getCredits(accessToken, session.user.sub);
    
    return { props: { credits } };
}

const SupportPage = (props: { credits: number | null }) => {
    const appContext = useContext(AppContext);

    useEffect(() => {
        appContext.setCredits(props.credits);
    }, []);

    return (
        <Flex direction="column" maxW="900px" mx="auto" mt={{ base: "4.5rem", md: '2rem' }}>
            <Text>Last Updated: 4th January 2024</Text>

            <Text fontSize="3xl" fontWeight="bold" mt="1rem">Support</Text>

            <Text mt="0.75rem" fontSize="lg">
                At AnalyseTrend, we're here to help. If you have any questions, concerns, or need assistance with our services, please don't hesitate to reach out.
            </Text>

            <Text mt="0.75rem" fontSize="lg">
                You can contact us via email at <Link href="mailto:advaith3600@gmail.com" textDecoration="underline">advaith3600@gmail.com</Link>. We aim to respond to all inquiries within 24 hours.
            </Text>

            <Text mt="0.75rem" fontSize="lg">
                Your feedback is important to us. If you have any suggestions or comments about our services, please let us know. We’re always looking to improve and your input helps us do that.
            </Text>

            <Text mt="0.75rem" fontSize="lg">
                Thank you for choosing AnalyseTrend!
            </Text>
        </Flex>
    )
}

export default SupportPage;