import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Rect } from 'react-native-svg';

/**
 * Solid color SVG component for grid cells and piece blocks
 * @param {string} color - Hex color code
 * @param {number} size - Size of the SVG (width and height)
 */
export default function SolidColorSVG({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x="0" y="0" width={size} height={size} fill={color} />
    </Svg>
  );
}

SolidColorSVG.propTypes = {
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};
