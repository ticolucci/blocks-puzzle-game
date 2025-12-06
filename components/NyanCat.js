import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Image } from 'react-native';
import { GAME_CONFIG, RAINBOW_COLORS } from '../constants/gameConfig';

/**
 * Nyan Cat animation component that flies across the screen
 * @param {boolean} visible - Whether the animation should be visible
 */
export default function NyanCat({ visible }) {
  const translateX = useRef(new Animated.Value(GAME_CONFIG.NYAN_CAT_START_POSITION)).current;

  useEffect(() => {
    if (visible) {
      // Reset position to left of screen
      translateX.setValue(GAME_CONFIG.NYAN_CAT_START_POSITION);

      // Animate across the screen
      Animated.timing(translateX, {
        toValue: GAME_CONFIG.NYAN_CAT_END_POSITION,
        duration: GAME_CONFIG.NYAN_CAT_ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateX]);

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, { top: GAME_CONFIG.NYAN_CAT_VERTICAL_POSITION }]} testID="nyan-cat-animation">
      <Animated.View
        style={[
          styles.nyanCat,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.rainbow}>
          {RAINBOW_COLORS.map((color, index) => (
            <View key={index} style={[styles.rainbowStripe, { backgroundColor: color }]} />
          ))}
        </View>
        <Image style={styles.cat} source={require('../assets/nyan-cat.gif')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  nyanCat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cat: {
    zIndex: 2,
  },
  rainbow: {
    flexDirection: 'column',
    zIndex: 1,
  },
  rainbowStripe: {
    width: 50,
    height: 10,
  },
});
