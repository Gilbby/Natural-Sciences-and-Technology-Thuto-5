import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colours, space, type } from '@/theme/tokens';
import type { Activity } from '@/types';

import { AssignSlot } from './AssignSlot';
import { BeatAlong } from './BeatAlong';
import { ChanceTrial } from './ChanceTrial';
import { ClockFace } from './ClockFace';
import { DrawCanvas } from './DrawCanvas';
import { ExploreCards } from './ExploreCards';
import { FlowDiagram } from './FlowDiagram';
import { FractionBar } from './FractionBar';
import { HabitTracker } from './HabitTracker';
import { ListenChoose } from './ListenChoose';
import { MatchConnect } from './MatchConnect';
import { MemoryMatch } from './MemoryMatch';
import { MoveAlong } from './MoveAlong';
import { NumberLine } from './NumberLine';
import { PlaceValue } from './PlaceValue';
import { ReadText } from './ReadText';
import { SelectItems } from './SelectItems';
import { SequenceCards } from './SequenceCards';
import { SortBaskets } from './SortBaskets';
import { SourceFigure } from './SourceFigure';
import { SpellWord } from './SpellWord';
import type { ActivityViewProps } from './types';

/**
 * The one place activity data becomes an interaction (PRD §7, §11).
 *
 * Adding a lesson that uses an existing `type` needs no code at all. Adding a
 * new interaction type means one component and one line in this switch — and
 * **this fork added six and deleted none** (PRD §7.2, §15.2). That is more than
 * the previous eight forks added between them, and it is not scope creep: it is
 * the first fork where the subject's content could not be expressed in the
 * shapes that already existed. **A number is not a word.**
 *
 * The six are grouped together at the bottom of the switch so that a later
 * reader can see at a glance what this subject needed that the family did not
 * already have.
 */
export function ActivityRenderer({
  activity,
  onFinished,
  onRegisterReplay,
  onRegisterIntro,
}: ActivityViewProps) {
  const shared = { onFinished, onRegisterReplay, onRegisterIntro };

  /*
   * **The drawn figure, above whatever the activity is** (PRD §7.4).
   *
   * A visual-text lesson names the same figure in three of its four
   * activities, so a `select` asking what the graph shows and a
   * `listen-choose` asking what you can work out from it are looking at one
   * drawing — without either component knowing that figures exist.
   */
  const source = activity.figure ? <SourceFigure figure={activity.figure} /> : null;

  const withSource = (view: ReactElement) =>
    source ? (
      <View>
        {source}
        {view}
      </View>
    ) : (
      view
    );

  switch (activity.type) {
    case 'sort-baskets':
      return withSource(<SortBaskets activity={activity} {...shared} />);
    case 'select':
      return withSource(<SelectItems activity={activity} {...shared} />);
    case 'sequence':
      return withSource(<SequenceCards activity={activity} {...shared} />);
    case 'match-connect':
      return withSource(<MatchConnect activity={activity} {...shared} />);
    case 'assign-slot':
      return withSource(<AssignSlot activity={activity} {...shared} />);
    case 'explore-cards':
      return withSource(<ExploreCards activity={activity} {...shared} />);
    case 'listen-choose':
      return withSource(<ListenChoose activity={activity} {...shared} />);
    case 'draw-canvas':
      return withSource(<DrawCanvas activity={activity} {...shared} />);
    case 'spell-word':
      return withSource(<SpellWord activity={activity} {...shared} />);
    case 'read-text':
      return withSource(<ReadText activity={activity} {...shared} />);
    case 'memory-match':
      return withSource(<MemoryMatch activity={activity} {...shared} />);
    case 'move-along':
      return withSource(<MoveAlong activity={activity} {...shared} />);
    case 'habit-tracker':
      return withSource(<HabitTracker activity={activity} {...shared} />);
    case 'beat-along':
      return withSource(<BeatAlong activity={activity} {...shared} />);

    /* ── the six, PRD §7.2 ── */
    case 'place-value':
      return withSource(<PlaceValue activity={activity} {...shared} />);
    case 'number-line':
      return withSource(<NumberLine activity={activity} {...shared} />);
    case 'fraction-bar':
      return withSource(<FractionBar activity={activity} {...shared} />);
    case 'flow-diagram':
      return withSource(<FlowDiagram activity={activity} {...shared} />);
    case 'clock-face':
      return withSource(<ClockFace activity={activity} {...shared} />);
    case 'chance-trial':
      return withSource(<ChanceTrial activity={activity} {...shared} />);
    default:
      return <UnknownActivity activity={activity} />;
  }
}

/**
 * Content can outrun the app when a lesson is authored against a newer type.
 * A child must never see a blank screen, so say so and let them move on.
 */
function UnknownActivity({ activity }: { activity: Activity }) {
  return (
    <View style={styles.unknown}>
      <Text style={styles.unknownEmoji}>🧩</Text>
      <Text style={styles.unknownText}>This activity is not ready yet.</Text>
      <Text style={styles.unknownHint}>{activity.type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  unknown: { alignItems: 'center', gap: space.sm, paddingVertical: space.xxl },
  unknownEmoji: { fontSize: type.emojiXl },
  unknownText: { fontSize: type.title, fontWeight: '800', color: colours.ink },
  unknownHint: { fontSize: type.caption, color: colours.inkSoft },
});
