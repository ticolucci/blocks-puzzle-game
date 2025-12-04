import { View, Text, StyleSheet, Modal } from 'react-native';

export default function GameOverModal({ visible, score }) {
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
  },
});
