import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function HighScoresList({ scores }) {
  if (!scores || scores.length === 0) {
    return null;
  }

  const renderScoreItem = ({ item, index }) => (
    <View style={styles.scoreRow}>
      <Text style={styles.rank}>{index + 1}.</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>
      <FlatList
        data={scores}
        renderItem={renderScoreItem}
        keyExtractor={(item, index) => `${item.name}-${item.score}-${index}`}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
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
});
