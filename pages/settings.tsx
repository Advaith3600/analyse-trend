import { getAuth0AppToken, getCredits } from "@/utils";
import { useContext, useEffect, useState } from "react";
import AppContext from '@/context';
import { Input, Button, Image, Flex, useColorModeValue, useToast } from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import axios from "axios";

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/api/auth/login',
  async getServerSideProps({ req, res }) {
    const session = await getSession(req, res);
    const accessToken = await getAuth0AppToken();
    const credits = await getCredits(accessToken, session?.user?.sub);
    
    return { props: { credits } };
  }
});

const ProfileSettings = (props: { credits: number | null }) => {
  const toast = useToast();

  const appContext = useContext(AppContext);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const inputColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  const isEditable = () => user?.sub?.startsWith('auth0|');

  const upateProfile = async () => {
    if (loading && isEditable()) return;
    setLoading(true);
    await axios.post('/api/profile/update/', { name }); 
    toast({
      title: 'Profile upddated successfully.',
      status: 'success',
      isClosable: true,
      position: 'top-right'
    });
    setLoading(false);
  }

  useEffect(() => {
    if (user) setName(user.name as string);
  }, [user]);

  useEffect(() => {
    appContext.setCredits(props.credits);
  }, []);

  return user ? (
    <Flex direction="column" maxW="900px" mx="auto" mt={{ base: "4.5rem", md: '2rem' }}>
      <Flex justify="center">
        <Image borderRadius="full" w="200px" src={user.picture as string} alt={user.name as string} draggable={false} />
      </Flex>

      <Flex gap="0.25rem" mt="3rem">
        <Input
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
          placeholder="Name..." 
          value={name}
          onChange={e => setName(e.target.value)} 
          disabled={!isEditable()}
        />
        <Input 
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
          placeholder="Email..." 
          value={user.email as string} 
          disabled 
        />
      </Flex>

      {isEditable() ? (
        <Flex justify="end" mt="1rem">
          <Button borderRadius="full" variant="primary" onClick={upateProfile} isLoading={loading}>Update</Button>
        </Flex>
      ) : null}
    </Flex>
  ) : null;
}

export default ProfileSettings;
