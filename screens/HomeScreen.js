import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, FlatList } from 'react-native';
import { getHighScores } from '../utils/highScores';

export default function HomeScreen({ navigation }) {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = async () => {
    const scores = await getHighScores();
    setHighScores(scores);
  };

  const renderScoreItem = ({ item, index }) => (
    <View style={styles.scoreRow}>
      <Text style={styles.rank}>{index + 1}.</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {highScores.length > 0 && (
          <View style={styles.highScoresContainer}>
            <Text style={styles.highScoresTitle}>High Scores</Text>
            <FlatList
              data={highScores}
              renderItem={renderScoreItem}
              keyExtractor={(item, index) => `${item.name}-${item.score}-${index}`}
              scrollEnabled={false}
            />
          </View>
        )}

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
  highScoresContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highScoresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
    color: '#666',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
    letterSpacing: 4,
  },
  score: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
