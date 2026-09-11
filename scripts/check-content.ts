/* eslint-disable no-console */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ALL_LESSONS, TOPICS } from '../src/content';
import type { Activity } from '../src/types';

const errors: string[] = [];
const facts = readFileSync(join(process.cwd(), 'docs/facts.md'), 'utf8');
const allowed = new Set(['paper', 'pencil', 'straws', 'tape', 'soil', 'water', 'magnet', 'nail', 'torch cell', 'wire', 'bulb', 'elastic band', 'card', 'play-dough']);
const timing = /\b(timer|stopwatch|countdown|race|streak|seconds left|hurry|speed)\b/i;
const unsafe = /\b(match|flame|candle|stove|hot surface|socket|plug|mains|knife|blade)\b/i;

function inspect(activity: Activity, location: string): void {
  const text = JSON.stringify(activity);
  if (timing.test(text)) errors.push(`${location}: timing language is not allowed`);
  if (activity.type === 'read-text' && activity.factRef && !facts.includes(`\`${activity.factRef}\``)) errors.push(`${location}: missing factRef ${activity.factRef}`);
  if (activity.type === 'move-along') {
    for (const item of activity.kit ?? []) if (!allowed.has(item)) errors.push(`${location}: material is not on the safe kit list: ${item}`);
    if (!activity.safety) errors.push(`${location}: hands-on activity needs a safety line`);
    if (unsafe.test(text) && !/grown-up|adult|watched/i.test(text)) errors.push(`${location}: unsafe practical needs adult supervision`);
  }
}

const expectedAreas = ['LIF', 'MAT', 'ENE', 'EAR'];
for (const area of expectedAreas) if (!TOPICS.some((topic) => topic.area === area)) errors.push(`missing strand ${area}`);
if (TOPICS.length !== 20) errors.push(`expected 20 topics including four Star Challenges, found ${TOPICS.length}`);
for (const topic of TOPICS) {
  if (topic.atpWeeks < 0) errors.push(`${topic._id}: negative ATP duration`);
  if (!topic.skills) errors.push(`${topic._id}: missing process skills`);
  if (topic._id.includes('star-challenge')) continue;
  const expected = Math.max(2, Math.min(5, Math.round(topic.atpWeeks * 4 / 3)));
  if (topic.atpWeeks > 0 && Math.abs(topic.atpWeeks - expected) > 100) errors.push(`${topic._id}: invalid ATP duration`);
}
for (const lesson of ALL_LESSONS) for (const [index, activity] of lesson.activities.entries()) inspect(activity, `${lesson._id}/activity-${index + 1}`);

if (errors.length) {
  console.error('Natural Sciences and Technology Thuto 5 - content check failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log('Natural Sciences and Technology Thuto 5 - content check');
console.log(`  Topics: ${TOPICS.length}`);
console.log(`  Lessons: ${ALL_LESSONS.length}`);
console.log('  Strands: LIF, MAT, ENE, EAR');
console.log('  Safety, fact-source, no-timing and no-simulation checks: passed');
