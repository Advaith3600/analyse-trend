'use client';
// chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
//   Custom components
import Brand from '@/components/sidebar/components/Brand';
import Links from '@/components/sidebar/components/Links';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineSettings } from 'react-icons/md';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

function SidebarContent() {
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const shadowPillBar = useColorModeValue(
    '4px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'none',
  );

  const { user, isLoading } = useUser();
  // SIDEBAR
  return (
    <Flex
      direction="column"
      height="100%"
      pt="20px"
      pb="26px"
      borderRadius="30px"
      maxW="285px"
      px="20px"
    >
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="0px" pe={{ md: '0px', '2xl': '0px' }}>
          <Links />
        </Box>
      </Stack>

      {!isLoading && user ? (
        <>
          <Flex
            mt="8px"
            justifyContent="center"
            alignItems="center"
            boxShadow={shadowPillBar}
            borderRadius="30px"
            p="14px"
          >
            {/* <NextAvatar h="34px" w="34px" src={avatar4} me="10px" /> */}
            <Text color={textColor} fontSize="xs" fontWeight="600" me="10px">
              {user.name}
            </Text>

            <Button
              variant="transparent"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="full"
              w="34px"
              h="34px"
              px="0px"
              minW="34px"
              justifyContent={'center'}
              alignItems="center"
              me="10px"
            >
              <Icon as={MdOutlineSettings} width="16px" height="16px" color="inherit" />
            </Button>
            
            <Link href="/api/auth/logout">
              <Button
                variant="transparent"
                border="1px solid"
                borderColor={borderColor}
                borderRadius="full"
                w="34px"
                h="34px"
                px="0px"
                minW="34px"
                justifyContent={'center'}
                alignItems="center"
              >
                <Icon as={FiLogOut} width="16px" height="16px" color="inherit" />
              </Button>
            </Link>
          </Flex>
        </>
      ) : null}      
    </Flex>
  );
}

export default SidebarContent;
