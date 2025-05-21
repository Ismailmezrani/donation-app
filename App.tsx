/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import { initializeStripe } from './src/services/stripe';
import { Navigation } from './src/navigation/Navigation';

export default function App() {
  useEffect(() => {
    initializeStripe();
  }, []);

  return <Navigation />;
}
