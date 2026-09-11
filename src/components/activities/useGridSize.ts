import { useWindowDimensions } from 'react-native';

import { size, space } from '@/theme/tokens';

/**
 * Cards scale to the screen so a budget phone shows the same grid as a tablet,
 * and never below the minimum touch target (PRD §4.3, §9.4).
 */
export function useGridSize(itemCount: number, options?: { maxColumns?: number; padding?: number }) {
  const { width } = useWindowDimensions();
  const padding = options?.padding ?? space.lg * 2;
  const maxColumns = options?.maxColumns ?? 4;

  const columns = Math.min(maxColumns, Math.max(2, itemCount <= 4 ? 2 : itemCount <= 6 ? 3 : maxColumns));
  const available = width - padding - space.sm * (columns - 1);
  const cardSize = Math.max(size.touchMin, Math.floor(available / columns));

  return { columns, cardSize, width };
}
