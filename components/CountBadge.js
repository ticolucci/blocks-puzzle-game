import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

/**
 * A count badge component showing a number in a circular badge
 * Typically used for item counts in inventory
 *
 * @component
 * @param {number} count - Number to display in the badge
 * @param {string} testID - Optional test ID
 */
function CountBadge({ count, testID }) {
  return (
    <View style={styles.badge} testID={testID}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
}

CountBadge.propTypes = {
  count: PropTypes.number.isRequired,
  testID: PropTypes.string,
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CountBadge;
