import type { ReactElement } from 'react';
import {
  Circle,
  Ellipse,
  G,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Svg,
  Text as SvgText,
} from 'react-native-svg';

import { colours, diagram as tokens } from '@/theme/tokens';
import { ALL_FIGURES } from '@/types';
import type { FigureId } from '@/types';

import { FIGURE_DESCRIPTIONS } from './descriptions';

/**
 * The thirty-six figures — PRD §7.5, §18.5.
 *
 * **The convention is borrowed from *Social Sciences Thuto 4* along with
 * `SourceFigure`** — the fourth lineage to hold it (PRD §7.5, §18.8 #1). The
 * house rules come across unchanged:
 *
 *   - A JPEG cannot be tinted, so it cannot follow a theme; it cannot scale to
 *     a 360 dp screen without going soft, and a soft diagram is a diagram a
 *     child cannot read.
 *   - **A figure is a diagram, not an illustration.** No shading for its own
 *     sake, no faces, no charm. The child is being asked *how many sides* or
 *     *which is nearer*, and a drawing trying to be beautiful has more lines in
 *     it than the question needs.
 *   - **Colour is never the only difference between two parts.** Every shape
 *     carries its own label or its own outline before it carries a fill.
 *   - **`stroke` comes from the theme**, so an accessibility pass can thicken
 *     every figure at once.
 *
 * ── This subject is made of figures, and half of them are the question ────
 *
 * *English FAL Thuto 5* took this component and was told **not** to take
 * `docs/facts.md`. **This app takes both**, because a bar graph with numbers on
 * it is a claim (PRD §18.1 finding 4). And the rule that a description answers
 * the question without the picture (PRD §4 principle 9) bites hardest here: a
 * graph's `FIGURE_DESCRIPTIONS` entry carries every number the drawing carries,
 * because *"which is the most?"* has to be answerable with the eyes shut.
 *
 * ── Two are drawn wrong on purpose ────────────────────────────────────────
 *
 * `fig-bar-graph-read-wrongly` has an axis that starts at 30, not 0.
 * `fig-pictograph-read-wrongly` has a key of five but a row counted as ones.
 * The ATP's verb is *"critically read and interpret"*, and a child shown only
 * honest graphs cannot do that. Both are in `docs/facts.md` as misleading.
 *
 * The coordinate system is a 110 × 80 box for every figure; `Figure` scales it
 * to the requested width.
 */

export interface FigureProps {
  /** Rendered width in dp. Height follows `diagram.figureRatio`. */
  width: number;
  /** The part id to light up when the child has just named it. */
  highlight?: string | null;
}

const INK: string = colours.ink;
const SOFT: string = colours.inkSoft;
const GRID: string = tokens.grid;
const FILL: string = colours.primary;
const FILL_SOFT = '#C9DDF6';

/** A part's stroke, lit when the child has just named it. */
function tint(part: string, highlight: string | null | undefined, fallback: string = INK): string {
  return highlight === part ? tokens.highlight : fallback;
}

/** A part's stroke width, thickened when lit so the change survives a finger. */
function weight(part: string, highlight: string | null | undefined): number {
  return highlight === part ? tokens.stroke + 2 : tokens.stroke;
}

/** A small centred caption under a shape. */
function Caption({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <SvgText x={x} y={y} fontSize={6} fill={SOFT} textAnchor="middle" fontWeight="700">
      {children}
    </SvgText>
  );
}

/** A number or short label sitting inside a shape. */
function InLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <SvgText x={x} y={y} fontSize={7} fill={INK} textAnchor="middle" fontWeight="800">
      {children}
    </SvgText>
  );
}

/* ═══════════════════════════════════════════════════════════ 2D shapes ══ */

function TriangleKinds({ highlight }: { highlight?: string | null }) {
  const tri = (cx: number, apexDx: number, id: string): ReactElement => (
    <Polygon
      points={`${cx - 12},64 ${cx + 12},64 ${cx + apexDx},34`}
      fill="none"
      stroke={tint(id, highlight)}
      strokeWidth={weight(id, highlight)}
      strokeLinejoin="round"
    />
  );
  return (
    <G>
      {tri(20, 0, 'equilateral')}
      <Caption x={20} y={74}>
        all equal
      </Caption>
      {tri(55, 0, 'isosceles')}
      <Caption x={55} y={74}>
        two equal
      </Caption>
      {tri(90, -8, 'scalene')}
      <Caption x={90} y={74}>
        all different
      </Caption>
    </G>
  );
}

function Quadrilaterals({ highlight }: { highlight?: string | null }) {
  return (
    <G>
      <Rect x={9} y={16} width={20} height={20} fill="none" stroke={tint('square', highlight)} strokeWidth={weight('square', highlight)} />
      <Caption x={19} y={46}>
        square
      </Caption>
      <Rect x={62} y={18} width={30} height={16} fill="none" stroke={tint('rectangle', highlight)} strokeWidth={weight('rectangle', highlight)} />
      <Caption x={77} y={46}>
        rectangle
      </Caption>
      <Polygon points="14,74 30,74 24,58 8,58" fill="none" stroke={tint('parallelogram', highlight)} strokeWidth={weight('parallelogram', highlight)} strokeLinejoin="round" />
      <Caption x={19} y={62}>
        slanted
      </Caption>
      <Polygon points="64,74 92,74 86,58 70,58" fill="none" stroke={tint('trapezium', highlight)} strokeWidth={weight('trapezium', highlight)} strokeLinejoin="round" />
      <Caption x={78} y={62}>
        trapezium
      </Caption>
    </G>
  );
}

