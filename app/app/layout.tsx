"use client";

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import store from '../redux/store';
import Banner from '../components/Banner';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: 'Helvetica Neue, Arial, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#f0f0f0',
      },
    },
  },
});

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        {/* You can add additional metadata or links here */}
      </head>
      <body>
        <ChakraProvider theme={theme}>
          <CSSReset />
          <Banner />
          <Provider store={store}>
            {children}
          </Provider>
        </ChakraProvider>
      </body>
    </html>
  );
};

export default RootLayout;
