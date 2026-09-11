import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { celebrateCorrect, celebrateFinish, nudgeRetry, speakLabel } from '@/audio/feedback';
import { speak, speakLines, speakSequence, stopSpeaking } from '@/audio/speech';
import { BigButton } from '@/components/ui/BigButton';
import { promptText, t, ui } from '@/i18n';
import { colours, reading, shadow, size, space, type } from '@/theme/tokens';
import type { LineRole, ReadTextActivity, TextLine } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `read-text` — the component this app is for (PRD §7.1, §7.2).
 *
 * Everything else in the library is practice around this, and this is the only
 * interaction component the fork edits. Five behaviours, and the whole design
 * of the app is in them:
 *
 *   1. **Every word is a tap target.** Tapping speaks that word alone, at word
 *      pace, and lifts it. This never turns off, in any term, in the Star
 *      Challenge, on the last day of the year (PRD §4.1, §8.2c rule 2).
 *   2. **Tapping a line** speaks the line and marks it.
 *   3. **The speaker button** reads the whole text, line by line, with the
 *      highlight following the voice — the "read it to me" that PRD §4.1
 *      promises is always in the same place.
 *   4. **`mode` changes what happens on entry, and nothing else.** `app-first`
 *      reads the text once before the child does anything; `child-first` stays
 *      silent and waits. That is the entire mechanical difference between term
 *      1 and term 4 (PRD §8.2c).
 *   5. **`layout` changes how the lines are arranged, and nothing else.** A
 *      poster has a headline and fine print; a chart is labels against values;
 *      an article has a headline, a by-line and a lead. Every region is still a
 *      `TextLine` with real words in it, and **every word still speaks on tap**
 *      — a poster here is a text with a shape, never an image (PRD §7.2).
 *
 * ── The rule that inverted, and the two that replaced it ───────────────────
 *
 * Every app in this family since Grade 1 was built on the rule that no answer
 * may live in a word. **This is the first one whose subject *is* the word**, so
 * the rule split: content text is shown and speaks on tap; chrome text still
 * carries no answer, ever (PRD §1.1). Support is never withdrawn — only
 * demoted. If you are ever tempted to hide the speaker in term 4 to make the
 * reading "real", read PRD §8.2c again: this app is built for the four in five
 * South African Grade 5s who cannot read for meaning in any language, and
 * hiding the audio loses them in week 2.
 *
 * A glossed word carries a dot; tapping it speaks the word *and* what it means,
 * and the gloss row under the text shows **a picture beside every meaning**,
 * because a meaning written in English explains nothing to a child whose
 * English is the thing being taught (PRD §8.2b).
 *
 * Finishing is a tap on "done", not a correctness judgement. The optional
 * question comes after, and a wrong answer replays the line the answer came
 * from. Never a red X (PRD §4.6).
 */