function RegularAndIrregular({ highlight }: { highlight?: string | null }) {
  return (
    <G>
      <Line x1={4} y1={40} x2={106} y2={40} stroke={GRID} strokeWidth={1} />
      <Polygon points="18,14 28,32 8,32" fill="none" stroke={tint('regular', highlight)} strokeWidth={weight('regular', highlight)} strokeLinejoin="round" />
      <Rect x={44} y={14} width={18} height={18} fill="none" stroke={tint('regular', highlight)} strokeWidth={weight('regular', highlight)} />
      <Polygon points="90,14 100,20 100,30 90,36 80,30 80,20" fill="none" stroke={tint('regular', highlight)} strokeWidth={weight('regular', highlight)} strokeLinejoin="round" />
      <Caption x={55} y={11}>
        regular: sides equal
      </Caption>
      <Polygon points="16,50 30,58 10,68" fill="none" stroke={tint('irregular', highlight)} strokeWidth={weight('irregular', highlight)} strokeLinejoin="round" />
      <Polygon points="42,50 64,52 60,70 46,66" fill="none" stroke={tint('irregular', highlight)} strokeWidth={weight('irregular', highlight)} strokeLinejoin="round" />
      <Polygon points="88,48 102,54 98,66 86,70 78,58" fill="none" stroke={tint('irregular', highlight)} strokeWidth={weight('irregular', highlight)} strokeLinejoin="round" />
      <Caption x={55} y={78}>
        irregular: sides differ
      </Caption>
    </G>
  );
}

function PentagonHexagonHeptagon({ highlight }: { highlight?: string | null }) {
  const poly = (cx: number, n: number, id: string): ReactElement => {
    const pts: string[] = [];
    for (let i = 0; i < n; i += 1) {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      pts.push(`${cx + Math.cos(a) * 16},${40 + Math.sin(a) * 16}`);
    }
    return (
      <G>
        <Polygon points={pts.join(' ')} fill="none" stroke={tint(id, highlight)} strokeWidth={weight(id, highlight)} strokeLinejoin="round" />
        <InLabel x={cx} y={43}>
          {String(n)}
        </InLabel>
      </G>
    );
  };
  return (
    <G>
      {poly(20, 5, 'pentagon')}
      <Caption x={20} y={68}>
        pentagon
      </Caption>
      {poly(55, 6, 'hexagon')}
      <Caption x={55} y={68}>
        hexagon
      </Caption>
      {poly(90, 7, 'heptagon')}
      <Caption x={90} y={68}>
        heptagon
      </Caption>
    </G>
  );
}

function CircleParts({ highlight }: { highlight?: string | null }) {
  return (
    <G>
      <Circle cx={55} cy={40} r={28} fill="none" stroke={tint('circumference', highlight)} strokeWidth={weight('circumference', highlight)} />
      <Circle cx={55} cy={40} r={2} fill={INK} />
      <Line x1={55} y1={40} x2={83} y2={40} stroke={tint('radius', highlight, FILL)} strokeWidth={weight('radius', highlight)} />
      <Line x1={27} y1={40} x2={83} y2={40} stroke={tint('diameter', highlight, colours.amber)} strokeWidth={2} strokeDasharray="3 2" />
      <Caption x={70} y={37}>
        radius
      </Caption>
      <Caption x={40} y={52}>
        diameter
      </Caption>
      <Caption x={55} y={16}>
        edge is the circumference
      </Caption>
    </G>
  );
}

function SidesStraightAndCurved({ highlight }: { highlight?: string | null }) {
  return (
    <G>
      <Rect x={5} y={10} width={48} height={60} rx={3} fill="none" stroke={GRID} strokeWidth={1} />
      <Rect x={57} y={10} width={48} height={60} rx={3} fill="none" stroke={GRID} strokeWidth={1} />
      <Polygon points="16,20 26,36 6,36" fill="none" stroke={tint('straight', highlight)} strokeWidth={weight('straight', highlight)} strokeLinejoin="round" />
      <Rect x={30} y={20} width={16} height={16} fill="none" stroke={tint('straight', highlight)} strokeWidth={weight('straight', highlight)} />
      <Polygon points="18,44 30,50 26,64 10,64 6,50" fill="none" stroke={tint('straight', highlight)} strokeWidth={weight('straight', highlight)} strokeLinejoin="round" />
      <Caption x={29} y={76}>
        straight sides
      </Caption>
      <Circle cx={70} cy={26} r={10} fill="none" stroke={tint('curved', highlight)} strokeWidth={weight('curved', highlight)} />
      <Ellipse cx={92} cy={26} rx={11} ry={7} fill="none" stroke={tint('curved', highlight)} strokeWidth={weight('curved', highlight)} />
      <Path d="M62 62 A16 16 0 0 1 94 62 Z" fill="none" stroke={tint('curved', highlight)} strokeWidth={weight('curved', highlight)} strokeLinejoin="round" />
      <Caption x={81} y={76}>
        curved sides
      </Caption>
    </G>
  );
}

