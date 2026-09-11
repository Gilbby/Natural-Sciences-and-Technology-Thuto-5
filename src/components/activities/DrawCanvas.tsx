import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { speakLabel } from '@/audio/feedback';
import { BigButton } from '@/components/ui/BigButton';
import { t, ui } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { DrawCanvasActivity } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `draw-canvas` — finger-draw with big crayons (PRD §7; booklet A4,
 * assessment Q4). SVG + PanResponder so it runs in Expo Go (PRD §9.1).
 *
 * There is nothing to get wrong here: the child draws, then taps "I'm done".
 */

interface Stroke {
  d: string;
  colour: string;
}

const STROKE_WIDTH = 10;
const DEFAULT_COLOURS = [
  colours.primary,
  colours.green,
  colours.amber,
  colours.pink,
  colours.purple,
  colours.ink,
];

export function DrawCanvas({ activity, onFinished }: ActivityViewProps<DrawCanvasActivity>) {
  const { width } = useWindowDimensions();
  const palette = activity.colours?.length ? activity.colours : DEFAULT_COLOURS;

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [livePath, setLivePath] = useState('');
  const [activeColour, setActiveColour] = useState(palette[0]);
  const finished = useRef(false);

  const liveRef = useRef('');
  const colourRef = useRef(activeColour);
  useEffect(() => {
    colourRef.current = activeColour;
  }, [activeColour]);

  const canvasWidth = width - space.lg * 2;
  const canvasHeight = Math.min(380, Math.round(canvasWidth * 0.95));

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          liveRef.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
          setLivePath(liveRef.current);
        },
        onPanResponderMove: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          liveRef.current += ` L ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
          setLivePath(liveRef.current);
        },
        onPanResponderRelease: () => {
          const drawn = liveRef.current;
          liveRef.current = '';
          setLivePath('');
          if (!drawn) return;
          // A single tap should still leave a dot behind.
          const d = drawn.includes('L') ? drawn : `${drawn} l 0.5 0.5`;
          setStrokes((prev) => [...prev, { d, colour: colourRef.current }]);
        },
        onPanResponderTerminate: () => {
          liveRef.current = '';
          setLivePath('');
        },
      }),
    [],
  );

  const undo = useCallback(() => {
    speakLabel(t(ui.undo));
    setStrokes((prev) => prev.slice(0, -1));
  }, []);

  const clear = useCallback(() => {
    speakLabel(t(ui.clear));
    setStrokes([]);
  }, []);

  const done = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinished({ correct: true, attempts: 1 });
  }, [onFinished]);

  return (
    <View style={styles.container}>
      <View
        style={[styles.canvas, shadow.card, { width: canvasWidth, height: canvasHeight }]}
        accessibilityLabel="Drawing area. Draw with your finger."
        {...panResponder.panHandlers}
      >
        <Svg width={canvasWidth} height={canvasHeight}>
          {strokes.map((stroke, index) => (
            <Path
              key={index}
              d={stroke.d}
              stroke={stroke.colour}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
          {livePath !== '' && (
            <Path
              d={livePath}
              stroke={activeColour}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </Svg>
      </View>

      <View style={styles.crayons}>
        {palette.map((colour) => (
          <Pressable
            key={colour}
            onPress={() => {
              setActiveColour(colour);
              speakLabel('Colour picked');
            }}
            accessibilityRole="button"
            accessibilityLabel="Crayon colour"
            style={[
              styles.crayon,
              shadow.card,
              {
                backgroundColor: colour,
                borderColor: activeColour === colour ? colours.ink : 'transparent',
                transform: [{ scale: activeColour === colour ? 1.1 : 1 }],
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.tools}>
        <Pressable
          onPress={undo}
          accessibilityRole="button"
          accessibilityLabel={t(ui.undo)}
          style={[styles.tool, shadow.card]}
        >
          <Text style={styles.toolEmoji}>↩️</Text>
        </Pressable>
        <Pressable
          onPress={clear}
          accessibilityRole="button"
          accessibilityLabel={t(ui.clear)}
          style={[styles.tool, shadow.card]}
        >
          <Text style={styles.toolEmoji}>🧽</Text>
        </Pressable>
        <BigButton emoji="✅" label={t(ui.done)} tone="happy" onPress={done} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.lg, alignItems: 'center' },
  canvas: {
    backgroundColor: colours.surface,
    borderRadius: size.radiusLg,
    borderWidth: 3,
    borderColor: colours.border,
    overflow: 'hidden',
  },
  crayons: { flexDirection: 'row', gap: space.md, justifyContent: 'center' },
  crayon: {
    width: size.touchMin,
    height: size.touchMin,
    borderRadius: size.touchMin / 2,
    borderWidth: 4,
  },
  tools: { flexDirection: 'row', gap: space.md, alignItems: 'center', justifyContent: 'center' },
  tool: {
    width: size.touchMin,
    height: size.touchMin,
    borderRadius: size.touchMin / 2,
    backgroundColor: colours.surface,
    borderWidth: 3,
    borderColor: colours.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolEmoji: { fontSize: type.emojiSm },
});
