import AppContext from '@/context';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useColorModeValue } from '@chakra-ui/system';
import axios from 'axios';
import { ReactNode, useEffect, useRef, useState } from 'react';

export type ChatBasic = {
    title: string,
    id: string,
}

export type Chat = ChatBasic & {
    chat: {
        role: 'user' | 'assistant',
        content: string
    }[]
}

const AppContextWrapper = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();

    const [userToken, setUserToken] = useState('');
    const [credits, setCredits] = useState<null | number>(null);
    const [chats, setChats] = useState<ChatBasic[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);

    const refreshChats = async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analyse_trend/chats/`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        setChats(response.data);
    }

    const changeActiveChat = async (id: string | null) => {
        if (id === null) return setActiveChat(null);
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analyse_trend/chat/${id}/`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        setActiveChat(response.data);
    }

    const progressColor = useColorModeValue('#4a25e1', 'white');
    useEffect(() => {
        document.documentElement.style.setProperty('--nprogress-color', progressColor);
    }, [progressColor]);

    useEffect(() => {
        axios.get('/api/token/')
            .then(({ data }) => setUserToken(data.accessToken))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (user && userToken) refreshChats();
    }, [user, userToken]);

    return (
        <AppContext.Provider 
            value={{
                userToken, 
                credits, setCredits, 
                chats, refreshChats, 
                activeChat, changeActiveChat
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppContextWrapper;