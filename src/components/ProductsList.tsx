import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createPaymentIntent } from '../services/stripe';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const ProductsList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/stripe/products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = async (product: Product) => {
    try {
      const clientSecret = await createPaymentIntent(product.price);
      navigation.navigate('Payment', {
        clientSecret,
        amount: product.price,
      });
    } catch (error) {
      console.error('Error selecting product:', error);
    }
  };

  if (loading) {
    return <Text>Loading products...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productItem}
            onPress={() => handleProductSelect(item)}
          >
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
