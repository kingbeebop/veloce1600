"use client";

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from '../redux/store';
import Banner from '../components/Banner';
import theme from '../theme/theme'; // Adjust the import based on your theme file location

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        {/* You can add additional metadata or links here */}
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* This applies the default Material-UI styles */}
          <Banner />
          <Provider store={store}>
            {children}
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
