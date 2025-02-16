import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* 🎥 Bakgrunnsvideo */}
      <Video
        source={require('../assets/background-video.mp4')} // 🎥 Legg videoen i assets-mappen
        style={styles.backgroundVideo}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />

      {/* 📌 Innhold over videoen */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Velkommen til KitchenApp</Text>
        <Text style={styles.subtitle}>Planlegg måltider, lag handlelister og hold styr på matlagingen!</Text>
      </View>
    </View>
  );
};

// 🔹 Stiler for skjermen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 🔹 Gjør teksten mer lesbar med en mørk gjennomsiktig bakgrunn
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // 🔹 Hvit tekst for bedre synlighet
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default HomeScreen;
