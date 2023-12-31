'use client';
// Chakra imports
import { Flex, Img, useColorModeValue } from '@chakra-ui/react';

import { HSeparator } from '@/components/separator/Separator';
import Logo from '../../../../public/logo.svg';
import Link from 'next/link';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      <Link href="/">
        <Img src={Logo.src} w="100px" />
      </Link>

      <HSeparator my="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
