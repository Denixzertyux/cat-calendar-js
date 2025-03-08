import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

// Array to store cat image URLs
const catImages = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=150',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=150',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=150',
  'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=150',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=150',
  'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=150',
  'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=150',
  'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=150',
  'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=150',
  'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=150',
  'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=150',
];

const CatImage = ({ date, style, size = 60 }) => {
  // Get a cat image based on the day or month
  const getCatImage = () => {
    // If we have a date, use the month (0-11) to select an image
    if (date && date.getMonth) {
      try {
        const month = date.getMonth();
        return month >= 0 && month < catImages.length 
          ? catImages[month] 
          : catImages[0];
      } catch (error) {
        console.error('Error getting month:', error);
        return catImages[0];
      }
    }
    // Otherwise return the first image
    return catImages[0];
  };

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={{ uri: getCatImage() }} 
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Default positioning removed to make component more flexible
  },
  image: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#f0f0f0',
  },
});

export default CatImage;