function LineSymmetry({ highlight }: { highlight?: string | null }) {
  return (
    <G>
      <Rect x={8} y={22} width={26} height={26} fill="none" stroke={tint('square', highlight)} strokeWidth={weight('square', highlight)} />
      <Line x1={21} y1={16} x2={21} y2={54} stroke={colours.amber} strokeWidth={2} strokeDasharray="3 2" />
      <Polygon points="55,20 68,50 42,50" fill="none" stroke={tint('triangle', highlight)} strokeWidth={weight('triangle', highlight)} strokeLinejoin="round" />
      <Line x1={55} y1={14} x2={55} y2={56} stroke={colours.amber} strokeWidth={2} strokeDasharray="3 2" />
      <Path d="M90 50 C78 38 84 24 90 30 C96 24 102 38 90 50 Z" fill="none" stroke={tint('heart', highlight)} strokeWidth={weight('heart', highlight)} strokeLinejoin="round" />
      <Line x1={90} y1={22} x2={90} y2={54} stroke={colours.amber} strokeWidth={2} strokeDasharray="3 2" />
      <Caption x={55} y={70}>
        the two halves match
      </Caption>
    </G>
  );
}

/** A faint grid, reused by the shape-on-grid and area figures. */
function GridBg({ cols, rows, x = 6, y = 8, cell = 12 }: { cols: number; rows: number; x?: number; y?: number; cell?: number }) {
  const lines: ReactElement[] = [];
  for (let c = 0; c <= cols; c += 1) {
    lines.push(<Line key={`v${c}`} x1={x + c * cell} y1={y} x2={x + c * cell} y2={y + rows * cell} stroke={GRID} strokeWidth={1} />);
  }
  for (let r = 0; r <= rows; r += 1) {
    lines.push(<Line key={`h${r}`} x1={x} y1={y + r * cell} x2={x + cols * cell} y2={y + r * cell} stroke={GRID} strokeWidth={1} />);
  }
  return <G>{lines}</G>;
}

function ShapesOnGridPaper({ highlight }: { highlight?: string | null }) {
  const cell = 8.5;
  const x = 8;
  const y = 8;
  return (
    <G>
      <GridBg cols={8} rows={6} x={x} y={y} cell={cell} />
      <Rect x={x} y={y} width={5 * cell} height={3 * cell} fill="none" stroke={tint('rectangle', highlight, FILL)} strokeWidth={weight('rectangle', highlight)} />
      <Polygon
        points={`${x + 4 * cell},${y + 6 * cell} ${x + 8 * cell},${y + 6 * cell} ${x + 6 * cell},${y + 3 * cell}`}
        fill="none"
        stroke={tint('triangle', highlight, colours.amber)}
        strokeWidth={weight('triangle', highlight)}
        strokeLinejoin="round"
      />
    </G>
  );
}

/* ══════════════════════════════════════ 3-D objects and their nets ══════ */

function RectangularPrism({ highlight }: { highlight?: string | null }) {
  const c = tint('prism', highlight);
  const w = weight('prism', highlight);
  return (
    <G>
      <Rect x={22} y={26} width={44} height={30} fill="none" stroke={c} strokeWidth={w} />
      <Polyline points="22,26 40,14 84,14 66,26" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" />
      <Polyline points="66,56 84,44 84,14" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" />
      <Polyline points="22,26 40,14 40,44 22,56" fill="none" stroke={SOFT} strokeWidth={1.4} strokeDasharray="3 2" />
      <Polyline points="40,44 84,44" fill="none" stroke={SOFT} strokeWidth={1.4} strokeDasharray="3 2" />
      <Caption x={55} y={72}>
        6 faces, 12 edges, 8 corners
      </Caption>
    </G>
  );
}

function NetOfRectangularPrism({ highlight }: { highlight?: string | null }) {
  const c = tint('net', highlight);
  const w = weight('net', highlight);
  const cw = 20;
  const ch = 14;
  const x = 12;
  const y = 26;
  return (
    <G>
      {[0, 1, 2, 3].map((i) => (
        <Rect key={i} x={x + i * cw} y={y} width={cw} height={ch} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      ))}
      <Rect x={x + cw} y={y - ch} width={cw} height={ch} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      <Rect x={x + cw} y={y + ch} width={cw} height={ch} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      <Caption x={55} y={72}>
        six rectangles, folds into a box
      </Caption>
    </G>
  );
}

function Cube({ highlight }: { highlight?: string | null }) {
  const c = tint('cube', highlight);
  const w = weight('cube', highlight);
  return (
    <G>
      <Rect x={30} y={28} width={34} height={34} fill="none" stroke={c} strokeWidth={w} />
      <Polyline points="30,28 44,16 78,16 64,28" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" />
      <Polyline points="64,62 78,50 78,16" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" />
      <Polyline points="30,28 44,16 44,50 30,62" fill="none" stroke={SOFT} strokeWidth={1.4} strokeDasharray="3 2" />
      <Polyline points="44,50 78,50" fill="none" stroke={SOFT} strokeWidth={1.4} strokeDasharray="3 2" />
      <Caption x={55} y={74}>
        every face is a square
      </Caption>
    </G>
  );
}

function NetOfCube({ highlight }: { highlight?: string | null }) {
  const c = tint('net', highlight);
  const w = weight('net', highlight);
  const s = 15;
  const x = 25;
  const y = 24;
  return (
    <G>
      {[0, 1, 2, 3].map((i) => (
        <Rect key={i} x={x + i * s} y={y} width={s} height={s} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      ))}
      <Rect x={x + s} y={y - s} width={s} height={s} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      <Rect x={x + s} y={y + s} width={s} height={s} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      <Caption x={55} y={74}>
        six squares, folds into a cube
      </Caption>
    </G>
  );
}

