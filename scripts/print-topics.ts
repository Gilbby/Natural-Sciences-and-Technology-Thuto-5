/* eslint-disable no-console */
import { ALL_LESSONS, TOPICS } from '../src/content/index';

/**
 * Prints the year as one markdown table — the body of `docs/topic-sheet.md`.
 *
 * Generated rather than typed, so the doc cannot drift from the data: the topic
 * sheet is the first human checkpoint (PRD §8.1), and a checkpoint that says
 * something different from the build is worse than none.
 *
 * **The columns worth printing are the hours and the lesson count.** They are
 * the judgement PRD §5.3 asks the checkpoint to confirm: `round(atpHours / 3)`
 * clamped 2–6, with an eighteen-hour topic getting six lessons and a six-hour
 * one getting two.
 */
console.log('| Topic | Term | Weeks | Area | Hours | Lessons | Lesson titles |');
console.log('| --- | ---: | --- | :---: | ---: | ---: | --- |');
for (const topic of TOPICS) {
  const lessons = ALL_LESSONS.filter((lesson) => lesson.topicId === topic._id).sort(
    (a, b) => a.orderInTopic - b.orderInTopic,
  );
  const weeks =
    topic.weekStart === topic.weekEnd
      ? `${topic.weekStart}`
      : `${topic.weekStart}–${topic.weekEnd}`;
  console.log(
    `| **${topic.title.en}** ${topic.emoji} | ${topic.term} | ${weeks} | ` +
      `${topic.area} | ${topic.atpHours || '—'} | ${lessons.length} | ` +
      `${lessons.map((lesson) => lesson.title.en).join(' · ')} |`,
  );
}
