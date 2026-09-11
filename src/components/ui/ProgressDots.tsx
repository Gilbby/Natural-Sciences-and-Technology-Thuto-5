import { StyleSheet, Text, View } from 'react-native';

import { colours, space } from '@/theme/tokens';

/**
 * Where the child is in the lesson, as pictures rather than "3 of 5"
 * (PRD §6.3). Done steps are stars; the current step is a filled circle.
 */
export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, index) => {
        if (index < current) {
          return (
            <Text key={index} style={styles.star}>
              ⭐
            </Text>
          );
        }
        return (
          <View
            key={index}
            style={[styles.dot, index === current ? styles.dotCurrent : styles.dotToDo]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  star: { fontSize: 20 },
  dot: { width: 16, height: 16, borderRadius: 8 },
  dotCurrent: { backgroundColor: colours.primary, width: 22, height: 22, borderRadius: 11 },
  dotToDo: { backgroundColor: colours.starEmpty },
});
