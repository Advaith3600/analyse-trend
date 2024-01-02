'use client';
/* eslint-disable */

// chakra imports
import {
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useContext } from 'react';
import AppContext from '@/context';
import { ChatBasic } from '@/contextWrapper';
import NavLink from '@/components/link/NavLink';

export function SidebarLinks() {
  //   Chakra color mode
  let activeColor = useColorModeValue('navy.700', 'white');

  const { chats, activeChat, ...appContext } = useContext(AppContext);

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (chats: ChatBasic[]) => {
    return chats.map((chat, key) => {
      return (
        <NavLink href="/" onClick={() => appContext.changeActiveChat(chat.id)}>
          <Flex
            align="center"
            justifyContent="space-between"
            w="100%"
            maxW="100%"
            ps="17px"
            mb="0px"
          >
            <HStack
              w="100%"
              mb="14px"
              spacing={'22px'}
            >
              <Flex
                w="100%"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  me="auto"
                  color={activeChat && activeChat.id === chat.id ? activeColor : 'gray.500'}
                  fontWeight="500"
                  letterSpacing="0px"
                >
                  {chat.title}
                </Text>
              </Flex>
            </HStack>
          </Flex>
        </NavLink>
      );
    });
  };
  
  return chats.length ? createLinks(chats) : (
    <Flex
      align="center"
      justifyContent="space-between"
      w="100%"
      maxW="100%"
      ps="17px"
      mb="0px"
    >
      <HStack
        w="100%"
        mb="14px"
        spacing={'22px'}
      >
        <Flex
          w="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            mx="auto"
            color={'gray.500'}
            fontWeight="500"
            letterSpacing="0px"
            fontSize="sm"
          >
            Start chatting to see history.
          </Text>
        </Flex>
      </HStack>
    </Flex>
  )
}

export default SidebarLinks;
