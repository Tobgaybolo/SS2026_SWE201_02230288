// LoadingScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        // Local Lottie JSON downloaded from LottieFiles.
        source={require('../../assets/animations/loading-spinner.json')}
        autoPlay    // Start playing immediately
        loop        // Loop forever
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default LoadingScreen;
