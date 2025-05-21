import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsList } from '../components/ProductsList';
import { PaymentScreen } from '../screens/PaymentScreen';

// Define types for our navigation
export type RootStackParamList = {
  Products: undefined;
  Payment: {
    clientSecret: string;
    amount: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Products">
        <Stack.Screen 
          name="Products" 
          component={ProductsList}
          options={{ title: 'Products' }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen}
          options={{ title: 'Payment' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
