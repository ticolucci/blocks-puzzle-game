import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { getHighScores } from '../utils/highScores';
import HighScoresList from '../components/HighScoresList';

export default function HomeScreen({ navigation }) {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    loadHighScores();
  }, []);

  // Reload scores when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHighScores();
    });

    return unsubscribe;
  }, [navigation]);

  const loadHighScores = async () => {
    const scores = await getHighScores();
    setHighScores(scores);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HighScoresList scores={highScores} />

        <View style={styles.buttonContainer}>
          <Button
            title="New Game"
            onPress={() => navigation.navigate('Game')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  content: {
    width: '80%',
    maxWidth: 400,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
