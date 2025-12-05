import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GAME_CONFIG } from '../constants/gameConfig';

export default function ScoreCounter({ score = GAME_CONFIG.INITIAL_SCORE, maxScore }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate score when it changes
    if (score > 0) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 100,
          friction: 3,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 5,
        }),
      ]).start();
    }
  }, [score, scaleAnim]);

  // Calculate responsive font size based on number of digits
  const scoreFontSize = useMemo(() => {
    const digits = score.toString().length;
    if (digits <= 3) return 72;
    if (digits === 4) return 60;
    if (digits === 5) return 50;
    if (digits === 6) return 42;
    return Math.max(28, 72 - (digits - 3) * 10);
  }, [score]);

  return (
    <View
      style={styles.container}
      accessibilityLabel={`Score: ${score}`}
    >
      <Text style={styles.label}>Score</Text>
      <Animated.Text
        style={[
          styles.score,
          { fontSize: scoreFontSize, transform: [{ scale: scaleAnim }] }
        ]}
      >
        {score}
      </Animated.Text>
      {maxScore !== undefined && (
        <Text style={styles.maxScore}>Max: {maxScore}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  score: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  maxScore: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
});
