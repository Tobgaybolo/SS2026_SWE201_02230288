import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnimationDemoScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [dragAnim] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  // Fade in/out animation
  const startFadeAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
        delay: 1000,
      }),
    ]).start(() => fadeAnim.setValue(0));
  };

  // Slide transition animation
  const startSlideAnimation = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
        delay: 800,
      }),
    ]).start(() => slideAnim.setValue(0));
  };

  // Scale/Bounce animation
  const startScaleAnimation = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        friction: 4,
        tension: 100,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Drag handler
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: dragAnim.x, dy: dragAnim.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        Animated.spring(dragAnim, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          tension: 100,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const slideTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Animations</Text>
          <Text style={styles.subtitle}>Interactive demos</Text>
        </View>

        <View style={styles.container}>
          {/* Fade Animation */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Fade In / Out</Text>
              <Text style={styles.apiLabel}>Animated API</Text>
            </View>
            <View style={styles.demoContainer}>
              <Animated.View style={[styles.demoBox, { opacity: fadeAnim }]}>
                <Text style={styles.demoText}>Fading</Text>
              </Animated.View>
            </View>
            <Pressable style={styles.button} onPress={startFadeAnimation}>
              <Text style={styles.buttonText}>Trigger Fade</Text>
            </Pressable>
          </View>

          {/* Slide Transition */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Slide transition</Text>
              <Text style={styles.apiLabel}>translateX</Text>
            </View>
            <View style={styles.slideContainer}>
              <View style={styles.slideTrack}>
                <Text style={styles.slideLabel}>Screen A</Text>
                <Text style={styles.slideArrow}>→</Text>
              </View>
              <Animated.View
                style={[
                  styles.slideBox,
                  { transform: [{ translateX: slideTranslateX }] },
                ]}
              >
                <Text style={styles.slideBoxText}>Screen B</Text>
              </Animated.View>
            </View>
            <Pressable style={styles.button} onPress={startSlideAnimation}>
              <Text style={styles.buttonText}>Trigger Slide</Text>
            </Pressable>
          </View>

          {/* Drag Gesture */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Drag gesture</Text>
              <Text style={styles.apiLabel}>PanResponder</Text>
            </View>
            <View style={styles.dragContainer}>
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.draggableBox,
                  {
                    transform: [
                      { translateX: dragAnim.x },
                      { translateY: dragAnim.y },
                    ],
                  },
                ]}
              >
                <Text style={styles.dragText}>≡</Text>
                <Text style={styles.dragLabel}>Drag me</Text>
              </Animated.View>
            </View>
            <Text style={styles.dragHint}>Press and drag the box around the container</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#7c5cff',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  container: {
    padding: 18,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  apiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    backgroundColor: '#f0f4f8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  demoContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f5ff',
    borderRadius: 12,
  },
  demoBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#7c5cff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  slideContainer: {
    height: 120,
    marginBottom: 12,
    position: 'relative',
  },
  slideTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    marginBottom: 12,
  },
  slideLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c5cff',
    borderWidth: 2,
    borderColor: '#7c5cff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  slideArrow: {
    marginHorizontal: 12,
    fontSize: 18,
    color: '#7c5cff',
  },
  slideBox: {
    width: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#7c5cff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideBoxText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  dragContainer: {
    height: 180,
    backgroundColor: '#f9f5ff',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e6c5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  draggableBox: {
    width: 100,
    height: 100,
    backgroundColor: '#7c5cff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 24,
  },
  dragLabel: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  },
  dragHint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7c5cff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
});