function Cylinder({ highlight }: { highlight?: string | null }) {
  const c = tint('cylinder', highlight);
  const w = weight('cylinder', highlight);
  return (
    <G>
      <Ellipse cx={55} cy={18} rx={20} ry={7} fill="none" stroke={c} strokeWidth={w} />
      <Line x1={35} y1={18} x2={35} y2={56} stroke={c} strokeWidth={w} />
      <Line x1={75} y1={18} x2={75} y2={56} stroke={c} strokeWidth={w} />
      <Path d="M35 56 A20 7 0 0 0 75 56" fill="none" stroke={c} strokeWidth={w} />
      <Path d="M35 56 A20 7 0 0 1 75 56" fill="none" stroke={SOFT} strokeWidth={1.4} strokeDasharray="3 2" />
      <Caption x={55} y={74}>
        2 flat faces, 1 curved surface
      </Caption>
    </G>
  );
}

function NetOfCylinder({ highlight }: { highlight?: string | null }) {
  const c = tint('net', highlight);
  const w = weight('net', highlight);
  return (
    <G>
      <Circle cx={55} cy={16} r={9} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      <Rect x={30} y={28} width={50} height={24} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      <Circle cx={55} cy={64} r={9} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      <Caption x={92} y={42}>
        two
      </Caption>
      <Caption x={92} y={50}>
        circles
      </Caption>
    </G>
  );
}

function ConeAndPyramid({ highlight }: { highlight?: string | null }) {
  const cc = tint('cone', highlight);
  const pc = tint('pyramid', highlight);
  return (
    <G>
      <Path d="M28 58 L14 62 A16 5 0 0 0 42 62 Z" fill="none" stroke={cc} strokeWidth={weight('cone', highlight)} strokeLinejoin="round" />
      <Path d="M14 62 A16 5 0 0 1 42 62" fill="none" stroke={SOFT} strokeWidth={1.4} strokeDasharray="3 2" />
      <Line x1={28} y1={16} x2={14} y2={62} stroke={cc} strokeWidth={weight('cone', highlight)} />
      <Line x1={28} y1={16} x2={42} y2={62} stroke={cc} strokeWidth={weight('cone', highlight)} />
      <Caption x={28} y={74}>
        cone
      </Caption>
      <Polygon points="80,16 64,60 96,60" fill="none" stroke={pc} strokeWidth={weight('pyramid', highlight)} strokeLinejoin="round" />
      <Polyline points="64,60 82,66 96,60" fill="none" stroke={pc} strokeWidth={weight('pyramid', highlight)} strokeLinejoin="round" />
      <Line x1={80} y1={16} x2={82} y2={66} stroke={SOFT} strokeWidth={1.4} strokeDasharray="3 2" />
      <Caption x={80} y={74}>
        pyramid
      </Caption>
    </G>
  );
}

function NetOfPyramid({ highlight }: { highlight?: string | null }) {
  const c = tint('net', highlight);
  const w = weight('net', highlight);
  return (
    <G>
      <Rect x={44} y={34} width={22} height={22} fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" />
      <Polygon points="44,34 66,34 55,14" fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" strokeLinejoin="round" />
      <Polygon points="44,56 66,56 55,76" fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" strokeLinejoin="round" />
      <Polygon points="44,34 44,56 24,45" fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" strokeLinejoin="round" />
      <Polygon points="66,34 66,56 86,45" fill="none" stroke={c} strokeWidth={w} strokeDasharray="2 2" strokeLinejoin="round" />
    </G>
  );
}

/* ═══════════════════════════════════════════════════════════════ Graphs ══ */

/** Y-axis and X-axis, from a chosen baseline value up. */
function Axes({ highlight, from = 0, to = 30 }: { highlight?: string | null; from?: number; to?: number }) {
  const steps = 4;
  const rows: ReactElement[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const y = 62 - (i / steps) * 54;
    const value = from + ((to - from) / steps) * i;
    rows.push(<Line key={`g${i}`} x1={20} y1={y} x2={100} y2={y} stroke={GRID} strokeWidth={1} />);
    rows.push(
      <SvgText key={`n${i}`} x={17} y={y + 2} fontSize={5} fill={SOFT} textAnchor="end">
        {String(Math.round(value))}
      </SvgText>,
    );
  }
  return (
    <G>
      {rows}
      <Line x1={20} y1={8} x2={20} y2={62} stroke={tint('axis', highlight, INK)} strokeWidth={weight('axis', highlight)} strokeLinecap="round" />
      <Line x1={20} y1={62} x2={100} y2={62} stroke={tint('axis', highlight, INK)} strokeWidth={weight('axis', highlight)} strokeLinecap="round" />
    </G>
  );
}

function Bar({
  id,
  x,
  value,
  from,
  to,
  label,
  highlight,
}: {
  id: string;
  x: number;
  value: number;
  from: number;
  to: number;
  label: string;
  highlight?: string | null;
}) {
  const height = ((value - from) / (to - from)) * 54;
  return (
    <G>
      <Rect x={x} y={62 - height} width={14} height={height} fill={highlight === id ? tokens.highlight : FILL_SOFT} stroke={tint(id, highlight, INK)} strokeWidth={weight(id, highlight)} rx={1.5} />
      <SvgText x={x + 7} y={60 - height} fontSize={6} fill={INK} textAnchor="middle" fontWeight="800">
        {String(value)}
      </SvgText>
      <SvgText x={x + 7} y={70} fontSize={5} fill={SOFT} textAnchor="middle">
        {label}
      </SvgText>
    </G>
  );
}

