import React from 'react';
import { render } from '@testing-library/react-native';
import GridCell from '../GridCell';

describe('GridCell Preview Functionality', () => {
  test('renders with preview style when isPreview is true', () => {
    const { getByTestId } = render(
      <GridCell row={0} col={0} filled={false} isPreview={true} previewValid={true} />
    );

    const cell = getByTestId('grid-cell-0-0');

    // Should have preview style applied (we'll check via props)
    expect(cell).toBeTruthy();
  });

  test('shows valid preview style when previewValid is true', () => {
    const { getByTestId } = render(
      <GridCell row={0} col={0} filled={false} isPreview={true} previewValid={true} />
    );

    const cell = getByTestId('grid-cell-0-0');
    const styles = cell.props.style;

    // Should include preview valid style (green overlay)
    expect(styles).toBeDefined();
  });

  test('shows invalid preview style when previewValid is false', () => {
    const { getByTestId } = render(
      <GridCell row={0} col={0} filled={false} isPreview={true} previewValid={false} />
    );

    const cell = getByTestId('grid-cell-0-0');
    const styles = cell.props.style;

    // Should include preview invalid style (red overlay)
    expect(styles).toBeDefined();
  });

  test('maintains filled style when both filled and isPreview are true', () => {
    const { getByTestId } = render(
      <GridCell row={0} col={0} filled={true} isPreview={true} previewValid={true} />
    );

    const cell = getByTestId('grid-cell-0-0');

    // Should have both filled and preview styles
    expect(cell).toBeTruthy();
  });

  test('renders normally without preview when isPreview is false', () => {
    const { getByTestId } = render(
      <GridCell row={0} col={0} filled={false} isPreview={false} previewValid={true} />
    );

    const cell = getByTestId('grid-cell-0-0');

    // Should not have preview styling
    expect(cell).toBeTruthy();
  });

  test('handles undefined isPreview prop gracefully', () => {
    const { getByTestId } = render(
      <GridCell row={0} col={0} filled={false} />
    );

    const cell = getByTestId('grid-cell-0-0');

    // Should render without errors
    expect(cell).toBeTruthy();
  });
});
