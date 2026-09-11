import type { FigureId } from '@/types';

/**
 * **What is in the frame, and never what it means** — PRD §7.5, §11.
 *
 * Every figure carries one of these and **it answers the question without the
 * picture**. A child who cannot see the drawing — a cracked screen, a dark
 * room, a child who does not see well — must still be able to answer, and the
 * description does not count against the term's word ceiling because it is the
 * app's own voice (PRD §8.4).
 *
 * ══════════════════════════════════════════════════════════════════════════
 *  **In this subject the rule bites harder than in any previous app, because
 *  half the figures ARE the question** (PRD §7.5).
 *
 *  > *"A bar graph with four bars — walk is 24, taxi is 16, bus is 9, car is
 *  > 5"* lets a child who cannot see it answer *"which is the most?"*.
 *  >
 *  > *"A bar graph of how we get to school"* does not. **And it passes a length
 *  > check.**
 *
 *  So: **if the figure carries numbers, the description carries the numbers.**
 *  If it carries a count of sides, faces or parts, the description carries the
 *  count. The validator fails the build on a description that names a figure
 *  without reporting what is in it (PRD §11, promoted from warn to fail).
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Read them back as a set and the test is easy to apply: **not one of them says
 * *most*, *fewest*, *biggest*, *nearest*, *because* or *so*.** A description
 * that did the comparing has answered the question the lesson is asking, and
 * the child would never have to look at the picture at all. It reports; she
 * compares.
 *
 * ── The two that are wrong on purpose ─────────────────────────────────────
 *
 * `fig-bar-graph-read-wrongly` and `fig-pictograph-read-wrongly` are drawn
 * misleadingly, because the ATP's verb is ***"critically read and interpret"***
 * and **a child who has only ever been shown correct graphs has not been taught
 * to read one critically.** Their descriptions report exactly what is drawn —
 * including the axis that does not start at zero and the key that says one
 * picture is five — **without saying that anything is wrong with it.** Noticing
 * is the lesson. Both are listed in `docs/facts.md` as deliberately misleading.
 */
