import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORES_KEY = 'high_scores';
const MAX_HIGH_SCORES = 3;

/**
 * Retrieve all high scores from storage
 * @returns {Promise<Array<{name: string, score: number}>>} Array of high scores sorted by score descending
 */
export async function getHighScores() {
  try {
    const data = await AsyncStorage.getItem(HIGH_SCORES_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting high scores:', error);
    return [];
  }
}

/**
 * Save a new high score
 * @param {string} name - 3-letter player name
 * @param {number} score - The score to save
 */
export async function saveHighScore(name, score) {
  try {
    const existingScores = await getHighScores();

    // Add new score
    const updatedScores = [...existingScores, { name, score }];

    // Sort by score descending
    updatedScores.sort((a, b) => b.score - a.score);

    // Keep only top 3
    const topScores = updatedScores.slice(0, MAX_HIGH_SCORES);

    await AsyncStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores));
  } catch (error) {
    console.error('Error saving high score:', error);
  }
}

/**
 * Get the maximum score from all high scores
 * @returns {Promise<number>} The highest score, or 0 if no scores exist
 */
export async function getMaxScore() {
  try {
    const scores = await getHighScores();
    if (scores.length === 0) {
      return 0;
    }
    return scores[0].score;
  } catch (error) {
    console.error('Error getting max score:', error);
    return 0;
  }
}

/**
 * Check if a score qualifies as a high score (top 3)
 * @param {number} score - The score to check
 * @returns {Promise<boolean>} True if the score qualifies for top 3
 */
export async function isHighScore(score) {
  try {
    const scores = await getHighScores();

    // If fewer than max scores, it's automatically a high score
    if (scores.length < MAX_HIGH_SCORES) {
      return true;
    }

    // Check if score is higher than the lowest score in top 3
    const lowestTopScore = scores[scores.length - 1].score;
    return score > lowestTopScore;
  } catch (error) {
    console.error('Error checking if high score:', error);
    return false;
  }
}
