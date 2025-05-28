import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import Stripe from '@stripe/stripe-react-native';
interface PaymentScreenProps {
  clientSecret: string;
  amount: number;
}

export const PaymentScreen = ({ clientSecret, amount }: PaymentScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const { error } = await Stripe.initPaymentSheet({
        merchantDisplayName: 'ACMS donation',
        customFlow: true,
        allowsDelayedPaymentMethods: true,
        returnURL: 'acms://stripe-redirect',
        paymentIntentClientSecret: clientSecret,
      });

      if (error) {
        setError(error.message);
        return;
      }
    } catch (err) {
      setError('Failed to initialize payment');
      console.error('Error initializing payment sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { error } = await Stripe.presentPaymentSheet({
        clientSecret,
        customFlow: true,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Payment successful
      Alert.alert('Success', 'Payment completed successfully');
    } catch (err) {
      setError('Payment failed');
      console.error('Error presenting payment sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay with Tap to Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