export const FIGURE_DESCRIPTIONS: Record<FigureId, string> = {
  /* ─────────────────────────────── 2D shapes ─────────────────────────────── */
  'fig-triangle-kinds':
    'Three triangles side by side. The first has three sides the same length. The second has two sides the same length and one shorter. The third has three sides all different lengths. Each one has a small mark on every side.',
  'fig-quadrilaterals':
    'Four shapes with four sides each. A square with all four sides the same. A rectangle with two long sides and two short sides. A shape leaning over with both pairs of sides the same, called a parallelogram. A shape with only one pair of sides going the same way, called a trapezium.',
  'fig-regular-and-irregular':
    'Two rows of shapes. The top row has three shapes with all their sides the same length: a triangle, a square and a hexagon. The bottom row has three shapes with sides of different lengths: a triangle, a four-sided shape and a six-sided shape.',
  'fig-pentagon-hexagon-heptagon':
    'Three shapes in a row, each with the number of its sides written inside it. The first has five sides. The second has six sides. The third has seven sides.',
  'fig-circle-parts':
    'A circle with a dot in the middle. A straight line runs from the dot to the edge and is labelled radius. A longer straight line runs right across through the dot and is labelled diameter. The curved edge itself is labelled circumference.',
  'fig-sides-straight-and-curved':
    'Two boxes. The box on the left holds three shapes made only of straight sides: a triangle, a square and a pentagon. The box on the right holds three shapes with curved edges: a circle, an oval and a shape like a half moon.',
  'fig-line-symmetry':
    'Three shapes, each with a dashed line drawn through it. A square with a dashed line straight down the middle. A triangle with two sides the same, with a dashed line from its point to the middle of the bottom. A heart shape with a dashed line down the middle. On each one the two halves match.',
  'fig-shapes-on-grid-paper':
    'A grid of small squares, eight across and six down. A rectangle is drawn on it that is five squares wide and three squares tall. Beside it a triangle is drawn with its bottom four squares wide and its point three squares up.',

  /* ──────────────────── 3-D objects and their nets ──────────────────────── */
  'fig-rectangular-prism':
    'A box drawn so you can see three of its sides. It has six flat faces, twelve edges and eight corners. The face at the front is a rectangle. The dashed lines show the three edges hidden at the back.',
  'fig-net-of-a-rectangular-prism':
    'A flat shape made of six rectangles joined at their edges. Four of them are in a row across the middle. One sits above the second rectangle in the row and one sits below it. Dashed lines show where it would fold.',
  'fig-cube':
    'A cube drawn so you can see three of its sides. It has six flat faces and every face is a square. It has twelve edges, all the same length, and eight corners.',
  'fig-net-of-a-cube':
    'A flat shape made of six squares joined at their edges. Four squares are in a row. One square sits above the second one in the row and one square sits below the second one. Dashed lines show where it would fold.',
  'fig-cylinder':
    'A tin shape standing up. The top is a circle and the bottom is a circle, and the side between them is curved all the way round. It has two flat faces and one curved surface, and no corners.',
  'fig-net-of-a-cylinder':
    'A flat shape made of one rectangle with a circle joined to the top edge and another circle joined to the bottom edge. The long side of the rectangle is the same length as the way round each circle.',
  'fig-cone-and-pyramid':
    'Two shapes side by side. On the left a cone: a circle at the bottom rising to one point, with one flat face and one curved surface. On the right a pyramid: a square at the bottom with four triangles rising to one point, five flat faces in all.',
  'fig-net-of-a-pyramid':
    'A flat shape made of one square in the middle with a triangle joined to each of its four sides. Dashed lines show where it would fold so that the four points meet at the top.',

  /* ───────────────────────────── Graphs ─────────────────────────────────── */
  'fig-tally-table':
    'A table with two columns, headed What we drink and Tally. Water has two gates of five and three single marks, thirteen in all. Milk has one gate of five and two single marks, seven in all. Juice has four single marks, four in all.',
  'fig-pictograph-many-to-one':
    'A picture graph called Bags of maize sold. A key at the bottom says one bag picture stands for ten bags. Monday has four bag pictures. Tuesday has two bag pictures and a half. Wednesday has six bag pictures. Thursday has three bag pictures.',
  'fig-bar-graph-how-we-get-to-school':
    'A bar graph called How we get to school. It has four bars standing up and the numbers up the side go from zero to thirty. Walk is 24. Taxi is 16. Bus is 9. Car is 5.',
  'fig-bar-graph-read-wrongly':
    'A bar graph called Learners in each class. It has three bars. Class A is 31, class B is 33 and class C is 34. The numbers up the side start at 30 and go to 35. The bar for class C is drawn four times as tall as the bar for class A.',
  'fig-pie-chart-what-we-drink':
    'A circle cut into four pieces, called What thirty learners drink at break. The biggest piece is half the circle and says water, fifteen learners. The next piece is a quarter and says milk, seven learners. A smaller piece says juice, five learners. The smallest piece says nothing, three learners.',
  'fig-pictograph-read-wrongly':
    'A picture graph called Eggs collected. The key says one egg picture stands for five eggs. Monday has three egg pictures. Tuesday has five egg pictures. Under the graph somebody has written Monday 3 and Tuesday 5.',

  /* ──────────────────────────── Instruments ────────────────────────────── */
  'fig-ruler-against-a-pencil':
    'A ruler marked in centimetres from zero to fifteen, with ten small lines between each numbered mark. A pencil lies along it. The point of the pencil is at zero and the other end reaches the mark that is eight centimetres and five small lines.',
  'fig-tape-measure':
    'A tape measure pulled out along the edge of a table. It is marked in centimetres and every tenth mark has a number. The end of the table is at the mark that reads one hundred and twenty centimetres.',
  'fig-trundle-wheel':
    'A wheel on a long handle, standing on a path. An arrow shows it rolling forward. A note beside it says the wheel clicks once every metre. Under the path it says the wheel clicked twenty-three times.',
  'fig-measuring-jug':
    'A measuring jug with lines up the side. The lines are marked at two hundred, four hundred, six hundred, eight hundred and one thousand millilitres. The water in the jug comes up to the line marked six hundred.',
  'fig-kitchen-scale':
    'A round kitchen scale with a needle. The numbers round the dial go from zero to one thousand grams, with a number every two hundred. A bag of flour sits on the scale and the needle points to seven hundred and fifty grams.',
  'fig-bathroom-scale':
    'A flat bathroom scale with a small window in it. The window shows the number thirty-four point five, and beside the window it says kg.',

  /* ─────────────────────────────── Grids ───────────────────────────────── */
  'fig-area-by-counting-squares':
    'A grid of small squares. A rectangle is drawn on the grid and the squares inside it are shaded. The rectangle is six squares wide and four squares tall, and twenty-four squares are shaded. A note says each square is one square centimetre.',
  'fig-irregular-area-on-a-grid':
    'A grid of small squares with a shape drawn on it that is not a rectangle. Eleven whole squares inside the shape are shaded dark. Six squares are only half covered and are shaded light. A note says count the whole ones first.',
  'fig-tessellation-of-hexagons':
    'A pattern of six-sided shapes fitting together with no gaps and no overlaps, like a honeycomb. Every shape touches six others along its sides. The pattern carries on past the edges of the picture.',
  'fig-slide-turn-flip':
    'A grid with the same L-shape drawn four times. The first is the starting shape. The second is the same shape moved three squares to the right. The third is the same shape turned a quarter turn. The fourth is the same shape flipped over a dashed line.',

  /* ───────────────────────── Number and fraction ───────────────────────── */
  'fig-stave-of-number-lines':
    'Four number lines drawn one under the other, all the same length. The first is marked zero and one, with nothing between. The second has one mark in the middle. The third has three marks between the ends. The fourth has seven marks between the ends.',
  'fig-fraction-wall':
    'A wall of bars, all the same length, stacked one above the other. The top bar is one whole. The next is cut into two equal parts. The next into three, then four, then six, then eight, then twelve. Every bar is the same length across.',
  'fig-array-6-by-4':
    'A block of dots in rows and columns. There are four rows and each row has six dots. Twenty-four dots in all. An arrow along the top says six and an arrow down the side says four.',
  'fig-place-value-chart':
    'A chart with six columns. The headings from left to right are hundred thousands, ten thousands, thousands, hundreds, tens and ones. The digits written under them are three, four, two, seven, zero and six.',
};