export function ReadText({
  activity,
  onFinished,
  onRegisterReplay,
  onRegisterIntro,
}: ActivityViewProps<ReadTextActivity>) {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [reading_, setReading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [answered, setAnswered] = useState<string | null>(null);
  const attempts = useRef(0);
  const finished = useRef(false);
  const cancelRead = useRef<(() => void) | null>(null);

  const lines = activity.lines;
  const layout = activity.layout ?? 'prose';
  const glossKeys = useMemo(
    () => new Set(Object.keys(activity.gloss).map((word) => word.toLowerCase())),
    [activity.gloss],
  );

  /** Stop any queued utterance. */
  const stopRead = useCallback(() => {
    cancelRead.current?.();
    cancelRead.current = null;
    setReading(false);
    setActiveLine(null);
  }, []);

  /**
   * Read the whole text, line by line, highlight following the voice.
   *
   * A laid-out text is read in exactly the order its lines are written, which
   * is why the author writes them in reading order: a poster read out of order
   * is a different poster (PRD §7.2).
   */
  const readWhole = useCallback(() => {
    stopRead();
    setActiveWord(null);
    setReading(true);
    cancelRead.current = speakLines(
      lines.map((line) => line.text),
      {
        onLine: (index) => setActiveLine(index),
        onDone: () => {
          setReading(false);
          setActiveLine(null);
          cancelRead.current = null;
        },
      },
    );
  }, [lines, stopRead]);

  /*
   * The ramp, and the only thing it touches (PRD §8.2c rule 2).
   *
   * `app-first` reads once on entry. `child-first` says nothing at all — the
   * child looks at the text and decides. The speaker button is in the same
   * place in both.
   */
  useEffect(() => {
    if (activity.mode !== 'app-first') return;
    if (onRegisterIntro) {
      // The read follows the prompt instead of racing it: any prompt longer
      // than a 400ms head start used to cut the first line off.
      onRegisterIntro(readWhole);
      return () => onRegisterIntro(null);
    }
    const timer = setTimeout(readWhole, 400);
    return () => clearTimeout(timer);
    // Deliberately once per activity: re-reading on every render would talk
    // over the child.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id, onRegisterIntro]);

  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    if (!onRegisterReplay) return;
    onRegisterReplay(readWhole);
    return () => onRegisterReplay(null);
  }, [onRegisterReplay, readWhole]);

  /** One word, spoken on its own. Plus its meaning where it is a budget word. */
  const tapWord = useCallback(
    (raw: string) => {
      stopRead();
      const key = raw.toLowerCase().replace(/[^a-z'-]/g, '');
      setActiveWord(key);
      const gloss = activity.gloss[key] ?? activity.gloss[raw];
      if (gloss) {
        speakSequence([key, t(gloss.meaning)]);
      } else {
        // Word pace, not sentence pace: this is the child stuck on one word.
        speak(key, { rate: 0.7 });
      }
    },
    [activity.gloss, stopRead],
  );

  const tapLine = useCallback(
    (index: number) => {
      stopRead();
      setActiveWord(null);
      setActiveLine(index);
      speak(lines[index].text, { onDone: () => setActiveLine(null) });
    },
    [lines, stopRead],
  );

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinished({ correct: true, attempts: Math.max(1, attempts.current) });
  }, [onFinished]);

  const done = useCallback(() => {
    stopRead();
    if (activity.question && !asking && answered === null) {
      setAsking(true);
      speak(promptText(activity.question.ask));
      return;
    }
    celebrateFinish(t(ui.wellDone));
    finish();
  }, [activity.question, asking, answered, finish, stopRead]);

  const answer = useCallback(
    (optionId: string) => {
      const question = activity.question;
      if (!question) return;
      attempts.current += 1;

      if (optionId === question.answerId) {
        setAnswered(optionId);
        celebrateCorrect();
        finish();
        return;
      }

      // Never a red X: the line the answer came from is read again, and the
      // child tries once more (PRD §7.1).
      const source = question.fromLineId
        ? lines.find((line) => line.id === question.fromLineId)
        : undefined;
      nudgeRetry(source ? `Listen again. ${source.text}` : promptText(question.ask));
    },
    [activity.question, finish, lines],
  );

  /**
   * One line's words, each its own tap target, plus the line speaker.
   *
   * This is the part that must be identical in all four layouts. A region of a
   * poster is not a picture of words; it is words (PRD §7.2, rule 3).
   */
  const renderWords = useCallback(
    (line: TextLine, index: number, textStyle?: object) => (
      <View style={styles.words}>
        {line.text.split(/\s+/).map((word, wordIndex) => {
          const key = word.toLowerCase().replace(/[^a-z'-]/g, '');
          const glossed = glossKeys.has(key);
          return (
            <Pressable
              key={`${line.id}-${wordIndex}`}
              onPress={() => tapWord(word)}
              accessibilityRole="button"
              accessibilityLabel={word}
              hitSlop={6}
              style={styles.wordTap}
            >
              <Text
                style={[
                  styles.word,
                  textStyle,
                  activeWord === key && styles.wordActive,
                  glossed && styles.wordGlossed,
                ]}
              >
                {word}
              </Text>
              {glossed && <View style={styles.glossDot} />}
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => tapLine(index)}
          accessibilityRole="button"
          accessibilityLabel={`Hear this line: ${line.text}`}
          hitSlop={6}
          style={styles.lineSpeaker}
        >
          <Text style={styles.lineSpeakerText}>🔊</Text>
        </Pressable>
      </View>
    ),
    [activeWord, glossKeys, tapLine, tapWord],
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.titleEmoji}>{activity.emoji}</Text>
        <Text style={styles.title}>{t(activity.title)}</Text>
      </View>

      <ScrollView
        style={[styles.sheet, layout !== 'prose' && LAYOUT_SHEET[layout]]}
        contentContainerStyle={styles.sheetInner}
      >
        {layout === 'chart' ? (
          <ChartLayout
            lines={lines}
            activeLine={activeLine}
            renderWords={renderWords}
          />
        ) : layout === 'table' ? (
          <TableLayout lines={lines} activeLine={activeLine} renderWords={renderWords} />
        ) : layout === 'message' ? (
          <MessageLayout lines={lines} activeLine={activeLine} renderWords={renderWords} />
        ) : (
          lines.map((line, index) => (
            <View
              key={line.id}
              style={[
                styles.line,
                layout === 'prose' && line.paragraphBreak && index > 0 && styles.paragraphBreak,
                layout !== 'prose' && line.role ? ROLE_BLOCK[line.role] : null,
                activeLine === index && styles.lineActive,
              ]}
            >
              {line.emoji ? <Text style={styles.lineEmoji}>{line.emoji}</Text> : null}
              {renderWords(line, index, line.role ? ROLE_TEXT[line.role] : undefined)}
            </View>
          ))
        )}
      </ScrollView>

      <Text style={styles.hint}>{t(ui.readThisWord)}</Text>

      {asking && activity.question ? (
        <View style={styles.questionCard}>
          <Text style={styles.question}>{promptText(activity.question.ask)}</Text>
          <View style={styles.options}>
            {activity.question.options.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => answer(option.id)}
                accessibilityRole="button"
                accessibilityLabel={t(option.label)}
                style={[
                  styles.option,
                  shadow.card,
                  answered === option.id && styles.optionCorrect,
                ]}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={styles.optionLabel}>{t(option.label)}</Text>
              </Pressable>
            ))}
          </View>
          <BigButton
            emoji="🔁"
            label={t(ui.hearItAgain)}
            tone="soft"
            onPress={() => speak(promptText(activity.question?.ask))}
            block
          />
        </View>
      ) : (
        <View style={styles.controls}>
          {/*
            The promise of PRD §4.1, in one button that is in the same place in
            every term of the year. It is never hidden and never disabled.
          */}
          <BigButton
            emoji={reading_ ? '⏹️' : '🔊'}
            label={reading_ ? t(ui.stopReading) : t(ui.readItToMe)}
            tone="soft"
            onPress={reading_ ? stopRead : readWhole}
            block
          />
          <BigButton emoji="✅" label={t(ui.done)} tone="happy" onPress={done} block />
        </View>
      )}

      {Object.keys(activity.gloss).length > 0 && (
        <View style={styles.glossCard}>
          <Text style={styles.glossTitle}>{t(ui.whatItMeans)}</Text>
          {Object.entries(activity.gloss).map(([word, gloss]) => (
            <Pressable
              key={word}
              onPress={() => speakLabel(`${word}. ${t(gloss.meaning)}`)}
              accessibilityRole="button"
              accessibilityLabel={`${word}. ${t(gloss.meaning)}`}
              style={styles.glossRow}
            >
              {/*
                The picture, and it is required (PRD §1.1, §8.2b). A gloss that
                explains an English word in English has explained nothing to a
                child whose English is the thing being taught — this is the one
                mistake the app is most likely to make on every reading text,
                and the validator fails the build without it.
              */}
              <Text style={styles.glossPicture}>{gloss.picture}</Text>
              <Text style={styles.glossWord}>{word}</Text>
              <Text style={styles.glossMeaning}>{t(gloss.meaning)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * The chart layout — PRD §7.2, built for term 2 weeks 3–4.
 *
 * *"Identifies the way the text is organised"*, *"Compares differences and
 * similarities in different places"*. A table is a grid, and a grid flattened
 * into a stack of lines is a different text. `label` and `value` lines pair up
 * into rows in the order they are written; anything else spans the width.
 */
function ChartLayout({
  lines,
  activeLine,
  renderWords,
}: {
  lines: TextLine[];
  activeLine: number | null;
  renderWords: (line: TextLine, index: number, textStyle?: object) => React.ReactNode;
}) {
  const rows: Array<{ label?: [TextLine, number]; value?: [TextLine, number]; span?: [TextLine, number] }> = [];
  lines.forEach((line, index) => {
    if (line.role === 'label') {
      rows.push({ label: [line, index] });
      return;
    }
    if (line.role === 'value') {
      const open = rows[rows.length - 1];
      if (open && open.label && !open.value) {
        open.value = [line, index];
        return;
      }
      rows.push({ value: [line, index] });
      return;
    }
    rows.push({ span: [line, index] });
  });

  return (
    <View style={styles.chart}>
      {rows.map((row, rowIndex) => {
        if (row.span) {
          const [line, index] = row.span;
          return (
            <View
              key={line.id}
              style={[
                styles.chartSpan,
                line.role ? ROLE_BLOCK[line.role] : null,
                activeLine === index && styles.lineActive,
              ]}
            >
              {line.emoji ? <Text style={styles.lineEmoji}>{line.emoji}</Text> : null}
              {renderWords(line, index, line.role ? ROLE_TEXT[line.role] : undefined)}
            </View>
          );
        }
        return (
          <View key={`row-${rowIndex}`} style={styles.chartRow}>
            {row.label ? (
              <View
                style={[styles.chartCell, styles.chartLabel, activeLine === row.label[1] && styles.lineActive]}
              >
                {row.label[0].emoji ? (
                  <Text style={styles.lineEmoji}>{row.label[0].emoji}</Text>
                ) : null}
                {renderWords(row.label[0], row.label[1], ROLE_TEXT.label)}
              </View>
            ) : (
              <View style={[styles.chartCell, styles.chartLabel]} />
            )}
            {row.value ? (
              <View
                style={[styles.chartCell, styles.chartValue, activeLine === row.value[1] && styles.lineActive]}
              >
                {row.value[0].emoji ? (
                  <Text style={styles.lineEmoji}>{row.value[0].emoji}</Text>
                ) : null}
                {renderWords(row.value[0], row.value[1], ROLE_TEXT.value)}
              </View>
            ) : (
              <View style={[styles.chartCell, styles.chartValue]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

/**
 * **The table layout — PRD §7.3. [new] Built for term 2 weeks 7–8 and term 4
 * weeks 5–6, and it is the shape this whole year turns on.**
 *
 * *"Reads a report with visuals e.g., tables/ charts/ graphs/ diagrams/ maps"*,
 * *"Interprets graphic information"*, *"Presents information using a table/
 * chart/ graph"*, *"Transfers information from the visual to narrative form."*
 *
 * The difference from `chart` is real and not cosmetic. `chart` is a list of
 * label–value pairs — *Monday: hot* — and it reads down. **A table is a grid
 * that reads two ways**: a child answering *"which class read the most books in
 * term 2?"* has to cross a row against a column, and a stack of pairs cannot
 * ask that question.
 *
 * `column-head` lines open the header row and are laid out in the order they
 * are written. Each `row-head` starts a row and the `cell` lines after it fill
 * it, left to right. Anything else — a headline, a caption — spans the width.
 *
 * **Every cell is a `TextLine` and every word in it speaks on tap**, which is
 * the whole reason a table is a text here and not a picture (PRD §7.3). A
 * figure — a bar graph, a pie — is the other thing, and it goes in `figure`.
 */
function TableLayout({
  lines,
  activeLine,
  renderWords,
}: {
  lines: TextLine[];
  activeLine: number | null;
  renderWords: (line: TextLine, index: number, textStyle?: object) => React.ReactNode;
}) {
  const heads: Array<[TextLine, number]> = [];
  const rows: Array<Array<[TextLine, number]>> = [];
  const spans: Array<{ at: number; line: TextLine; index: number }> = [];

  lines.forEach((line, index) => {
    if (line.role === 'column-head') {
      heads.push([line, index]);
      return;
    }
    if (line.role === 'row-head') {
      rows.push([[line, index]]);
      return;
    }
    if (line.role === 'cell') {
      const open = rows[rows.length - 1];
      if (open) open.push([line, index]);
      else rows.push([[line, index]]);
      return;
    }
    // A headline or a caption. It keeps its place in the reading order.
    spans.push({ at: rows.length, line, index });
  });

  const cell = (entry: [TextLine, number], isHead: boolean, isRowHead: boolean) => {
    const [line, index] = entry;
    return (
      <View
        key={line.id}
        style={[
          styles.tableCell,
          isHead && styles.tableHeadCell,
          isRowHead && styles.tableRowHeadCell,
          activeLine === index && styles.lineActive,
        ]}
      >
        {line.emoji ? <Text style={styles.lineEmoji}>{line.emoji}</Text> : null}
        {renderWords(line, index, line.role ? ROLE_TEXT[line.role] : undefined)}
      </View>
    );
  };

  const spanAt = (at: number) =>
    spans
      .filter((entry) => entry.at === at)
      .map(({ line, index }) => (
        <View
          key={line.id}
          style={[
            styles.tableSpan,
            line.role ? ROLE_BLOCK[line.role] : null,
            activeLine === index && styles.lineActive,
          ]}
        >
          {line.emoji ? <Text style={styles.lineEmoji}>{line.emoji}</Text> : null}
          {renderWords(line, index, line.role ? ROLE_TEXT[line.role] : undefined)}
        </View>
      ));

  return (
    <View style={styles.table}>
      {spanAt(0)}
      {heads.length > 0 && (
        <View style={[styles.tableRow, styles.tableHeadRow]}>
          {heads.map((entry) => cell(entry, true, false))}
        </View>
      )}
      {rows.map((row, rowIndex) => (
        <View key={`table-row-${rowIndex}`}>
          <View style={styles.tableRow}>
            {row.map((entry, cellIndex) => cell(entry, false, cellIndex === 0))}
          </View>
          {spanAt(rowIndex + 1)}
        </View>
      ))}
    </View>
  );
}

/**
 * **The message layout — PRD §7.3, §6.5d. [new] Built for term 1 weeks 1–2.**
 *
 * *"Reads social texts, e.g., SMS/ email"*, *"Explains main message"*,
 * *"Identifies features of text"*, *"Discusses purpose of text"*, and in the
 * writing column *"Uses correct format, e.g., salutation, date"*.
 *
 * A `sender` line, an optional `subject`, then bubbles: `said-to-me` sits left
 * and `said-by-me` sits right, which is the arrangement the child already knows
 * from the phone in their hand. `time` and `sign-off` close it.
 *
 * > **The app shows a message and does not send one.** No keyboard, no
 * > contacts, no network, no permission requested for any of the three. The
 * > topic's parent note says exactly that in one sentence, because an adult
 * > seeing a phone-shaped screen in a child's app deserves to be told.
 */
function MessageLayout({
  lines,
  activeLine,
  renderWords,
}: {
  lines: TextLine[];
  activeLine: number | null;
  renderWords: (line: TextLine, index: number, textStyle?: object) => React.ReactNode;
}) {
  return (
    <View style={styles.message}>
      {lines.map((line, index) => {
        const mine = line.role === 'said-by-me';
        const bubble = mine || line.role === 'said-to-me';
        return (
          <View
            key={line.id}
            style={[
              styles.messageRow,
              mine && styles.messageRowMine,
              bubble && styles.messageBubble,
              mine && styles.messageBubbleMine,
              line.role ? ROLE_BLOCK[line.role] : null,
              activeLine === index && styles.lineActive,
            ]}
          >
            {line.emoji ? <Text style={styles.lineEmoji}>{line.emoji}</Text> : null}
            {renderWords(line, index, line.role ? ROLE_TEXT[line.role] : undefined)}
          </View>
        );
      })}
    </View>
  );
}

/**
 * How each region is set — PRD §7.2, §7.3.
 *
 * The ATP asks the child to read the layout itself: *"Identifies features of
 * text"*, *"Identifies the way the text is organised"*. So the sizes below are
 * content, not decoration, and none of them goes under `reading.small`.
 */
const ROLE_TEXT: Record<LineRole, object> = {
  headline: { fontSize: reading.headline, fontWeight: '900', letterSpacing: 0.5 },
  byline: { fontSize: reading.small, fontStyle: 'italic', color: colours.inkSoft },
  lead: { fontSize: reading.body, fontWeight: '800' },
  body: {},
  image: { fontSize: reading.small, color: colours.inkSoft },
  caption: { fontSize: reading.small, fontStyle: 'italic', color: colours.inkSoft },
  label: { fontSize: reading.body, fontWeight: '800' },
  value: { fontSize: reading.body },
  'fine-print': { fontSize: reading.small, color: colours.inkSoft },
  // table
  'column-head': { fontSize: reading.small, fontWeight: '900' },
  'row-head': { fontSize: reading.body, fontWeight: '800' },
  cell: { fontSize: reading.body },
  // message
  sender: { fontSize: reading.body, fontWeight: '900' },
  subject: { fontSize: reading.body, fontWeight: '800' },
  'said-to-me': { fontSize: reading.body },
  'said-by-me': { fontSize: reading.body },
  time: { fontSize: reading.small, color: colours.inkSoft },
  'sign-off': { fontSize: reading.body, fontStyle: 'italic' },
};

const ROLE_BLOCK: Record<LineRole, object> = {
  headline: { justifyContent: 'center', marginBottom: space.xs },
  byline: { justifyContent: 'center' },
  lead: { marginBottom: space.xs },
  body: {},
  image: {
    justifyContent: 'center',
    backgroundColor: colours.surfaceAlt,
    borderRadius: size.radius,
    paddingVertical: space.md,
    marginVertical: space.xs,
  },
  caption: { justifyContent: 'center' },
  label: {},
  value: {},
  'fine-print': { marginTop: space.sm, borderTopWidth: 1, borderTopColor: colours.border, paddingTop: space.xs },
  // table — the cell frames are on the cell, not the line
  'column-head': {},
  'row-head': {},
  cell: {},
  // message
  sender: {
    borderBottomWidth: 2,
    borderBottomColor: colours.border,
    paddingBottom: space.xs,
    marginBottom: space.xs,
  },
  subject: { marginBottom: space.xs },
  'said-to-me': {},
  'said-by-me': {},
  time: { justifyContent: 'flex-end' },
  'sign-off': { marginTop: space.sm },
};

/** The sheet a laid-out text sits on. A poster is not a page, and a phone is
 * not either. */
const LAYOUT_SHEET: Record<'poster' | 'chart' | 'article' | 'table' | 'message', object> = {
  poster: { borderColor: colours.primary, borderWidth: 4, backgroundColor: '#FFF8F7' },
  chart: { borderColor: colours.teal, borderWidth: 4 },
  article: { borderColor: colours.ink, borderWidth: 2, backgroundColor: '#FDFCF8' },
  table: { borderColor: colours.blue, borderWidth: 4 },
  // The one place in the app that looks like the object it is teaching about
  // (PRD §7.5). Said once, plainly, and not decorated.
  message: { borderColor: colours.inkSoft, borderWidth: 4, backgroundColor: '#F7F9FC' },
};

const styles = StyleSheet.create({
  container: { gap: space.md },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  titleEmoji: { fontSize: type.emojiMd },
  title: { fontSize: reading.title, fontWeight: '900', color: colours.ink, flexShrink: 1 },

  sheet: {
    backgroundColor: colours.surface,
    borderRadius: size.radiusLg,
    borderWidth: 3,
    borderColor: colours.border,
    maxHeight: 420,
  },
  sheetInner: { padding: space.lg, gap: reading.lineGap },

  // One sentence per line, ragged right, never justified, never hyphenated
  // (PRD §12). The line break is content.
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, borderRadius: size.radius },
  lineActive: { backgroundColor: '#FCEDEB' },
  paragraphBreak: { marginTop: space.lg },
  lineEmoji: { fontSize: type.emojiSm, marginTop: 2 },
  words: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },

  chart: { gap: space.xs },
  chartRow: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  chartCell: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 2, borderRadius: size.radius },
  chartLabel: { flex: 4 },
  chartValue: { flex: 3 },
  chartSpan: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, borderRadius: size.radius },

  // table — PRD §7.3. A grid that reads two ways, and every cell speaks.
  table: { gap: 0 },
  tableRow: { flexDirection: 'row', alignItems: 'stretch' },
  tableHeadRow: { borderBottomWidth: 2, borderBottomColor: colours.ink },
  tableCell: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: space.xs,
    paddingHorizontal: space.xs,
    borderWidth: 1,
    borderColor: colours.border,
    borderRadius: 6,
  },
  tableHeadCell: { backgroundColor: colours.surfaceAlt },
  tableRowHeadCell: { flex: 1.4, backgroundColor: '#FBF9FF' },
  tableSpan: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    paddingVertical: space.xs,
    borderRadius: size.radius,
  },

  // message — PRD §7.3, §6.5d
  message: { gap: space.xs },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    gap: space.sm,
    borderRadius: size.radius,
  },
  messageRowMine: { alignSelf: 'flex-end' },
  messageBubble: {
    maxWidth: '88%',
    backgroundColor: colours.surface,
    borderWidth: 2,
    borderColor: colours.border,
    borderRadius: 18,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  messageBubbleMine: { backgroundColor: '#EAF4FD', borderColor: colours.blue },

  wordTap: { paddingRight: reading.wordGap, paddingVertical: 2 },
  word: {
    fontSize: reading.body,
    lineHeight: reading.lineHeight,
    color: colours.ink,
    fontWeight: '600',
  },
  // A background, not a colour change: a finger covers a colour change
  // (PRD §12).
  wordActive: {
    color: colours.primaryDark,
    backgroundColor: '#FBE2DF',
    fontWeight: '900',
  },
  wordGlossed: { textDecorationLine: 'underline', textDecorationStyle: 'dotted' },
  glossDot: {
    alignSelf: 'center',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colours.primary,
  },

  lineSpeaker: { paddingHorizontal: space.xs, paddingVertical: 2 },
  lineSpeakerText: { fontSize: type.body },

  hint: { fontSize: type.caption, color: colours.inkSoft, textAlign: 'center' },

  controls: { gap: space.sm },

  questionCard: { gap: space.md },
  question: { fontSize: type.title, fontWeight: '800', color: colours.ink, textAlign: 'center' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'center' },
  option: {
    minWidth: 96,
    minHeight: size.touchMin,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: size.radius,
    borderWidth: 3,
    borderColor: colours.border,
    backgroundColor: colours.surface,
    alignItems: 'center',
    gap: 2,
  },
  optionCorrect: { borderColor: colours.green, backgroundColor: '#E9F8EC' },
  optionEmoji: { fontSize: type.emojiSm },
  optionLabel: { fontSize: type.body, fontWeight: '700', color: colours.ink, textAlign: 'center' },

  glossCard: {
    backgroundColor: colours.surfaceAlt,
    borderRadius: size.radius,
    padding: space.md,
    gap: space.xs,
  },
  glossTitle: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  glossRow: { flexDirection: 'row', gap: space.sm, minHeight: 36, alignItems: 'center' },
  glossPicture: { fontSize: type.emojiSm },
  glossWord: { fontSize: reading.gloss, fontWeight: '900', color: colours.primaryDark },
  glossMeaning: { fontSize: reading.gloss, color: colours.ink, flexShrink: 1 },
});
