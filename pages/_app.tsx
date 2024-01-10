'use client';

// import '@/nprogress'
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';

import type { AppProps } from 'next/app';
import { ChakraProvider, Box, Portal, useDisclosure } from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import AppContextWrapper from '@/contextWrapper';
import Script from 'next/script';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

function App({ Component, pageProps }: AppProps<{}>) {
  const pathname = usePathname();
  const activeRoute = getActiveRoute(routes, pathname);
  const { onOpen } = useDisclosure();
  
  const router = useRouter();
  useEffect(() => {
    router.events.on('routeChangeStart', () =>  NProgress.start());
    router.events.on('routeChangeComplete', () =>  NProgress.done());
    router.events.on('routeChangeError', () =>  NProgress.done());
  }, []);

  return (
    <>
      <Head>
        <title>
          {activeRoute === 'AnalyseTrend' ? 'AnalyseTrend - AI-Powered Trend Analysis' : `${activeRoute} | AnalyseTrend`}
        </title>
      </Head>

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-SLLYJNKQ7W"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-SLLYJNKQ7W');
        `}
      </Script>
      
      <ChakraProvider theme={theme}>
        <UserProvider>
          <AppContextWrapper>
            <Box>
              <Sidebar />
              <Box
                pt={{ base: '60px', md: '100px' }}
                float="right"
                minHeight="100vh"
                height="100%"
                overflow="auto"
                position="relative"
                maxHeight="100%"
                w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                transitionDuration=".2s, .2s, .35s"
                transitionProperty="top, bottom, width"
                transitionTimingFunction="linear, linear, ease"
              >
                <Portal>
                  <Box>
                    <Navbar
                      onOpen={onOpen}
                      logoText={'AnalyseTrend'}
                      brandText={activeRoute}
                    />
                  </Box>
                </Portal>
                <Box
                  mx="auto"
                  p={{ base: '20px', md: '30px' }}
                  pe="20px"
                  minH="100vh"
                  pt="50px"
                >
                  <Component {...pageProps} />
                </Box>
                <Box>
                  <Footer />
                </Box>
              </Box>
            </Box>
          </AppContextWrapper>
        </UserProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
