import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { isHighScore, saveHighScore } from '../utils/highScores';

export default function GameOverModal({ visible, score, onRestart }) {
  const [playerName, setPlayerName] = useState('');
  const [isHighScoreValue, setIsHighScoreValue] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (visible) {
      // Check if this score is a high score
      isHighScore(score).then(result => {
        setIsHighScoreValue(result);
      });
      // Reset state when modal becomes visible
      setPlayerName('');
      setIsSaving(false);
      setErrorMessage('');
    }
  }, [visible, score]);

  const handleNameChange = (text) => {
    // Clear error when user starts editing again
    if (errorMessage) {
      setErrorMessage('');
    }

    // Remove non-letter characters and convert to uppercase
    const cleanedText = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
    // Limit to 3 characters
    const limitedText = cleanedText.slice(0, 3);
    setPlayerName(limitedText);
  };

  const handleSaveScore = async () => {
    if (playerName.length !== 3) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      await saveHighScore(playerName, score);
      onRestart();
    } catch (error) {
      console.error('Error saving high score:', error);
      setErrorMessage('Failed to save high score. Please try again.');
      setIsSaving(false);
    }
  };

  const isSubmitDisabled = playerName.length !== 3 || isSaving;

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

          {isHighScoreValue ? (
            <>
              <Text style={styles.highScoreMessage}>New High Score!</Text>
              <Text style={styles.instructionText}>Enter your initials:</Text>
              <TextInput
                style={styles.input}
                value={playerName}
                onChangeText={handleNameChange}
                placeholder="AAA"
                maxLength={3}
                autoCapitalize="characters"
                autoFocus={true}
                accessibilityLabel="Enter your 3-letter name"
              />
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
              <TouchableOpacity
                style={[styles.button, isSubmitDisabled && styles.buttonDisabled]}
                onPress={handleSaveScore}
                disabled={isSubmitDisabled}
                accessibilityLabel="Save your high score"
                accessibilityRole="button"
                accessibilityState={{ disabled: isSubmitDisabled }}
              >
                <Text style={styles.buttonText}>Save Score</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={onRestart}
              accessibilityLabel="Start a new game"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>New Game</Text>
            </TouchableOpacity>
          )}
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
    minWidth: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 18,
    marginBottom: 15,
  },
  highScoreMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
  },
  input: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 100,
    marginBottom: 10,
    letterSpacing: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
