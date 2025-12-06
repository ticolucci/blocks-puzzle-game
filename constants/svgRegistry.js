import React from 'react';
import SolidColorSVG from '../components/svgs/SolidColorSVG';
import { COLORS, RAINBOW_COLORS } from './gameConfig';

/**
 * SVG Registry - Maps SVG IDs to SVG component configurations
 * Structure: { [svgId]: { component: Component, props: {...} } }
 */
export const SVG_REGISTRY = {
  // Solid color SVGs from COLOR_POOL
  'solid-red': { component: SolidColorSVG, props: { color: COLORS.RED } },
  'solid-blue': { component: SolidColorSVG, props: { color: COLORS.BLUE } },
  'solid-green': { component: SolidColorSVG, props: { color: '#00FF00' } },
  'solid-yellow': { component: SolidColorSVG, props: { color: '#FFFF00' } },
  'solid-purple': { component: SolidColorSVG, props: { color: '#800080' } },
  'solid-pink': { component: SolidColorSVG, props: { color: '#FFC0CB' } },

  // Rainbow colors (for rainbow piece)
  'rainbow-red': { component: SolidColorSVG, props: { color: RAINBOW_COLORS[0] } },
  'rainbow-orange': { component: SolidColorSVG, props: { color: RAINBOW_COLORS[1] } },
  'rainbow-yellow': { component: SolidColorSVG, props: { color: RAINBOW_COLORS[2] } },
  'rainbow-green': { component: SolidColorSVG, props: { color: RAINBOW_COLORS[3] } },
  'rainbow-blue': { component: SolidColorSVG, props: { color: RAINBOW_COLORS[4] } },

  // Bomb piece (grey)
  'solid-grey': { component: SolidColorSVG, props: { color: '#808080' } },
};

/**
 * Helper to render an SVG by ID
 * @param {string} svgId - SVG identifier from SVG_REGISTRY
 * @param {number} size - Size to render the SVG
 * @returns {JSX.Element|null} SVG component or null if not found
 */
export function renderSVG(svgId, size) {
  const svgConfig = SVG_REGISTRY[svgId];
  if (!svgConfig) {
    console.warn(`SVG ID "${svgId}" not found in registry`);
    return null;
  }

  const { component: Component, props } = svgConfig;
  return <Component {...props} size={size} />;
}
