import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const BlinkingHeart = ({ size = 30, color = "#FF1493" }) => {
  const opacity = new Animated.Value(0.3);

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      <AntDesign name="heart" size={size} color={color} />
    </Animated.View>
  );
};

export default BlinkingHeart;
