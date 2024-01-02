'use client';
// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { useUser } from '@auth0/nextjs-auth0/client';
import NavLink from '../link/NavLink';
import { useContext, useEffect } from 'react';
import AppContext from '@/context';

export default function HeaderLinks() {
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.500', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 41px 75px #081132',
  );

  const { user, isLoading } = useUser();
  const appContext = useContext(AppContext);

  useEffect(() => {
    if (user) {
      const options = {
          method: 'GET',
          url: `${appContext.baseURL.current}/api/v2/users/${user.sub}`,
          headers: {authorization: `Bearer ${appContext.accessToken.current}`}
      };

      axios.request(options).then((response: any) => {
        appContext.setCredits(response?.data?.app_metadata?.credits ?? null);
      });
    }
  }, [user]);

  return (
    <Flex
      zIndex="100"
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      {appContext.credits ? (
        <Text px="10px" fontSize="14px">{appContext.credits} Credit{appContext.credits !== 1 ? 's' : ''}</Text>
      ) : null}

      <SidebarResponsive />

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>

      {user ? (
        <Menu>
          <MenuButton p="0px" style={{ position: 'relative' }}>
            {user.picture ? (
              <Img
                src={user.picture}
                alt="Profile Picture"
                borderRadius={'50%'}
                w="40px"
                h="40px"
              />
            ) : (
              <>
                <Box
                  _hover={{ cursor: 'pointer' }}
                  color="white"
                  bg="#11047A"
                  w="40px"
                  h="40px"
                  borderRadius={'50%'}
                />
                <Center top={0} left={0} position={'absolute'} w={'100%'} h={'100%'}>
                  <Text fontSize={'xs'} fontWeight="bold" color={'white'}>
                    AP
                  </Text>
                </Center>
              </>
            )}
          </MenuButton>
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                👋&nbsp; Hey, {user.name}
              </Text>
            </Flex>
            <Flex flexDirection="column" p="10px">
              <NavLink href="/settings">
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  color={textColor}
                  borderRadius="8px"
                  px="14px"
                >
                  <Text fontWeight="500" fontSize="sm">
                    Profile Settings
                  </Text>
                </MenuItem>
              </NavLink>
              <NavLink href="/api/auth/logout">
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  color="red.400"
                  borderRadius="8px"
                  px="14px"
                >
                  <Text fontWeight="500" fontSize="sm">
                    Log out
                  </Text>
                </MenuItem>
              </NavLink>
            </Flex>
          </MenuList>
        </Menu>
      ) : (
        <NavLink href="/api/auth/login">
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            _hover={{
              bg:
                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            isLoading={isLoading}
          >
            Log in
          </Button>
        </NavLink>
      )}
    </Flex>
  );
}
