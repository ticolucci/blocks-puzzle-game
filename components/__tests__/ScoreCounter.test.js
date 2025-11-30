import React from 'react';
import { render } from '@testing-library/react-native';
import ScoreCounter from '../ScoreCounter';

describe('ScoreCounter', () => {
  test('displays score with default value of 0', () => {
    const { getByText } = render(<ScoreCounter />);
    expect(getByText('0')).toBeTruthy();
  });

  test('displays provided score value', () => {
    const { getByText } = render(<ScoreCounter score={150} />);
    expect(getByText('150')).toBeTruthy();
  });

  test('displays "Score" label', () => {
    const { getByText } = render(<ScoreCounter score={42} />);
    expect(getByText('Score')).toBeTruthy();
  });

  test('has accessible label', () => {
    const { getByLabelText } = render(<ScoreCounter score={42} />);
    expect(getByLabelText('Score: 42')).toBeTruthy();
  });
});