function TallyTable({ highlight }: { highlight?: string | null }) {
  const row = (y: number, name: string, marks: string, id: string): ReactElement => (
    <G>
      <SvgText x={12} y={y} fontSize={7} fill={tint(id, highlight)} fontWeight="800">
        {name}
      </SvgText>
      <SvgText x={52} y={y} fontSize={9} fill={INK} fontWeight="700" letterSpacing={1}>
        {marks}
      </SvgText>
    </G>
  );
  return (
    <G>
      <Line x1={8} y1={16} x2={104} y2={16} stroke={INK} strokeWidth={2} />
      <Line x1={48} y1={10} x2={48} y2={72} stroke={GRID} strokeWidth={1} />
      <SvgText x={10} y={13} fontSize={5} fill={SOFT}>
        drink
      </SvgText>
      <SvgText x={52} y={13} fontSize={5} fill={SOFT}>
        tally
      </SvgText>
      {row(30, 'water', '卌 卌 |||', 'water')}
      {row(46, 'milk', '卌 ||', 'milk')}
      {row(62, 'juice', '||||', 'juice')}
    </G>
  );
}

function PictographManyToOne({ highlight }: { highlight?: string | null }) {
  const row = (y: number, name: string, full: number, half: boolean, id: string): ReactElement => (
    <G>
      <SvgText x={10} y={y + 4} fontSize={6} fill={tint(id, highlight)} fontWeight="800">
        {name}
      </SvgText>
      {Array.from({ length: full }, (_, i) => (
        <SvgText key={i} x={32 + i * 11} y={y + 6} fontSize={9}>
          🌾
        </SvgText>
      ))}
      {half ? (
        <SvgText x={32 + full * 11} y={y + 6} fontSize={9}>
          ⌇
        </SvgText>
      ) : null}
    </G>
  );
  return (
    <G>
      {row(14, 'Mon', 4, false, 'mon')}
      {row(28, 'Tue', 2, true, 'tue')}
      {row(42, 'Wed', 6, false, 'wed')}
      {row(56, 'Thu', 3, false, 'thu')}
      <Caption x={55} y={76}>
        one 🌾 stands for 10 bags
      </Caption>
    </G>
  );
}

function BarGraphHowWeGetToSchool({ highlight }: { highlight?: string | null }) {
  return (
    <G>
      <Axes highlight={highlight} from={0} to={30} />
      <Bar id="walk" x={26} value={24} from={0} to={30} label="walk" highlight={highlight} />
      <Bar id="taxi" x={46} value={16} from={0} to={30} label="taxi" highlight={highlight} />
      <Bar id="bus" x={66} value={9} from={0} to={30} label="bus" highlight={highlight} />
      <Bar id="car" x={86} value={5} from={0} to={30} label="car" highlight={highlight} />
    </G>
  );
}

function BarGraphReadWrongly({ highlight }: { highlight?: string | null }) {
  // The trap: the axis starts at 30, so a one-learner gap looks enormous.
  return (
    <G>
      <Axes highlight={highlight} from={30} to={35} />
      <Bar id="a" x={30} value={31} from={30} to={35} label="A" highlight={highlight} />
      <Bar id="b" x={54} value={33} from={30} to={35} label="B" highlight={highlight} />
      <Bar id="c" x={78} value={34} from={30} to={35} label="C" highlight={highlight} />
      <Caption x={60} y={76}>
        look where the numbers start
      </Caption>
    </G>
  );
}

function PieChartWhatWeDrink({ highlight }: { highlight?: string | null }) {
  const cx = 40;
  const cy = 40;
  const r = 26;
  // water half, milk quarter, juice ~ sixth, nothing ~ tenth.
  const slice = (startFrac: number, endFrac: number, colour: string, id: string): ReactElement => {
    const a0 = startFrac * Math.PI * 2 - Math.PI / 2;
    const a1 = endFrac * Math.PI * 2 - Math.PI / 2;
    const large = endFrac - startFrac > 0.5 ? 1 : 0;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    return (
      <Path
        d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
        fill={highlight === id ? tokens.highlight : colour}
        stroke={colours.surface}
        strokeWidth={1.5}
      />
    );
  };
  return (
    <G>
      {slice(0, 0.5, FILL, 'water')}
      {slice(0.5, 0.75, FILL_SOFT, 'milk')}
      {slice(0.75, 0.9167, colours.amber, 'juice')}
      {slice(0.9167, 1, colours.teal, 'nothing')}
      <Caption x={82} y={24}>
        water 15
      </Caption>
      <Caption x={82} y={38}>
        milk 7
      </Caption>
      <Caption x={82} y={52}>
        juice 5
      </Caption>
      <Caption x={82} y={66}>
        nothing 3
      </Caption>
    </G>
  );
}

function PictographReadWrongly({ highlight }: { highlight?: string | null }) {
  // The trap: key says one egg = 5, but the written total counts pictures as 1.
  const row = (y: number, name: string, count: number, id: string): ReactElement => (
    <G>
      <SvgText x={10} y={y + 5} fontSize={6} fill={tint(id, highlight)} fontWeight="800">
        {name}
      </SvgText>
      {Array.from({ length: count }, (_, i) => (
        <SvgText key={i} x={30 + i * 11} y={y + 7} fontSize={9}>
          🥚
        </SvgText>
      ))}
    </G>
  );
  return (
    <G>
      {row(16, 'Mon', 3, 'mon')}
      {row(34, 'Tue', 5, 'tue')}
      <Caption x={55} y={58}>
        key: one 🥚 stands for 5 eggs
      </Caption>
      <Caption x={55} y={70}>
        someone wrote: Mon 3, Tue 5
      </Caption>
    </G>
  );
}

/* ══════════════════════════════════════════════════════════ Instruments ══ */

