import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Flex, Link, Modal, ModalBody, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";

const IntroComponent = () => {
  const { user, isLoading } = useUser();

  return (
    <Modal closeOnEsc={false} isCentered={true} onClose={() => {}} size="3xl" isOpen={!isLoading && !user}>
      <ModalOverlay />
      <ModalContent mx="1rem">
        <ModalBody>
          <Flex direction="column" lineHeight="1.7">
            <Text 
              fontSize={{ md: '5xl', base: '3xl' }} 
              fontWeight="bold" 
              mx="auto" 
              py="1rem"
              align="center"
            >
              Welcome to AnalyseTrend 👋!
            </Text>
            <Flex 
              direction="column" 
              fontSize={{ md: 'lg' }} 
              gap="1rem" 
              maxH="50dvh"
              overflow="auto"
            >
              <Text>Welcome to our innovative platform, where your project ideas meet the power of AI sentiment analysis! This is a space designed to help you gauge the sentiment of your new project ideas, providing you with valuable insights that can guide your decision-making process. Our mission is to empower you with the tools to make informed decisions about your projects, helping you turn your ideas into successful ventures.</Text>
              <Text>To get started, simply log in to your account. As a warm welcome, we’re offering you 3 complimentary credits. Each query you make will cost credits depending on the AI model you choose: 1 credit for GPT-3.5 and 3 credits for GPT-4. Don’t worry if you run out of credits - you can easily purchase more directly from our site. We’re excited to see what brilliant ideas you’ll bring to life with our platform!</Text>
            </Flex>
            <Link href="/api/auth/login/" w="100%">
              <Button variant="primary" my="2rem" h="60px" fontSize="2xl" w="full">
                Get Started Now
              </Button>
            </Link>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default IntroComponent;