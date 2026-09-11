import { colours } from '@/theme/tokens';
import type { Subject } from '@/types';

import { SUBJECT_ID } from './authoring';

/**
 * Subjects at launch — PRD §5.4.
 *
 * A single-subject app: Mathematics is the whole of it, and it carries the
 * whole Grade 5 ATP year — all five content areas, all eighteen CAPS topics,
 * all four terms. The subject → term → topic → lesson shape is still the one
 * the domain layer builds, so a second subject stays content and not code:
 * adding an entry here is all it would take.
 *
 * `🔢` and `#3F7FD6` are the Mathematics mark, carried unchanged from
 * *Mathematics Thuto 1–4* (PRD §14.2). Not `🌿`, which is the Life Skills mark
 * this fork's *engine* came from, and not `💬`, which is English FAL's — and
 * **all three now sit on one home screen, twice over** (PRD §17 test 8).
 *
 * > The glyph was read out of `Mathematics Thuto 4.apk`'s launcher icon, not
 * > chosen: a number line marked `0 1 2 3 4 5` in white on the blue. `🔢` is
 * > its emoji stand-in inside the app, where a tile is 56 dp and a drawn number
 * > line would not read.
 */
export const SUBJECTS: Subject[] = [
  {
    _id: SUBJECT_ID,
    title: { en: 'Natural Sciences and Technology' },
    emoji: '🔬',
    colour: colours.primary,
    status: 'active',
    order: 1,
  },
];
