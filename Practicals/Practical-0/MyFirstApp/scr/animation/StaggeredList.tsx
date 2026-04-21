// StaggeredList.tsx
import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

const items = ['Dashboard', 'Orders', 'Profile', 'Settings', 'Help'];

const StaggeredList: React.FC = () => {
  // Create one animated value per list item
  const animValues = useRef(
    items.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Build an array of timing animations
    const animations = animValues.map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );

    // Stagger them — each starts 80ms after the previous
    Animated.stagger(80, animations).start();
  }, []);

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const opacity = animValues[index];
        const translateX = animValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0],
        });

        return (
          <Animated.View
            key={item}
            style={[
              styles.item,
              { opacity, transform: [{ translateX }] },
            ]}
          >
            <Text style={styles.itemText}>{item}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default StaggeredList;
