import { colours } from '@/theme/tokens';
import type { Subject } from '@/types';

import { SUBJECT_ID } from './authoring';

/**
 * Subjects at launch — PRD §5.4.
 *
 * A single-subject app: English First Additional Language is the whole of it,
 * and it carries the whole Grade 6 ATP year — Listening & Speaking, Reading &
 * Viewing, Writing & Presenting, and Language Structures & Conventions, across
 * all four terms. The subject → term → topic → lesson shape is still the one
 * the domain layer builds, so a second subject stays content and not code:
 * adding an entry here is all it would take.
 *
 * `💬` is the English FAL mark, carried forward from the Life Skills fork this
 * engine came from. Not `🔢`, which is Mathematics, and not `🌿`, which is
 * Life Skills — these sit on the home screens of their own apps.
 *
 * > The glyph is a speech bubble with a dot — the FAL stand-in for a tile that
 * > reads as "talk", "read", "write" at a glance, where a tile is 56 dp and a
 * > drawn letter would not read.
 */
export const SUBJECTS: Subject[] = [
  {
    _id: SUBJECT_ID,
    title: { en: 'English First Additional Language' },
    emoji: '💬',
    colour: colours.primary,
    status: 'active',
    order: 1,
  },
];
