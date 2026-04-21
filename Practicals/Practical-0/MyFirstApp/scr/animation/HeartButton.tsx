// HeartButton.tsx
import React, { useState } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const HeartButton: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * 1.5 }],
  }));

  const handlePress = () => {
    setLiked((prev) => !prev);

    // Pop animation: scale up then spring back
    scale.value = withSequence(
      withTiming(1.4, { duration: 100 }),
      withSpring(1, { damping: 6, stiffness: 200 }),
    );

    // Flash a big heart overlay
    opacity.value = withSequence(
      withTiming(1, { duration: 80 }),
      withTiming(0, { duration: 400 }),
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {/* Big overlay heart that flashes */}
        <Animated.Text style={[styles.overlayHeart, animatedOverlayStyle]}>
          ❤️
        </Animated.Text>

        {/* The actual like button */}
        <Animated.Text style={[styles.heart, animatedHeartStyle]}>
          {liked ? '❤️' : '🤍'}
        </Animated.Text>
        <Text style={styles.label}>{liked ? 'Liked' : 'Like'}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlayHeart: {
    position: 'absolute',
    fontSize: 80,
  },
  heart: {
    fontSize: 40,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
});

export default HeartButton;
