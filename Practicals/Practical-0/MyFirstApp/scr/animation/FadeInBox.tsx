// FadeInBox.tsx
import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, Text } from 'react-native';

const FadeInBox: React.FC = () => {
  // Step 1: Create the animated value, starting at 0 (invisible)
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 3: When the component mounts, start the animation
    Animated.timing(opacity, {
      toValue: 1,          // Fade to fully visible
      duration: 5000,      // Takes 1.5 seconds
      useNativeDriver: true,
    }).start();
  }, []); // Empty dependency array = runs once on mount

  return (
    // Step 2: Use Animated.View and connect the animated value
    <View style={styles.container}>
      <Animated.View style={[styles.box, { opacity: opacity }]}>
        <Text style={styles.text}>Hello, I faded in!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 200,
    height: 100,
    backgroundColor: '#FFA02E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  text: {
    color: '#021A54',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FadeInBox;