function RulerAgainstPencil({ highlight }: { highlight?: string | null }) {
  const x0 = 8;
  const px = 6.4; // per cm
  const marks: ReactElement[] = [];
  for (let cm = 0; cm <= 15; cm += 1) {
    const x = x0 + cm * px;
    marks.push(<Line key={cm} x1={x} y1={44} x2={x} y2={cm % 5 === 0 ? 34 : 39} stroke={INK} strokeWidth={1} />);
    if (cm % 5 === 0) {
      marks.push(
        <SvgText key={`t${cm}`} x={x} y={31} fontSize={5} fill={SOFT} textAnchor="middle">
          {cm}
        </SvgText>,
      );
    }
  }
  return (
    <G>
      <Rect x={x0} y={44} width={15 * px} height={12} fill="none" stroke={tint('ruler', highlight)} strokeWidth={weight('ruler', highlight)} />
      {marks}
      <Line x1={x0} y1={22} x2={x0 + 8.5 * px} y2={22} stroke={tint('pencil', highlight, colours.amber)} strokeWidth={5} strokeLinecap="round" />
      <Polygon points={`${x0 + 8.5 * px},19 ${x0 + 8.5 * px + 6},22 ${x0 + 8.5 * px},25`} fill={colours.amber} />
      <Caption x={55} y={72}>
        the pencil starts at 0
      </Caption>
    </G>
  );
}

function TapeMeasure({ highlight }: { highlight?: string | null }) {
  return (
    <G>
      <Rect x={8} y={40} width={90} height={12} fill="none" stroke={tint('tape', highlight)} strokeWidth={weight('tape', highlight)} />
      {[0, 20, 40, 60, 80, 100, 120].map((n, i) => (
        <G key={n}>
          <Line x1={10 + i * 14.5} y1={40} x2={10 + i * 14.5} y2={34} stroke={INK} strokeWidth={1} />
          <SvgText x={10 + i * 14.5} y={31} fontSize={4.5} fill={SOFT} textAnchor="middle">
            {n}
          </SvgText>
        </G>
      ))}
      <Line x1={97} y1={30} x2={97} y2={60} stroke={colours.amber} strokeWidth={2} />
      <Caption x={55} y={70}>
        the table edge is at 120 cm
      </Caption>
    </G>
  );
}

function TrundleWheel({ highlight }: { highlight?: string | null }) {
  return (
    <G>
      <Line x1={30} y1={16} x2={58} y2={54} stroke={SOFT} strokeWidth={2} />
      <Circle cx={58} cy={54} r={14} fill="none" stroke={tint('wheel', highlight, FILL)} strokeWidth={weight('wheel', highlight)} />
      <Line x1={58} y1={40} x2={58} y2={68} stroke={SOFT} strokeWidth={1.4} />
      <Line x1={44} y1={54} x2={72} y2={54} stroke={SOFT} strokeWidth={1.4} />
      <Line x1={8} y1={70} x2={100} y2={70} stroke={INK} strokeWidth={2} />
      <Path d="M74 46 A20 20 0 0 1 84 54" fill="none" stroke={colours.amber} strokeWidth={2} />
      <Polygon points="84,54 86,48 79,51" fill={colours.amber} />
      <Caption x={55} y={78}>
        one click each metre; it clicked 23
      </Caption>
    </G>
  );
}

function MeasuringJug({ highlight }: { highlight?: string | null }) {
  const levels = [
    [200, 58],
    [400, 48],
    [600, 38],
    [800, 28],
    [1000, 18],
  ] as const;
  return (
    <G>
      <Path d="M34 12 L74 12 L70 68 L38 68 Z" fill="none" stroke={tint('jug', highlight)} strokeWidth={weight('jug', highlight)} strokeLinejoin="round" />
      <Path d="M35 38 L73 38 L70 68 L38 68 Z" fill={FILL_SOFT} stroke="none" />
      {levels.map(([ml, y]) => (
        <G key={ml}>
          <Line x1={54} y1={y} x2={70} y2={y} stroke={INK} strokeWidth={1} />
          <SvgText x={52} y={y + 2} fontSize={5} fill={SOFT} textAnchor="end">
            {ml}
          </SvgText>
        </G>
      ))}
      <Caption x={54} y={78}>
        the water is at 600 mℓ
      </Caption>
    </G>
  );
}

function KitchenScale({ highlight }: { highlight?: string | null }) {
  const cx = 55;
  const cy = 46;
  const r = 26;
  // needle at 750 of 1000 → 0.75 of a 300° sweep starting at 210°.
  const angle = (210 + 0.75 * 300) * (Math.PI / 180);
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={tint('scale', highlight)} strokeWidth={weight('scale', highlight)} />
      {[0, 200, 400, 600, 800, 1000].map((g, i) => {
        const a = (210 + (i / 5) * 300) * (Math.PI / 180);
        return (
          <SvgText key={g} x={cx + Math.cos(a) * (r - 6)} y={cy + Math.sin(a) * (r - 6) + 2} fontSize={4} fill={SOFT} textAnchor="middle">
            {g}
          </SvgText>
        );
      })}
      <Line x1={cx} y1={cy} x2={cx + Math.cos(angle) * (r - 3)} y2={cy + Math.sin(angle) * (r - 3)} stroke={colours.amber} strokeWidth={2} />
      <Circle cx={cx} cy={cy} r={2.5} fill={INK} />
      <Rect x={cx - 12} y={12} width={24} height={7} fill={FILL_SOFT} stroke={INK} strokeWidth={1} />
      <Caption x={cx} y={78}>
        the needle points to 750 g
      </Caption>
    </G>
  );
}

