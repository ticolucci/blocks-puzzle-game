import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

export default function GameOverModal({ visible, score, onRestart }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Game Over</Text>
          <Text style={styles.scoreLabel}>Score: {score}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onRestart}
            accessibilityLabel="Start a new game"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 18,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
