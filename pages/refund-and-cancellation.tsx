import { getAuth0AppToken, getCredits } from "@/utils";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { useContext, useEffect } from "react";
import AppContext from '@/context';
import { Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";

export const getServerSideProps = async (ctx: { req: NextApiRequest; res: NextApiResponse; }) => {
    const session = await getSession(ctx.req, ctx.res);
    if (!session) return { props: { credits: null } };

    const accessToken = await getAuth0AppToken();
    const credits = await getCredits(accessToken, session.user.sub);

    return { props: { credits } };
}

const RefundAndCancellation = (props: { credits: number | null }) => {
    const appContext = useContext(AppContext);

    useEffect(() => {
        appContext.setCredits(props.credits);
    }, []);

    return (
        <Flex direction="column" maxW="900px" mx="auto" mt={{ base: "4.5rem", md: '2rem' }}>
            <Text>Last Updated: 4th January 2024</Text>

            <Text fontSize="3xl" fontWeight="bold" mt="1rem">Refund Policy</Text>

            <Text mt="0.75rem" fontSize="lg">
                At AnalyseTrend, we strive to offer the best and most accurate data analysis services. We believe in the quality and value of our services, and we stand behind them.
            </Text>

            <Text mt="0.75rem" fontSize="lg">
                However, please note that <strong>we do not offer refunds</strong> once a service has been availed. All sales on AnalyseTrend are final. This policy is in place due to the running costs associated with the AI technology that powers our services.
            </Text>

            <Text mt="0.75rem" fontSize="lg">
                Before making a purchase, we encourage you to:

                <UnorderedList mt="0.25rem">
                    <ListItem>Review all the information about our services.</ListItem>
                    <ListItem>Evaluate the compatibility of our services with your needs.</ListItem>
                </UnorderedList>
            </Text>

            <Text fontSize="3xl" fontWeight="bold" mt="2rem">Cancellation Policy</Text>

            <Text mt="0.75rem" fontSize="lg">
                As AnalyseTrend does not offer any subscription-based services, there is no need for a cancellation policy. Once a service is availed, you will have access to the results for the duration specified at the time of purchase.
            </Text>

            <Text mt="0.75rem" fontSize="lg">
                Please note that each purchase grants a license for a single user. Sharing of accounts or services is strictly prohibited and may result in the termination of your access without a refund.
            </Text>
        </Flex>
    )
}

export default RefundAndCancellation;