function BathroomScale({ highlight }: { highlight?: string | null }) {
  return (
    <G>
      <Rect x={26} y={22} width={58} height={40} rx={5} fill="none" stroke={tint('scale', highlight)} strokeWidth={weight('scale', highlight)} />
      <Rect x={40} y={34} width={30} height={16} rx={2} fill={colours.ink} />
      <SvgText x={55} y={46} fontSize={9} fill="#8FE38F" textAnchor="middle" fontWeight="800">
        34.5
      </SvgText>
      <SvgText x={72} y={40} fontSize={5} fill={SOFT}>
        kg
      </SvgText>
      <Caption x={55} y={74}>
        the window reads 34.5 kg
      </Caption>
    </G>
  );
}

/* ═══════════════════════════════════════════════════════════════ Grids ══ */

function AreaByCountingSquares({ highlight }: { highlight?: string | null }) {
  const cell = 8.5;
  const x = 12;
  const y = 10;
  const shaded: ReactElement[] = [];
  for (let c = 0; c < 6; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      shaded.push(<Rect key={`${c}-${r}`} x={x + c * cell} y={y + r * cell} width={cell} height={cell} fill={FILL_SOFT} stroke={FILL} strokeWidth={0.8} />);
    }
  }
  return (
    <G>
      <GridBg cols={8} rows={5} x={x} y={y} cell={cell} />
      {shaded}
      <Rect x={x} y={y} width={6 * cell} height={4 * cell} fill="none" stroke={tint('rect', highlight, INK)} strokeWidth={weight('rect', highlight)} />
      <Caption x={45} y={72}>
        24 squares shaded, each 1 cm²
      </Caption>
    </G>
  );
}

function IrregularAreaOnGrid({ highlight }: { highlight?: string | null }) {
  const cell = 8.5;
  const x = 16;
  const y = 8;
  return (
    <G>
      <GridBg cols={7} rows={6} x={x} y={y} cell={cell} />
      <Path
        d={`M${x} ${y + cell} L${x + 2 * cell} ${y} L${x + 5 * cell} ${y} L${x + 6 * cell} ${y + 3 * cell} L${x + 4 * cell} ${y + 5 * cell} L${x} ${y + 4 * cell} Z`}
        fill={FILL_SOFT}
        stroke={tint('shape', highlight, INK)}
        strokeWidth={weight('shape', highlight)}
        strokeLinejoin="round"
      />
      <Caption x={55} y={76}>
        count whole squares first
      </Caption>
    </G>
  );
}

function TessellationOfHexagons({ highlight }: { highlight?: string | null }) {
  const hex = (cx: number, cy: number): string => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      pts.push(`${cx + Math.cos(a) * 9},${cy + Math.sin(a) * 9}`);
    }
    return pts.join(' ');
  };
  const centres: Array<[number, number]> = [];
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const cx = 14 + col * 15.6;
      const cy = 14 + row * 18 + (col % 2 === 1 ? 9 : 0);
      centres.push([cx, cy]);
    }
  }
  return (
    <G>
      {centres.map(([cx, cy], i) => (
        <Polygon key={i} points={hex(cx, cy)} fill={i % 3 === 0 ? FILL_SOFT : 'none'} stroke={tint('hex', highlight)} strokeWidth={1.5} strokeLinejoin="round" />
      ))}
    </G>
  );
}

function SlideTurnFlip({ highlight }: { highlight?: string | null }) {
  const L = (x: number, y: number, transform?: string): ReactElement => (
    <Polygon
      points={`${x},${y} ${x + 8},${y} ${x + 8},${y + 5} ${x + 14},${y + 5} ${x + 14},${y + 13} ${x},${y + 13}`}
      fill={FILL_SOFT}
      stroke={tint('shape', highlight, INK)}
      strokeWidth={1.6}
      strokeLinejoin="round"
      transform={transform}
    />
  );
  return (
    <G>
      {L(8, 30)}
      <Caption x={16} y={54}>
        start
      </Caption>
      {L(30, 30)}
      <Caption x={38} y={54}>
        slid
      </Caption>
      <G transform="rotate(90 66 36)">{L(59, 30)}</G>
      <Caption x={66} y={54}>
        turned
      </Caption>
      <Line x1={84} y1={26} x2={84} y2={48} stroke={colours.amber} strokeWidth={1.4} strokeDasharray="3 2" />
      <G transform="scale(-1 1) translate(-190 0)">{L(90, 30)}</G>
      <Caption x={95} y={54}>
        flipped
      </Caption>
    </G>
  );
}

/* ══════════════════════════════════════════════ Number and fraction ════ */

function StaveOfNumberLines({ highlight }: { highlight?: string | null }) {
  const line = (y: number, divisions: number, id: string): ReactElement => {
    const ticks: ReactElement[] = [];
    for (let i = 0; i <= divisions; i += 1) {
      const x = 18 + (i / divisions) * 78;
      ticks.push(<Line key={i} x1={x} y1={y - 4} x2={x} y2={y + 4} stroke={INK} strokeWidth={i === 0 || i === divisions ? 2 : 1} />);
    }
    return (
      <G>
        <Line x1={18} y1={y} x2={96} y2={y} stroke={tint(id, highlight)} strokeWidth={weight(id, highlight)} />
        {ticks}
      </G>
    );
  };
  return (
    <G>
      {line(14, 1, 'l0')}
      {line(32, 2, 'l1')}
      {line(50, 4, 'l2')}
      {line(68, 8, 'l3')}
      <Caption x={8} y={16}>
        0
      </Caption>
    </G>
  );
}

