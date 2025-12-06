import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function PieceBlock({ color, size = 20, isPressed = false, icon = null }) {
  return (
    <View
      style={[
        styles.block,
        {
          width: size,
          height: size,
          backgroundColor: color,
        },
        isPressed && styles.pressed,
      ]}
    >
      {/* Inner highlight for 3D effect */}
      <View style={styles.highlight} />

      {/* Icon overlay (e.g., bomb emoji) */}
      {icon && (
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { fontSize: size * 0.6 }]}>{icon}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});
