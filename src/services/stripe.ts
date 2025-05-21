import { Stripe } from '@stripe/stripe-react-native';
import { PermissionsAndroid } from 'react-native';

export const stripe = Stripe;

export const initializeStripe = async () => {
    async function init() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'Stripe Terminal needs access to your location',
              buttonPositive: 'Accept',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the Location');
          } else {
            console.error(
              'Location services are required to connect to a reader.'
            );
          }
        } catch {}
      }
      init();
  await stripe.setOptions({
    publishableKey: 'pk_test_51ROGURQ3cCv4PTlbdop0BJSuj5x7ziBs0GH2qD1BLhZ510SV8JtS6jknHhZNMGabVtvYG59xhflIgJl0tVjesa7v00uiXOcAX7',
    merchantIdentifier: 'merchant.com.acms',
    urlScheme: 'acms',
  });
};

export const createPaymentIntent = async (amount: number, currency: string = 'eur') => {
  try {
    const response = await fetch('http://localhost:8000/api/stripe/payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    });

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
