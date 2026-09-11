import { LocalContentRepository } from './LocalContentRepository';
import { LocalProgressRepository } from './LocalProgressRepository';

import type { ContentRepository } from './ContentRepository';
import type { ProgressRepository } from './ProgressRepository';

export type { ContentRepository } from './ContentRepository';
export type { ProgressRepository } from './ProgressRepository';
export { LocalContentRepository } from './LocalContentRepository';
export { LocalProgressRepository, DEFAULT_CHILD_ID } from './LocalProgressRepository';

/**
 * The only place the app picks an implementation (PRD §9.2).
 *
 * Swapping to MongoDB later is two lines here — construct
 * `RemoteContentRepository` / a syncing progress repository instead. The UI
 * imports these consts and never learns the difference.
 */
export const contentRepository: ContentRepository = new LocalContentRepository();
export const progressRepository: ProgressRepository = new LocalProgressRepository();