function FractionWall({ highlight }: { highlight?: string | null }) {
  const parts = [1, 2, 3, 4, 6, 8, 12];
  const x = 12;
  const w = 86;
  return (
    <G>
      {parts.map((n, row) => {
        const y = 8 + row * 9.5;
        const cells: ReactElement[] = [];
        for (let i = 0; i < n; i += 1) {
          cells.push(<Rect key={i} x={x + (i / n) * w} y={y} width={w / n} height={8} fill={row === 0 ? FILL_SOFT : 'none'} stroke={tint(`r${n}`, highlight)} strokeWidth={1.2} />);
        }
        return <G key={n}>{cells}</G>;
      })}
      <Caption x={55} y={78}>
        every bar is one whole
      </Caption>
    </G>
  );
}

function Array6By4({ highlight }: { highlight?: string | null }) {
  const dots: ReactElement[] = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 6; c += 1) {
      dots.push(<Circle key={`${r}-${c}`} cx={26 + c * 11} cy={22 + r * 10} r={3.4} fill={highlight === 'dots' ? tokens.highlight : FILL} />);
    }
  }
  return (
    <G>
      {dots}
      <Line x1={26} y1={12} x2={81} y2={12} stroke={SOFT} strokeWidth={1} />
      <InLabel x={53} y={9}>
        6
      </InLabel>
      <Line x1={16} y1={22} x2={16} y2={52} stroke={SOFT} strokeWidth={1} />
      <InLabel x={11} y={40}>
        4
      </InLabel>
      <Caption x={55} y={72}>
        4 rows of 6 is 24
      </Caption>
    </G>
  );
}

function PlaceValueChart({ highlight }: { highlight?: string | null }) {
  const heads = ['HTh', 'TTh', 'Th', 'H', 'T', 'O'];
  const digits = ['3', '4', '2', '7', '0', '6'];
  const x = 8;
  const cw = 16;
  return (
    <G>
      {heads.map((h, i) => (
        <G key={h}>
          <Rect x={x + i * cw} y={16} width={cw} height={16} fill="none" stroke={GRID} strokeWidth={1} />
          <Rect x={x + i * cw} y={32} width={cw} height={20} fill={highlight === `c${i}` ? tokens.highlight : 'none'} stroke={INK} strokeWidth={1.4} />
          <SvgText x={x + i * cw + cw / 2} y={27} fontSize={5} fill={SOFT} textAnchor="middle">
            {h}
          </SvgText>
          <SvgText x={x + i * cw + cw / 2} y={47} fontSize={10} fill={INK} textAnchor="middle" fontWeight="800">
            {digits[i]}
          </SvgText>
        </G>
      ))}
      <Caption x={55} y={66}>
        342 706
      </Caption>
    </G>
  );
}

/* ─────────────────────────────────────────────────────────── registry ── */

const FIGURES: Record<FigureId, (props: { highlight?: string | null }) => ReactElement> = {
  'fig-triangle-kinds': TriangleKinds,
  'fig-quadrilaterals': Quadrilaterals,
  'fig-regular-and-irregular': RegularAndIrregular,
  'fig-pentagon-hexagon-heptagon': PentagonHexagonHeptagon,
  'fig-circle-parts': CircleParts,
  'fig-sides-straight-and-curved': SidesStraightAndCurved,
  'fig-line-symmetry': LineSymmetry,
  'fig-shapes-on-grid-paper': ShapesOnGridPaper,
  'fig-rectangular-prism': RectangularPrism,
  'fig-net-of-a-rectangular-prism': NetOfRectangularPrism,
  'fig-cube': Cube,
  'fig-net-of-a-cube': NetOfCube,
  'fig-cylinder': Cylinder,
  'fig-net-of-a-cylinder': NetOfCylinder,
  'fig-cone-and-pyramid': ConeAndPyramid,
  'fig-net-of-a-pyramid': NetOfPyramid,
  'fig-tally-table': TallyTable,
  'fig-pictograph-many-to-one': PictographManyToOne,
  'fig-bar-graph-how-we-get-to-school': BarGraphHowWeGetToSchool,
  'fig-bar-graph-read-wrongly': BarGraphReadWrongly,
  'fig-pie-chart-what-we-drink': PieChartWhatWeDrink,
  'fig-pictograph-read-wrongly': PictographReadWrongly,
  'fig-ruler-against-a-pencil': RulerAgainstPencil,
  'fig-tape-measure': TapeMeasure,
  'fig-trundle-wheel': TrundleWheel,
  'fig-measuring-jug': MeasuringJug,
  'fig-kitchen-scale': KitchenScale,
  'fig-bathroom-scale': BathroomScale,
  'fig-area-by-counting-squares': AreaByCountingSquares,
  'fig-irregular-area-on-a-grid': IrregularAreaOnGrid,
  'fig-tessellation-of-hexagons': TessellationOfHexagons,
  'fig-slide-turn-flip': SlideTurnFlip,
  'fig-stave-of-number-lines': StaveOfNumberLines,
  'fig-fraction-wall': FractionWall,
  'fig-array-6-by-4': Array6By4,
  'fig-place-value-chart': PlaceValueChart,
};

export function Figure({ id, width, highlight }: FigureProps & { id: FigureId }): ReactElement | null {
  const Drawing = FIGURES[id];
  if (!Drawing) return null;
  return (
    <Svg width={width} height={width * tokens.figureRatio} viewBox="0 0 110 80">
      <Drawing highlight={highlight} />
    </Svg>
  );
}

export { FIGURE_DESCRIPTIONS };

export const FIGURE_IDS: readonly FigureId[] = ALL_FIGURES;
