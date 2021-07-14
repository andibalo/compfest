/* eslint-disable */
import { React, useEffect } from 'react';
// routes

import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { setAuthToken } from './utils/setAuthToken';

// ----------------------------------------------------------------------

export default function App() {
  useEffect(() => {
    if (localStorage.getItem('currentUser')) {
      setAuthToken(JSON.parse(localStorage.getItem('currentUser')).token);
    }
  }, []);

  return (
    <ThemeConfig>
      <ScrollToTop />
      <Router />
    </ThemeConfig>
  );
}
