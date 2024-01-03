'use client';
/*eslint-disable*/

import axios from 'axios';
import MessageBoxChat from '@/components/MessageBox';
import AppContext from '@/context';
import {
  Button,
  Flex,
  Icon,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { MdAutoAwesome, MdPerson, MdBolt } from 'react-icons/md';
import { Chat as ChatType } from '@/contextWrapper';
import { OpenAIModel } from '@/types/types';
import { getAuth0AppToken, getCredits } from '@/utils';
import IntroComponent from '@/intro';
import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export const getServerSideProps = async (ctx: { req: NextApiRequest; res: NextApiResponse; }) => {
  const session = await getSession(ctx.req, ctx.res);
  const props = { issuer_base: process.env.AUTH0_ISSUER_BASE_URL, credits: null };

  if (! session) return { props };

  const accessToken = await getAuth0AppToken();
  props.credits = await getCredits(accessToken, session.user.sub);
  
  return { props };
}

export default function Chat(props: { apiKeyApp: string, credits: number | null, issuer_base: string }) {
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  // Response message
  const [outputCode, setOutputCode] = useState<string>('');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5');

  const toast = useToast();
  const appContext = useContext(AppContext);

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');

  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  const handleTranslate = async () => {
    const _model: string = model;
    if (loading) return;
    setLoading(true);
    setInputOnSubmit(inputCode);
    let result: any;

    try {
      result = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/analyse_trend/chat/`, 
        { input: inputCode, model: _model }, 
        { headers: { Authorization: `Bearer ${appContext.userToken}` } }
      );
    } catch (error: any) {
      console.log(error);
      toast({
        title: error?.response?.data?.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      setLoading(false);
    }

    const checkChatStatus = async (chatId: string) => {
      const result = await axios.get<ChatType>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/analyse_trend/chat/${chatId}`, 
        { headers: { Authorization: `Bearer ${appContext.userToken}` } }
      );

      setOutputCode(result?.data?.chat?.find(c => c.role === 'assistant')?.content || '');
      appContext.setCredits((c: number) => c - (_model === 'gpt-4' ? 3 : 1));
      appContext.refreshChats();
      appContext.changeActiveChat(null);
      setLoading(false);
    }

    if (result) {
      const interval = setInterval(() => {
        try {
          checkChatStatus(result.data.id);
          clearInterval(interval);
        } catch (e: any) {}
      }, 5000);
    }
  };

  useEffect(() => {
    appContext.baseURL.current = props.issuer_base;
    appContext.setCredits(props.credits);
  }, []);

  useEffect(() => {
    if (!appContext.activeChat) return;

    const { activeChat: chat }: { activeChat: ChatType } = appContext;
    setOutputCode(chat.chat.find(c => c.role === 'assistant')?.content || '');
    setInputOnSubmit(chat.chat.find(c => c.role === 'user')?.content || '');
  }, [appContext.activeChat]);

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Model Change */}
        <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="20px"
            borderRadius="60px"
          >
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'gpt-3.5' ? buttonBg : 'transparent'}
              w="174px"
              h="70px"
              boxShadow={model === 'gpt-3.5' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('gpt-3.5')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              <Flex direction="column">
                <Text>GPT-3.5</Text>
                <Text fontSize="xs" fontWeight="normal" opacity="0.6">1 Credit</Text>
              </Flex>
            </Flex>
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'gpt-4' ? buttonBg : 'transparent'}
              w="164px"
              h="70px"
              boxShadow={model === 'gpt-4' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('gpt-4')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdBolt}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              <Flex direction="column">
                <Text>GPT-4</Text>
                <Text fontSize="xs" fontWeight="normal" opacity="0.6">3 Credits</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {/* Main Box */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb={'auto'}
        >
          <Flex w="100%" align={'center'} mb="10px">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'transparent'}
              border="1px solid"
              borderColor={borderColor}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdPerson}
                width="20px"
                height="20px"
                color={brandColor}
              />
            </Flex>
            <Flex
              p="22px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              zIndex={'2'}
            >
              <Text
                color={textColor}
                fontWeight="600"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '24px', md: '26px' }}
              >
                {inputOnSubmit}
              </Text>
            </Flex>
          </Flex>
          <Flex w="100%">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdAutoAwesome}
                width="20px"
                height="20px"
                color="white"
              />
            </Flex>
            <MessageBoxChat isLoading={loading} output={outputCode} />
          </Flex>
        </Flex>
        {/* Chat Input */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            onChange={handleChange}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg:
                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleTranslate}
            isLoading={loading ? true : false}
          >
            Submit
          </Button>
        </Flex>

        {/* <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            Free Research Preview. ChatGPT may produce inaccurate information
            about people, places, or facts.
          </Text>
          <Link href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">
            <Text
              fontSize="xs"
              color={textColor}
              fontWeight="500"
              textDecoration="underline"
            >
              ChatGPT May 12 Version
            </Text>
          </Link>
        </Flex> */}
      </Flex>

      <IntroComponent />
    </Flex>
  );
}
