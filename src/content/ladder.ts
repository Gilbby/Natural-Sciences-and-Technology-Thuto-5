import type { LadderEntry, Skill, TermNumber } from '@/types';

/**
 * The word ledger, the gloss budget, and the prerequisite ladder —
 * PRD §8.2, §8.3, §1.1 rules 3 and 5.
 *
 * **Two different things live in this file and they are not the same thing.**
 * The top half is a *word* ledger, borrowed whole from a sibling app; the
 * bottom half is a *skill* ladder, written here for the first time. They are
 * together because both answer the same question — *has this child met this
 * yet?* — and both are checked by walking the year in order.
 *
 * ══ THE TOP HALF: the word ledger, and this app does not have one ════════
 *
 * > **`CORE_WORDS` for this app is *English FAL Thuto 5*'s finished ledger,
 * > read one term behind.** A Mathematics word problem in term 2 may use any
 * > word that app had taught by the end of **term 1**. Everything else is
 * > glossed, with a picture, inside a budget of five per text.
 *
 * **This is the second app to spend that ledger, and that matters more than
 * the first did.** *Life Skills Thuto 5* made the argument: the child has
 * exactly one English vocabulary, it is being built next door with a validator
 * on it, and two ledgers for one child is two guesses where one measurement
 * exists. **A second app doing the same thing turns that argument into how
 * this family builds a grade** (PRD §18.1 finding 5).
 *
 * > **And it is a mathematics app doing it**, which is the part worth saying
 * > out loud. A word problem about *"comparing two or more quantities of the
 * > same kind"* — the ATP's own phrasing — **is an English comprehension
 * > problem wearing a number.** Sipho, who reads about two years behind, will
 * > tap the speaker on every line of it, and §8.3's ledger and §8.4's ramp are
 * > why they exist in a mathematics app at all.
 *
 * **The general form, now confirmed twice: build the language app first, then
 * spend its ledger in every other subject of the same grade.** The language
 * app is not one of five siblings; it is the budget the other four spend, and
 * it costs it nothing to export. **NS and Tech and Social Sciences Grade 6
 * should both do this, and neither should re-cut a ledger.**
 *
 * **Why one term and not zero:** the FAL app teaches a word in the fortnight it
 * teaches it, and a child does not hold a word the week she meets it. A term's
 * lag is the smallest honest gap and it is the one the two apps' own ramps
 * already imply.
 *
 * ── One exemption, and it is the subject ──────────────────────────────────
 *
 * A **mathematical** term is glossed and exempt: *numerator*, *denominator*,
 * *quadrilateral*, *perimeter*, *tessellation*, *commutative*. See
 * `MATHS_WORDS` below. **The exemption is from the budget and never from the
 * gloss**, and every one carries an explicit `say` (PRD §9.1 caveat 1).
 *
 * ══ THE BOTTOM HALF: the prerequisite ladder ═════════════════════════════
 *
 * See the banner above `ARRIVES_WITH`. It is the file this fork exists to
 * write, it shipped **dead** in the app this engine came from, and it is now
 * the most important thing in the repo (PRD §18.1 finding 1).
 *
 * ── And the language ladder is still here, still empty ────────────────────
 *
 * Mathematics teaches no grammar either. `LANGUAGE_LADDER` survives **empty**
 * for the second fork running, and the forward-reference check that reads it
 * still passes on an empty rung list. **Leaving it in is a re-merge saving for
 * the next fork; deleting it is a cost** (PRD §5.7, §15.2). The lesson of the
 * last two builds is that the file you cannot use is the next subject's spine.
 */

export interface LadderCycle {
  term: TermNumber;
  /** Inclusive ATP week range within the term. */
  weeks: [number, number];
  /**
   * The language items this cycle teaches — the ATP's fourth column, copied in
   * its own order, one item per entry.
   *
   * The ATP prints them under four sub-headings (word level · sentence level ·
   * word meaning · spelling and punctuation) and this array is those four
   * concatenated. The sub-headings are not kept, because nothing in the app
   * needs them and a topic's `languageItems` is checked against this array
   * verbatim.
   */
  items: string[];
  /**
   * The cycle's taught vocabulary — the words that go on the Word Wall.
   *
   * Six to nine a fortnight. These are the words a text's five-word budget is
   * meant to be spent on: the five new words in a text *are* the words the
   * cycle is teaching, and they are the words the parent note names
   * (PRD §8.2b).
   */
  words: string[];
}

/**
 * **The language items the FAL lineage taught** — kept, unused, and harmless.
 *
 * Mathematics teaches no grammar (PRD §5.7). This list is here so that the
 * inherited forward-reference check has something to be trivially satisfied by
 * rather than something to be deleted, and so that a later fork back into a
 * language subject finds it where it left it.
 */
export const GRADE_4_TAUGHT: string[] = [
  'articles', 'plurals', 'noun prefixes', 'common nouns', 'abstract nouns',
  'adjectives', 'verbs', 'simple sentences', 'statements', 'questions',
  'similes', 'metaphors', 'idioms', 'question mark', 'exclamation mark',
  'dictionary use', 'relative pronouns', 'reflexive pronouns', 'adverbs',
  'conjunctions', 'interjections', 'simple present tense',
  'simple past tense', 'concord', 'antonyms', 'synonyms', 'full stop',
  'comma', 'word division', 'countable nouns', 'uncountable nouns',
  'capital letters', 'lower case letters', 'personal pronouns',
  'possessive pronouns', 'demonstrative pronouns', 'subject', 'object',
  'borrowed words', 'complex sentences', 'one word for a phrase',
  'concrete nouns', 'compound nouns', 'rhymes', 'personification',
  'alliteration', 'regular verbs', 'irregular verbs', 'finite verbs',
  'infinite verbs', 'transitive verbs', 'subject-verb agreement',
  'past tense', 'future tense', 'proverbs', 'infinitive verbs',
  'direct speech', 'quotation marks', 'main clause', 'dependent clause',
  'colon', 'semi-colon', 'inverted commas', 'auxiliary verbs', 'modal verbs',
  'moods', 'prefix', 'root', 'suffix', 'paragraphs', 'moral of the story',
  'stems', 'verb clause', 'rhythm and rhyme', 'abbreviations', 'acronyms',
  'truncation', 'initialisation', 'collective nouns', 'adverbs of place',
  'adverbs of degree', 'tenses', 'pronouns', 'noun phrase', 'noun clause',
  'indirect speech', 'main verbs', 'intransitive verbs', 'present tense',
];

/**
 * **What a Grade 6 English FAL child arrives holding, in English.**
 *
 * *English FAL Thuto 5*'s arrival ledger, copied verbatim: its Grade 4 base
 * plus everything that app's Grade 4 year taught, about 1 850 words. The Grade
 * 6 FAL year's own vocabulary is **not** here — it sits in `FAL_LEDGER` below
 * and is released a term at a time, which is what "one term behind" means
 * (PRD §8.2a).
 *
 * The failure mode the FAL file warned about still governs: **too short is
 * worse than too long.** Too short, and the five-word budget is spent on
 * `because` and `together`, every text trips the validator, and an author
 * starts adding words to lists that never taught them — at which point the
 * ledger means nothing and the check is theatre.
 *
 * **Do not edit this list to make a check pass.** It is a copy of a measurement
 * another app made about this child. The honest fix for a text that trips on a
 * word is to gloss the word.
 */
export const CORE_WORDS: string[] = [
  /* ---- the arrival ledger of *English FAL Thuto 4*, copied verbatim ---- */
  'thandi', 'sipho', 'lerato', 'naledi', 'mpho', 'ayanda', 'kagiso', 'zweli',
  'nomsa', 'themba', 'amina', 'zanele', 'lungi', 'tumi', 'bongi', 'pieter',
  'sarah', 'james', 'anna', 'ben', 'sam', 'tim', 'dan', 'kim', 'nandi',
  'jabu', 'gogo', 'mama', 'tata', 'bhuti', 'sisi', 'ma', 'pa', 'malume', 'a',
  'an', 'the', 'and', 'but', 'or', 'so', 'if', 'when', 'then', 'than',
  'because', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of', 'off',
  'on', 'out', 'over', 'to', 'up', 'down', 'under', 'with', 'without',
  'about', 'after', 'again', 'along', 'around', 'before', 'behind', 'below',
  'beside', 'between', 'near', 'next', 'past', 'until', 'while', 'here',
  'there', 'where', 'why', 'how', 'what', 'who', 'whom', 'whose', 'which',
  'that', 'this', 'these', 'those', 'it', 'its', 'he', 'him', 'his', 'she',
  'her', 'hers', 'they', 'them', 'their', 'theirs', 'we', 'us', 'our',
  'ours', 'you', 'your', 'yours', 'i', 'me', 'my', 'mine', 'myself',
  'herself', 'himself', 'themselves', 'yourself', 'ourselves', 'itself',
  'some', 'any', 'all', 'both', 'each', 'every', 'few', 'many', 'more',
  'most', 'much', 'no', 'none', 'not', 'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'twenty',
  'thirty', 'forty', 'fifty', 'hundred', 'first', 'second', 'third',
  'fourth', 'fifth', 'last', 'only', 'other', 'others', 'same', 'too',
  'very', 'own', 'another', 'yes', 'please', 'thank', 'thanks', 'hello',
  'goodbye', 'sorry', 'never', 'always', 'often', 'sometimes', 'soon',
  'today', 'tomorrow', 'yesterday', 'now', 'still', 'just', 'ever', 'once',
  'twice', 'also', 'even', 'perhaps', 'am', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did',
  'done', 'doing', 'can', 'could', 'will', 'would', 'shall', 'should', 'may',
  'might', 'must', 'go', 'goes', 'went', 'gone', 'going', 'come', 'came',
  'coming', 'get', 'got', 'give', 'gave', 'given', 'take', 'took', 'taken',
  'make', 'made', 'making', 'put', 'say', 'said', 'see', 'saw', 'seen',
  'look', 'looked', 'want', 'like', 'love', 'live', 'work', 'play', 'run',
  'ran', 'running', 'walk', 'jump', 'sit', 'sat', 'stand', 'stood', 'stop',
  'stopped', 'start', 'help', 'ask', 'tell', 'told', 'talk', 'call', 'find',
  'found', 'keep', 'kept', 'know', 'knew', 'known', 'think', 'thought',
  'feel', 'felt', 'need', 'try', 'tried', 'use', 'turn', 'open', 'close',
  'read', 'write', 'wrote', 'written', 'writing', 'draw', 'drew', 'sing',
  'sang', 'eat', 'ate', 'eaten', 'drink', 'drank', 'sleep', 'slept', 'wake',
  'woke', 'wash', 'clean', 'cook', 'buy', 'bought', 'bring', 'brought',
  'carry', 'send', 'sent', 'show', 'hear', 'heard', 'hold', 'held', 'leave',
  'left', 'let', 'lose', 'lost', 'meet', 'met', 'pay', 'paid', 'ride',
  'rode', 'sell', 'sold', 'throw', 'threw', 'wait', 'watch', 'win', 'won',
  'wear', 'wore', 'fall', 'fell', 'fly', 'flew', 'grow', 'grew', 'grown',
  'move', 'stay', 'pull', 'push', 'shout', 'smile', 'laugh', 'cry', 'cried',
  'hide', 'hid', 'pick', 'drop', 'dropped', 'fix', 'share', 'count',
  'change', 'answer', 'remember', 'forget', 'forgot', 'follow', 'happen',
  'begin', 'began', 'finish', 'learn', 'learnt', 'learned', 'teach',
  'taught', 'seem', 'become', 'became', 'bake', 'sweep', 'swept', 'fetch',
  'greet', 'catch', 'caught', 'cut', 'mix', 'add', 'point', 'name', 'list',
  'plan', 'check', 'choose', 'chose', 'mean', 'meant', 'wish', 'hope', 'die',
  'died', 'save', 'build', 'built', 'break', 'broke', 'broken', 'fill',
  'empty', 'climb', 'kick', 'clap', 'home', 'house', 'room', 'door',
  'window', 'wall', 'floor', 'roof', 'yard', 'garden', 'gate', 'street',
  'road', 'town', 'city', 'village', 'shop', 'spaza', 'school', 'class',
  'classroom', 'teacher', 'desk', 'chair', 'table', 'book', 'books', 'page',
  'pen', 'pencil', 'paper', 'bag', 'box', 'bell', 'board', 'library', 'hall',
  'field', 'playground', 'bus', 'taxi', 'train', 'car', 'bakkie', 'bike',
  'robot', 'shoe', 'shoes', 'sock', 'shirt', 'dress', 'coat', 'hat', 'bed',
  'blanket', 'cup', 'mug', 'plate', 'pot', 'pan', 'spoon', 'knife', 'fork',
  'kitchen', 'bath', 'soap', 'water', 'fire', 'light', 'money', 'rand',
  'cent', 'phone', 'radio', 'clock', 'basket', 'bucket', 'bottle', 'stick',
  'rope', 'key', 'card', 'shelf', 'boy', 'girl', 'man', 'woman', 'men',
  'women', 'child', 'children', 'baby', 'friend', 'family', 'mother',
  'father', 'sister', 'brother', 'granny', 'grandmother', 'people', 'person',
  'nurse', 'doctor', 'farmer', 'driver', 'shopkeeper', 'neighbour', 'group',
  'team', 'dog', 'cat', 'bird', 'fish', 'cow', 'goat', 'sheep', 'chicken',
  'hen', 'horse', 'pig', 'duck', 'frog', 'snake', 'lion', 'elephant',
  'monkey', 'zebra', 'giraffe', 'ant', 'bee', 'bees', 'spider', 'mouse',
  'rabbit', 'bread', 'milk', 'egg', 'eggs', 'rice', 'meat', 'soup', 'pap',
  'fruit', 'apple', 'banana', 'orange', 'sugar', 'salt', 'tea', 'coffee',
  'food', 'lunch', 'breakfast', 'supper', 'sun', 'rain', 'wind', 'cloud',
  'sky', 'moon', 'star', 'stars', 'tree', 'trees', 'grass', 'flower', 'leaf',
  'leaves', 'stone', 'sand', 'sea', 'river', 'hill', 'mountain', 'veld',
  'day', 'night', 'morning', 'afternoon', 'evening', 'week', 'month', 'year',
  'time', 'hour', 'minute', 'minutes', 'monday', 'tuesday', 'wednesday',
  'thursday', 'friday', 'saturday', 'sunday', 'january', 'june', 'december',
  'head', 'hair', 'eye', 'eyes', 'ear', 'ears', 'nose', 'mouth', 'hand',
  'hands', 'foot', 'feet', 'arm', 'leg', 'back', 'face', 'tooth', 'teeth',
  'heart', 'voice', 'word', 'words', 'story', 'stories', 'letter', 'thing',
  'things', 'place', 'way', 'end', 'top', 'side', 'part', 'game', 'ball',
  'toy', 'song', 'picture', 'pictures', 'colour', 'colours', 'number',
  'line', 'lines', 'note', 'notes', 'sound', 'sounds', 'shape', 'size',
  'names', 'idea', 'ideas', 'big', 'small', 'little', 'long', 'short',
  'tall', 'old', 'new', 'young', 'good', 'bad', 'better', 'best', 'happy',
  'sad', 'angry', 'kind', 'busy', 'quiet', 'loud', 'fast', 'slow', 'hot',
  'cold', 'warm', 'cool', 'wet', 'dry', 'dirty', 'full', 'hard', 'soft',
  'heavy', 'dark', 'bright', 'red', 'blue', 'green', 'yellow', 'black',
  'white', 'brown', 'grey', 'pink', 'nice', 'funny', 'scared', 'afraid',
  'hungry', 'thirsty', 'tired', 'ready', 'safe', 'sure', 'true', 'right',
  'wrong', 'well', 'far', 'high', 'low', 'deep', 'thin', 'thick', 'strong',
  'weak', 'early', 'late', 'together', 'alone', 'inside', 'outside',
  'quickly', 'slowly', 'carefully', 'suddenly', 'nearly', 'almost', 'easy',
  'clever', 'careful', 'lucky', 'free', 'closed', 'round', 'flat', 'sharp',
  'grade', 'term', 'subject', 'lesson', 'sentence', 'sentences', 'paragraph',
  'paragraphs', 'question', 'questions', 'answers', 'title', 'important',
  'different', 'information', 'example', 'describe', 'means', 'meaning',
  'meanings', 'spell', 'spelling', 'dictionary', 'writes', 'reading',
  'listen', 'listening', 'speak', 'speaking', 'talking', 'tap', 'taps',
  'order', 'match', 'sort', 'text', 'texts', 'copy', 'practise', 'practice',
  'finished', 'soccer', 'netball', 'cricket', 'rugby', 'goal', 'player',
  'coach', 'sport', 'sports', 'music', 'art', 'dance', 'dancing', 'race',
  'everybody', 'somebody', 'anybody', 'nobody', 'everyone', 'someone',
  'anyone', 'everything', 'something', 'anything', 'nothing', 'everywhere',
  'somewhere', 'anywhere', 'nowhere', 'welcome', 'form', 'forms', 'away',
  'above', 'across', 'against', 'among', 'towards', 'through', 'during',
  'usually', 'mostly', 'really', 'maybe', 'else', 'such', 'either', 'whole',
  'half', 'reason', 'reasons', 'problem', 'chance', 'care', 'pair', 'pairs',
  'row', 'rows', 'column', 'columns', 'bit', 'piece', 'lot', 'lots', 'job',
  'jobs', 'office', 'factory', 'farm', 'shift', 'uniform', 'homework',
  'register', 'principal', 'lessons', 'sunny', 'cloudy', 'windy', 'rainy',
  'storm', 'storms', 'thunder', 'lightning', 'shade', 'shadow', 'soil',
  'mud', 'dust', 'smoke', 'ash', 'bush', 'fence', 'path', 'bridge', 'corner',
  'middle', 'centre', 'pavement', 'hospital', 'clinic', 'church', 'police',
  'station', 'counter', 'price', 'cost', 'cheap', 'sick', 'pain', 'medicine',
  'plaster', 'wing', 'feather', 'nest', 'dam', 'tin', 'glass', 'plastic',
  'wood', 'uncle', 'aunt', 'cousin', 'grandfather', 'parent', 'parents',
  'surprised', 'excited', 'bored', 'lonely', 'enjoy', 'enjoyed', 'invite',
  'invited', 'join', 'joined', 'visit', 'visited', 'quietly', 'loudly',
  'softly', 'badly', 'nicely', 'finally', 'real', 'false', 'scarf', 'noise',
  'meal', 'meals', 'slice', 'slices', 'jam', 'spread', 'bin', 'bins', 'rule',
  'rules', 'finger', 'fingers', 'lip', 'lips', 'park', 'parked', 'slip',
  'slipped', 'slipping', 'sandwich', 'crumb', 'towel', 'brush', 'comb',
  'button', 'pocket', 'zip', 'stack', 'pile', 'heap', 'edge', 'bottom',
  'front', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen', 'sixty', 'seventy', 'eighty', 'ninety', 'thousand',
  'metre', 'metres', 'kilometre', 'kilometres', 'litre', 'litres', 'crash',
  'drip', 'bang', 'beep', 'drum', 'drums', 'bark', 'barks', 'splash', 'tick',
  'knock', 'whistle', 'roar', 'hiss', 'rattle', 'thud', 'log', 'football',
  'country', 'countries', 'umbrella', 'blow', 'blew', 'blowing', 'blown',
  'wire', 'amazing', 'tongue', 'ice', 'cannot', 'cross', 'crossed',
  'dangerous', 'candle', 'candles', 'wax', 'flame', 'torch', 'matches',
  'moment', 'moments', 'shops', 'load', 'loads', 'lay', 'lain', 'upon',
  'smell', 'smells', 'single', 'silver', 'gold', 'fear', 'fears', 'hopes',
  'joy', 'anger', 'tapped', 'sung', 'filled', 'cans', 'channel', 'channels',
  'enough', 'smart', 'fresh', 'wooden', 'apart', 'hang', 'hangs', 'hung',
  'tie', 'ties', 'tied', 'upside', 'branch', 'branches', 'male', 'female',
  'purpose', 'world', 'mate', 'animal', 'animals', 'insect', 'insects',
  'skin', 'stuck', 'ago', 'plain', 'asleep', 'leap', 'rock', 'rocks',
  'hidden', 'seed', 'seeds', 'flowers', 'drawer', 'stove', 'spit', 'roll',
  'rolls', 'rolled', 'slide', 'sliding', 'shake', 'shaking', 'pulls',
  'pulled', 'tight', 'crowd', 'herd', 'flock', 'bunch', 'groups', 'prices',
  'shelves', 'streets', 'winds', 'throat', 'dying', 'matter', 'matters',
  'writer', 'writers', 'weaver', 'weavers', 'stitch', 'stitches', 'vessel',
  'vessels', 'great', 'gulp', 'gulps', 'fridge', 'cough', 'coughs', 'rank',
  'township', 'hoot', 'hoots', 'instead', 'promise', 'promised', 'dug',
  'dig', 'ground', 'straight', 'already', 'sum', 'sums', 'step', 'steps',
  'decide', 'decided', 'paint', 'painted', 'primary', 'shipping', 'hurt',
  'zone', 'washing', 'learner', 'learners', 'since', 'ring', 'rings', 'rang',
  'air', 'burn', 'burns', 'burning', "o'clock", 'touch', 'touched', 'wife',
  'wives', 'husband', 'heat', 'indeed', 'shell', 'shells', 'tube', 'tubes',
  'spot', 'bella', 'africa', 'african', 'south', 'north', 'east', 'west',
  'soweto', 'durban', 'pretoria', 'gauteng', 'limpopo', 'mzansi', 'joburg',
  'cape', 'karoo', 'zulu', 'sesotho', 'xhosa', 'setswana', 'zola', 'rosie',
  'vilakazi', 'orlando', 'hare', 'leopard', 'dlamini', 'khumalo', 'mtshali',
  'ndlovu', 'mokoena', 'ah', 'eh', 'ih', 'oh', 'uh', 'aa', 'ay', 'ee', 'oo',
  'oy', 'ar', 'er', 'buh', 'chuh', 'duh', 'fff', 'guh', 'huh', 'juh', 'kuh',
  'kwuh', 'luh', 'mmm', 'nnn', 'ngg', 'nnk', 'puh', 'rrr', 'sss', 'shh',
  'thuh', 'tuh', 'vvv', 'wuh', 'yuh', 'zzz', 'ks', 'lll', 'ow', 'oi', 'b',
  'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x', 'y', 'z',

  /* ---- and everything its seventeen cycles taught, now arrival words ---- */
  'poster', 'advert', 'event', 'trials', 'venue', 'entry', 'design', 'font',
  'character', 'extract', 'novel', 'chapter', 'brave', 'selfish', 'sketch',
  'plot', 'setting', 'experience', 'market', 'worried', 'proud', 'recipe',
  'kettle', 'teabag', 'boil', 'pour', 'ingredients', 'stir', 'braai',
  'notice', 'warning', 'entrance', 'permission', 'allowed', 'arrow', 'sign',
  'poem', 'rhyme', 'rhythm', 'verse', 'limerick', 'syllable', 'buzz',
  'weather', 'report', 'forecast', 'temperature', 'drought', 'degrees',
  'chart', 'dialogue', 'interview', 'conversation', 'reply', 'review',
  'opinion', 'instructions', 'safety', 'pedestrian', 'crossing', 'danger',
  'directions', 'kerb', 'folklore', 'myth', 'legend', 'ancestor', 'greedy',
  'python', 'recount', 'unhappy', 'unkind', 'unsafe', 'rewrite', 'reread',
  'careless', 'helpful', 'painful', 'useful', 'useless', 'research',
  'source', 'mind map', 'topic', 'fact', 'diagram', 'draft', 'frame', 'edit',
  'proofread', 'present', 'heading', 'stanza', 'sizzle', 'tinkle', 'echo',
  'chorus', 'onomatopoeia', 'advertisement', 'persuade', 'bargain', 'slogan',
  'customer', 'discount', 'suspense', 'courage', 'decision', 'mystery',
  'sunset', 'whisper', 'drama', 'scene', 'stage', 'script', 'actor',
  'curtain', 'role', 'headline', 'by-line', 'reporter', 'article',
  'community', 'flood',
];

/* ------------------------------------------------------------- the ladder */

/**
 * Term 1 — *Texts that tell you things*.
 *
 * Five teaching cycles. The ATP's fourth column, copied verbatim. This term
 * opens on the **finite / infinite verb** distinction — the first thing this
 * ATP asks for and something Grade 4 named only in passing — and closes on the
 * abbreviations row, which is the one place in the year where *how a thing is
 * said* is the curriculum (PRD §7.5).
 *
 * The Baseline Assessment in the first three days of week 1 is a teacher
 * activity. **Week 1 is not carved out** — the cycle underneath it is full
 * content and becomes a normal topic.
 */
const TERM_1_LADDER: LadderCycle[] = [
  {
    term: 1,
    weeks: [1, 2],
    items: [
      'finite verbs', 'infinite verbs',
      'simple present tense', 'simple future tense',
      'personification', 'proverbs', 'idioms', 'similes',
    ],
    words: [
      'information', 'message', 'email', 'salutation', 'sender', 'inbox',
      'purpose', 'truck',
    ],
  },
  {
    term: 1,
    weeks: [3, 4],
    items: [
      'relative pronouns', 'reflexive pronouns', 'adjectives', 'adverbs',
      'conjunctions', 'connections', 'interjections',
      'simple present tense', 'simple past tense', 'concord',
      'similes', 'proverbs', 'idioms',
      'full stop', 'comma', 'dictionary use', 'word division',
    ],
    words: [
      'novelette', 'review', 'summary', 'narrator', 'chronology', 'frame',
      'themes', 'locked',
    ],
  },
  {
    term: 1,
    weeks: [5, 6],
    items: [
      'common nouns', 'proper nouns', 'noun prefixes', 'suffixes',
      'simple past tense',
      'synonyms',
      'full stop', 'comma', 'quotation marks', 'dictionary use',
    ],
    words: ['empathy', 'respect', 'feedback', 'issue', 'turns', 'ending'],
  },
  {
    term: 1,
    weeks: [7, 8],
    items: [
      'prepositions', 'determiners', 'articles',
      'tenses',
      'antonyms',
      'question marks', 'dictionary use', 'word order',
    ],
    words: ['assumption', 'intention', 'inference', 'coherent', 'audience', 'survey'],
  },
  {
    term: 1,
    weeks: [9, 10],
    items: [
      'adverbs of manner', 'adverbs of time', 'adverbs of place',
      'adverbs of degree', 'prepositions', 'moods', 'adjectives',
      'simple sentences', 'complex sentences',
      'full stop', 'exclamation marks', 'abbreviations', 'acronyms',
      'initialisation', 'truncation',
    ],
    words: [
      'imperative', 'procedure', 'method', 'abbreviation', 'acronym', 'spread',
      // The ATP's fourth column for this cycle is adverbs of manner, time,
      // place and degree. These four are the words the lesson takes apart.
      'gently', 'quite', 'cover', 'press', 'cheese',
    ],
  },
];

/**
 * Term 2 — *Poems, plays and reports*.
 *
 * Four teaching cycles. **Weeks 9–10 are the June controlled test** and carry
 * no ATP content at all; the Term 2 Star Challenge takes that slot, and a Star
 * Challenge is checked against the whole term rather than a cycle, so it has no
 * rung here.
 *
 * Weeks 5–6 and 7–8 hold the year's two hardest grammar cells, and **they are
 * two cells, not one**: the play cycle takes direct and indirect speech with
 * the semi-colon, and the report cycle takes the continuous tenses, the active
 * and passive voice, and the ellipsis. The ATP prints them in that order and
 * the app's topic titles follow it.
 */
const TERM_2_LADDER: LadderCycle[] = [
  {
    term: 2,
    weeks: [1, 2],
    items: [
      'collective nouns', 'abstract nouns', 'interjections',
      'present continuous tense',
      'alliteration', 'assonance', 'consonance', 'personification', 'rhythm',
      'rhyme', 'metaphor', 'simile',
      'word division', 'dictionary use', 'exclamation mark',
    ],
    words: [
      'assonance', 'consonance', 'tone', 'atmosphere', 'tempo', 'intonation',
      'pacing', 'breath', 'hole', 'seat', 'tonight',
    ],
  },
  {
    term: 2,
    weeks: [3, 4],
    items: [
      'verbs', 'gerunds', 'pronouns', 'adverbs', 'adjectives', 'conjunctions',
      'abstract nouns',
      'simple sentences', 'compound sentences', 'future tense',
      'homophones', 'homonyms', 'polysemy', 'antonyms', 'synonyms',
    ],
    words: [
      'gerund', 'homophone', 'homonym', 'polysemy', 'humidity', 'symbol',
      'destination',
      // The four towns of this cycle's map. Invented places, and they are this
      // fortnight's proper nouns exactly as a story's characters are.
      'kubu', 'metsi', 'dipale', 'selo',
    ],
  },
  {
    term: 2,
    weeks: [5, 6],
    items: [
      'verbs (gerunds)',
      'statements', 'questions', 'commands', 'simple sentences',
      'compound sentences', 'direct and indirect speech',
      'oxymoron',
      'quotation marks', 'semi-colon', 'inverted commas',
    ],
    words: ['oxymoron', 'register', 'cast', 'props', 'rehearse', 'quarrel'],
  },
  {
    term: 2,
    weeks: [7, 8],
    items: [
      'adjectives', 'pronouns', 'conjunctions', 'connections',
      'past continuous tense', 'future continuous tense',
      'active and passive voice', 'reported speech', 'question form',
      'ellipsis', 'exclamation mark', 'quotation marks', 'question mark',
    ],
    words: [
      'table', 'column', 'graph', 'total', 'ellipsis', 'passive', 'analyse',
      'bar',
    ],
  },
];

/**
 * Term 3 — *Old stories, and finding things out*.
 *
 * Five teaching cycles. Weeks 3–4 and 5–6 are the ATP's **Creative Writing
 * Project** — stage 1 research, stage 2 writing — and **their fourth columns
 * are reprints of term 1's** (weeks 1–2 and weeks 7–8, word for word). Weeks
 * 9–10 reprints term 2 weeks 1–2 the same way.
 *
 * That is the ATP telling you these three cycles teach no new grammar, and the
 * app takes it at its word: their Language lessons are revision, and the
 * project's real content is the research, the sources and the bibliography.
 * The "NOTE TO THE TEACHER" boxes around them are project management and are
 * not converted.
 */
const TERM_3_LADDER: LadderCycle[] = [
  {
    term: 3,
    weeks: [1, 2],
    items: [
      'infinite verbs', 'gerund', 'singular nouns', 'plural nouns',
      'diminutive prefixes', 'adjectives',
      'object', 'questions', 'direct and indirect speech', 'paragraphs',
      'quotation marks', 'capital letters', 'full stop', 'comma',
    ],
    words: [
      'realistic', 'unrealistic', 'diminutive', 'timeline', 'terminology',
      'sequence', 'plant', 'cattle', 'string',
    ],
  },
  {
    term: 3,
    weeks: [3, 4],
    // A reprint of term 1 weeks 1–2, exactly as the ATP prints it.
    items: [
      'finite verbs', 'infinite verbs',
      'simple present tense', 'simple future tense',
      'personification', 'proverbs', 'idioms', 'similes',
    ],
    words: ['bibliography', 'reference', 'organiser', 'venn diagram', 'sequence chart', 'synthesise'],
  },
  {
    term: 3,
    weeks: [5, 6],
    // A reprint of term 1 weeks 7–8, plus the ATP's own "reinforcement of
    // language structures and conventions covered in previous weeks".
    items: [
      'prepositions', 'determiners', 'articles',
      'tenses',
      'antonyms',
      'question marks', 'dictionary use', 'word order',
    ],
    words: [
      'genre', 'rubric', 'criteria', 'word bank', 'conventions', 'descriptors',
      'winter', 'land', 'cave',
    ],
  },
  {
    term: 3,
    weeks: [7, 8],
    items: [
      'degrees of comparison', 'adverbs',
      'simple short sentences', 'subject-verb agreement',
      'abbreviations', 'inverted commas',
    ],
    words: [
      'layout', 'lettering', 'effective', 'comparison', 'logo', 'claim',
      'wheel', 'rest', 'mend', 'bicycle', 'life',
    ],
  },
  {
    term: 3,
    weeks: [9, 10],
    // A reprint of term 2 weeks 1–2.
    items: [
      'collective nouns', 'abstract nouns', 'interjections',
      'present continuous tense',
      'alliteration', 'assonance', 'consonance', 'personification', 'rhythm',
      'rhyme', 'metaphor', 'simile',
      'word division', 'dictionary use', 'exclamation mark',
    ],
    words: [
      'performance', 'expression', 'posture', 'pronunciation', 'verse', 'slam',
      'lean',
    ],
  },
];

/**
 * Term 4 — *Stories, reports and the whole year*.
 *
 * **Three teaching cycles only, and that asymmetry is real.** Weeks 7–8 are
 * revision and the formal assessment of the oral presentation; weeks 9–10 are
 * the end-of-year controlled test. The Term 4 Star Challenge takes weeks 7–8,
 * and weeks 9–10 carry only the daily rhythms.
 *
 * Do not force this term flat. An app that invented a fourth term 4 cycle would
 * be putting curriculum in a week the child is sitting an exam.
 *
 * The two visual cycles here are the year's payload: the phrase row in weeks
 * 3–4 and the clause row in weeks 5–6 are the grammar half of question 4 in the
 * end-of-year test, and *"transfers information from the visual to narrative
 * form"* — printed in weeks 5–6 — is the sentence this whole app was built
 * around.
 */
const TERM_4_LADDER: LadderCycle[] = [
  {
    term: 4,
    weeks: [1, 2],
    items: [
      'noun prefixes', 'adjectives', 'adverbs', 'pronouns', 'conjunctions',
      'subject', 'object', 'subject-verb agreement', 'concord',
      'proverbs', 'idioms', 'metaphors',
      'dictionary use',
    ],
    words: [
      'fable', 'moral', 'boast', 'trick', 'description', 'imaginative',
      'tortoise', 'marks', 'horns',
    ],
  },
  {
    term: 4,
    weeks: [3, 4],
    items: [
      'conjunctions', 'mood',
      'noun phrase', 'adjectival phrase', 'adverbial phrase',
      'prepositional phrase',
      'synonyms', 'antonyms', 'homophones', 'homonyms', 'polysemy',
      'word division', 'dictionary use', 'capital letters',
    ],
    words: [
      'phrase', 'introduction', 'conclusion', 'critical', 'thoughtful',
      'topical', 'map', 'whether', 'yet', 'probably',
    ],
  },
  {
    term: 4,
    weeks: [5, 6],
    items: [
      'definite articles', 'indefinite articles', 'adjectives',
      'noun clause', 'verb clause', 'negative form', 'question form',
      'metaphors', 'similes', 'proverbs', 'idioms',
      'dictionary use', 'word division',
    ],
    words: [
      'clause', 'narrative', 'transfer', 'pie chart', 'line graph', 'scale',
      'march', 'july', 'september', 'dot', 'circle',
    ],
  },
];

/**
 * The seventeen Grade 6 teaching cycles of the year, in order.
 *
 * Seventeen, not twenty: three of the ATP's cycles carry no teaching content —
 * the June controlled test, the term 4 revision and oral assessment week, and
 * the end-of-year controlled test — and therefore have no rung.
 */
/**
 * **The Grade 6 FAL year, cycle by cycle — the budget this app spends.**
 *
 * These are this app's own teaching cycles, read from the ATP's fourth column.
 * A child meets a word in the fortnight that teaches it, and does not yet hold
 * it the same week — so `wordsUpTo` releases each term's words **one term
 * behind**, for the child who has genuinely met them (PRD §8.2a). The lag is
 * the smallest honest gap between *taught* and *known*.
 */
export const FAL_LEDGER: LadderCycle[] = [
  ...TERM_1_LADDER,
  ...TERM_2_LADDER,
  ...TERM_3_LADDER,
  ...TERM_4_LADDER,
];

/**
 * **Empty, on purpose** (PRD §5.7).
 *
 * Mathematics teaches no language items. The inherited forward-reference check
 * runs over this list and passes; **leave the check in and leave this empty.**
 * Deleting either is a re-merge cost the next fork pays, and this fork deletes
 * nothing (PRD §15.2).
 */
export const LANGUAGE_LADDER: LadderCycle[] = [];

/** The name PRD §8.2a gives the borrowed cycles read as a ledger. */
export const WORD_LEDGER: LadderCycle[] = FAL_LEDGER;

/**
 * **The one exemption, and it is the subject** — PRD §8.3, §1.1 rule 5.
 *
 * *Numerator*, *denominator*, *quadrilateral*, *perimeter*, *tessellation*,
 * *commutative*. **These are the words the subject exists to give her.** They
 * are glossed with a picture like everything else, **they carry an explicit
 * `say`** (PRD §9.1 caveat 1), and **they do not count against the budget.**
 *
 * A word problem that ran out of budget before the word *denominator* would
 * have spent its five words on *because* and *together* and then been unable to
 * name the thing it was about.
 *
 * > **And one word is on this list that looks as though it should not be:
 * > *estimate*.** It is ordinary English and a ten-year-old may well have it.
 * > **It is exempt because this ATP uses it as a technical instruction, over
 * > and over** — *"estimate and practically measure"* in every measurement
 * > block, *"rounding off to estimate answers"* in every calculation block —
 * > and **a child who thinks it means *guess* will do the whole of Term 3
 * > wrong.** It is glossed everywhere it appears.
 *
 * The inflected forms are listed out rather than derived, because
 * `wordAvailable`'s stemmer is built for ordinary English and *"multiplied"* is
 * not *"multiply"* + `ed` by any rule it knows.
 */
export const MATHS_WORDS: string[] = [
  /* ---- fractions ---- */
  'numerator', 'numerators', 'denominator', 'denominators',
  'equivalent', 'equivalence', 'fraction', 'fractions', 'mixed',
  'half', 'halves', 'third', 'thirds', 'quarter', 'quarters',
  'fifth', 'fifths', 'sixth', 'sixths', 'seventh', 'sevenths',
  'eighth', 'eighths', 'ninth', 'ninths', 'tenth', 'tenths',
  'eleventh', 'elevenths', 'twelfth', 'twelfths',

  /* ---- shape ---- */
  'polygon', 'polygons', 'quadrilateral', 'quadrilaterals',
  'pentagon', 'pentagons', 'hexagon', 'hexagons',
  'heptagon', 'heptagons', 'triangle', 'triangles',
  'rectangle', 'rectangles', 'prism', 'prisms', 'cube', 'cubes',
  'cylinder', 'cylinders', 'cone', 'cones', 'pyramid', 'pyramids',
  'sphere', 'spheres', 'face', 'faces', 'net', 'nets',
  'regular', 'irregular', 'symmetry', 'symmetrical',
  'rotation', 'rotate', 'rotates', 'translation', 'translate',
  'reflection', 'reflect', 'reflects', 'tessellation', 'tessellate',
  'composite', 'horizontal', 'vertical', 'grid', 'grids',

  /* ---- measurement ---- */
  'perimeter', 'area', 'volume', 'capacity', 'mass',
  'millimetre', 'millimetres', 'centimetre', 'centimetres',
  'metre', 'metres', 'kilometre', 'kilometres',
  'millilitre', 'millilitres', 'litre', 'litres',
  'gram', 'grams', 'kilogram', 'kilograms',
  'convert', 'converts', 'converting', 'conversion',
  'estimate', 'estimates', 'estimating', 'estimation',
  'measure', 'measures', 'measuring', 'measurement',
  'balance', 'balances', 'trundle', 'analogue', 'digital',
  'decade', 'decades', 'interval', 'intervals',

  /* ---- number and operations ---- */
  'commutative', 'associative', 'distributive',
  'multiple', 'multiples', 'factor', 'factors',
  'remainder', 'remainders', 'product', 'quotient',
  'multiply', 'multiplies', 'multiplied', 'multiplying', 'multiplication',
  'divide', 'divides', 'divided', 'dividing', 'division',
  'subtract', 'subtracts', 'subtracted', 'subtracting', 'subtraction',
  'digit', 'digits', 'column', 'columns', 'inverse', 'ones', 'tens',
  'zero', 'difference', 'length', 'lengths', 'distance', 'space', 'solid',
  'solids', 'unit', 'units', 'square', 'squares', 'fold', 'folds', 'folded',
  'gap', 'gaps', 'flip', 'flips', 'slide', 'slides', 'turn', 'turns',
  'level', 'levels', 'whole', 'wholes',
  // operation and comparison words the app fixes in i18n (PRD §9.1 caveat 5)
  'plus', 'minus', 'equals', 'equal', 'double', 'doubles', 'backwards',
  'forwards', 'amount', 'amounts', 'worth', 'bar', 'bars', 'curved',
  'straight', 'rectangular', 'split', 'splits', 'matching',
  'round', 'rounds', 'rounded', 'rounding',
  'thousand', 'thousands', 'hundred', 'hundreds',
  'sentence', 'sentences', 'sequence', 'sequences',
  'pattern', 'patterns', 'rule', 'rules',
  'input', 'inputs', 'output', 'outputs', 'diagram', 'diagrams',
  'ratio', 'ratios', 'rate', 'rates',

  /* ---- data and chance ---- */
  'pictograph', 'pictographs', 'graph', 'graphs',
  'tally', 'tallies', 'frequency', 'frequencies', 'mode',
  'data', 'category', 'categories', 'chart', 'charts',
  'outcome', 'outcomes', 'trial', 'trials', 'spinner', 'spinners',
  'probability', 'die', 'dice',
];

/**
 * **One list, where the Life Skills lineage had three.**
 *
 * That app counted *careful*, *health* and *arts* separately in its banner,
 * because the three were exempt for three different reasons and a run that had
 * stopped distinguishing them had stopped checking anything. **This subject has
 * exactly one reason**, so it has one list, and the validator prints its count
 * and — for a subject where the exemption is this large — **prints the words
 * themselves**, so a person can see what the year actually spent.
 */
export const EXEMPT_WORDS: Record<'maths', Set<string>> = {
  maths: new Set(MATHS_WORDS),
};

/** Which exemption list a word is on, or null. */
export function exemptionFor(word: string): 'maths' | null {
  const key = normaliseWord(word);
  if (EXEMPT_WORDS.maths.has(key)) return 'maths';
  return null;
}

/**
 * New words a single `read-text` may carry beyond the cumulative ledger — and
 * every one of them must be glossed, **with a picture** (PRD §8.2b).
 *
 * Five is not arbitrary. It is roughly the number of unknown words a reader can
 * absorb from one short text without the text becoming a vocabulary exercise,
 * and it happens to be the size of the vocabulary set a fortnight teaches, so
 * the five new words in a text *are* the five words the cycle is teaching.
 */
export const NEW_WORD_BUDGET = 5;

/* ---------------------------------------------------------------- lookups */

/**
 * Where a cycle sits in the year, so "this cycle or any earlier one" is a
 * comparison rather than a search.
 *
 * Ten **ATP** weeks per term, four terms. The terms themselves are 10 / 12 / 11
 * / 10 weeks long (`calendar.ts`), but the ATP's own week numbering stops at
 * ten on every term page, and that is what a cycle is indexed by.
 *
 * **Ordinal 0 is last year**, and that is what `GRADE_4_TAUGHT` occupies.
 */
export function cycleOrdinal(term: TermNumber, weekEnd: number): number {
  return (term - 1) * 10 + weekEnd;
}

/** `Full Stop`, `full stop` and `full-stop` are the same rung of the ladder. */
export function normaliseItem(item: string): string {
  return item
    .trim()
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ');
}

/** Case, curly apostrophes and surrounding punctuation are not new words. */
export function normaliseWord(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/^[^a-z']+|[^a-z']+$/g, '');
}

/**
 * Every language item the child has met by the end of a cycle.
 *
 * **It starts with last year's eighty-nine**, which is the whole of this fork's
 * inheritance in one line (PRD §8.2a).
 */
export function itemsUpTo(term: TermNumber, weekEnd: number): Set<string> {
  const limit = cycleOrdinal(term, weekEnd);
  const met = new Set<string>(GRADE_4_TAUGHT.map(normaliseItem));
  for (const cycle of LANGUAGE_LADDER) {
    if (cycleOrdinal(cycle.term, cycle.weeks[1]) > limit) continue;
    for (const item of cycle.items) met.add(normaliseItem(item));
  }
  return met;
}

/**
 * Whether an item an activity declares is one the child has already met.
 *
 * Singular and plural are the same rung — the ATP writes "adjectives" in its
 * column and an author writes "adjective" in an activity, and neither is wrong.
 */
export function itemAvailable(item: string, met: Set<string>): boolean {
  const key = normaliseItem(item);
  if (key.length === 0) return false;
  if (met.has(key)) return true;
  for (const candidate of [`${key}s`, `${key}es`, key.replace(/e?s$/, '')]) {
    if (candidate && met.has(candidate)) return true;
  }
  return false;
}

/**
 * The earliest cycle that teaches a given item phrase, as an ordinal.
 *
 * Earliest, not latest, and that direction is deliberate: `pronouns` is named
 * by five different cycles, and charging an activity to the last of them would
 * fail a term 1 lesson that legitimately says "pronoun". The forward-reference
 * check is about the item a cycle *introduces*.
 *
 * **Everything in `GRADE_4_TAUGHT` is ordinal 0**, so no Grade 6 activity can
 * ever trip on an item the child met last year.
 */
export const ITEM_FIRST_TAUGHT: Map<string, number> = (() => {
  const map = new Map<string, number>();
  for (const item of GRADE_4_TAUGHT) {
    for (const phrase of itemPhrases(item)) map.set(phrase, 0);
  }
  for (const cycle of LANGUAGE_LADDER) {
    const ordinal = cycleOrdinal(cycle.term, cycle.weeks[1]);
    for (const item of cycle.items) {
      for (const phrase of itemPhrases(item)) {
        const seen = map.get(phrase);
        if (seen === undefined || ordinal < seen) map.set(phrase, ordinal);
      }
    }
  }
  return map;
})();

/**
 * The ways an item might be written in an activity — singular and plural, and
 * the two spellings of a semi-colon.
 */
export function itemPhrases(item: string): string[] {
  const key = normaliseItem(item);
  const out = new Set<string>([key]);
  if (key.endsWith('ies')) out.add(`${key.slice(0, -3)}y`);
  else if (key.endsWith('es')) out.add(key.slice(0, -2));
  if (key.endsWith('s')) out.add(key.slice(0, -1));
  else out.add(`${key}s`);
  if (key.includes('semi colon')) out.add(key.replace('semi colon', 'semicolon'));
  return [...out].filter((phrase) => phrase.length > 2);
}

/**
 * Item phrases whose everyday meaning collides with their grammar meaning, and
 * which are therefore **not scanned for** in an activity's spoken strings.
 *
 * A story may say "the roots of the tree" without teaching a root; a weather
 * text may say "a mood" without teaching modal moods; a play cycle may say
 * "she gave him a command" without teaching the sentence type. These items are
 * still on the ladder and still checked wherever an activity *declares* one —
 * they are simply not caught by the phrase scan, because the scan would cry
 * wolf and get switched off (PRD §11).
 */
export const AMBIGUOUS_ITEMS = new Set<string>([
  'root', 'roots', 'stem', 'stems', 'mood', 'moods', 'subject', 'subjects',
  'object', 'objects', 'article', 'articles', 'concord', 'present tense',
  'past tense', 'future tense', 'tenses', 'tense', 'question', 'questions',
  'statement', 'statements', 'prefix', 'prefixes', 'suffix', 'suffixes',
  'verb', 'verbs', 'adjective', 'adjectives', 'noun', 'nouns',
  // Added for Grade 6: every one of these is an ordinary English word before
  // it is a rung, and each fired on a lesson that was doing nothing wrong.
  'command', 'commands', 'connection', 'connections', 'rhyme', 'rhymes',
  'rhythm', 'rhythms', 'phrase', 'phrases', 'clause', 'clauses',
  'question form', 'question forms', 'negative form', 'negative forms',
  'word order', 'word orders',
]);

/**
 * **Everything the child may be shown as a known word in this term** —
 * PRD §8.2a, §1.1 rule 5.
 *
 * `CORE_WORDS` plus every *English FAL Thuto 6* cycle from the terms **before**
 * this one. An English text in term 2 may use any word that app had taught
 * by the end of term 1; a term 1 text may use only the arrival ledger.
 *
 * | Term | May use                          |
 * | ---: | -------------------------------- |
 * |    1 | the FAL Grade 5 ledger (~1 850)  |
 * |    2 | + FAL Grade 6 term 1             |
 * |    3 | + FAL Grade 6 term 2             |
 * |    4 | + FAL Grade 6 term 3             |
 *
 * **The week is not read.** The lag is a whole term, deliberately: a child does
 * not hold a word the week she meets it, and a term is the granularity a person
 * can actually check. The parameter stays in the signature because the
 * inherited validator passes it and because a later app in another subject may
 * want a finer lag — but if you find yourself using it here, you have made the
 * gap smaller than the file says it is.
 *
 * A word outside this set is not forbidden — it is **budgeted**, glossed, and
 * given a picture (PRD §8.2a).
 */
export function wordsUpTo(term: TermNumber, _weekEnd?: number): Set<string> {
  const met = new Set<string>(CORE_WORDS.map(normaliseWord));
  for (const cycle of FAL_LEDGER) {
    // One term behind: term 2 spends what FAL taught in term 1.
    if (cycle.term > term - 1) continue;
    for (const word of cycle.words) {
      // A vocabulary entry may be two words ("pie chart") or hyphenated
      // ("by-line"); both spell one ledger entry and its parts.
      met.add(normaliseWord(word));
      for (const part of word.split(/[\s-]+/)) met.add(normaliseWord(part));
      met.add(normaliseWord(word.replace(/-/g, '')));
    }
  }
  return met;
}

/**
 * Whether a word counts as one the child has met.
 *
 * The ledger holds dictionary forms and the ATP teaches the endings that grow
 * them — plurals, the regular verb endings, comparatives — so a regular ending
 * on a word in the ledger counts as that word. An *irregular* form is a
 * different word and still has to be taught or budgeted.
 */
export function wordAvailable(word: string, met: Set<string>): boolean {
  const key = normaliseWord(word);
  if (key.length === 0) return true;
  if (met.has(key)) return true;

  const stems = new Set<string>();
  const add = (stem: string) => {
    if (stem.length >= 2) stems.add(stem);
  };

  for (const ending of ['s', 'es', 'ed', 'ing', 'er', 'est', 'ly', "'s", "s'"]) {
    if (!key.endsWith(ending) || key.length <= ending.length) continue;
    const stem = key.slice(0, key.length - ending.length);
    add(stem);
    // `baking` → `bake`, `nicer` → `nice`
    add(`${stem}e`);
    // `stopped` → `stop`, `running` → `run`
    if (stem.length > 2 && stem[stem.length - 1] === stem[stem.length - 2]) {
      add(stem.slice(0, -1));
    }
    // `happier` → `happy`, `tries` → `try`
    if (stem.endsWith('i')) add(`${stem.slice(0, -1)}y`);
  }
  // A plural in the ledger implies its singular and the other way round.
  add(`${key}e`);

  for (const stem of stems) {
    if (met.has(stem)) return true;
  }
  return false;
}

/**
 * The rung covering a term and week range, or null.
 *
 * **Always null in this app**, because `LANGUAGE_LADDER` is empty (PRD §5.7).
 * Kept so that the inherited check has something to call and returns cleanly
 * rather than something to delete.
 */
export function cycleFor(term: TermNumber, weeks: [number, number]): LadderCycle | null {
  return (
    LANGUAGE_LADDER.find(
      (cycle) => cycle.term === term && cycle.weeks[0] === weeks[0] && cycle.weeks[1] === weeks[1],
    ) ?? null
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 *  THE PREREQUISITE LADDER — PRD §1.1 rule 3, §8.2, §11 check 1.
 *
 *  **[new, and it is the file this fork exists to write.]**
 *
 *  Mathematics is the first subject in this family whose content is **strictly
 *  cumulative within itself**. A child cannot do the Term 2 division block
 *  without the Term 1 multiplication block. **The ATP already knows this and
 *  prints a `PREREQUISITE SKILL OR PRE-KNOWLEDGE` row under every single
 *  topic.** The app makes that row executable.
 *
 *  ── The check, and it is check 1 ─────────────────────────────────────────
 *
 *  Walk the topics in schedule order. For every topic, every id in `requires`
 *  must appear in the `teaches` of a **strictly earlier** topic, or in
 *  `ARRIVES_WITH`. Every skill appears in **exactly one** `teaches`. Every
 *  skill a topic claims to teach is **used by an activity in that topic**.
 *  **A forward reference fails the build.**
 *
 *  ── This is the file that shipped dead one fork ago ──────────────────────
 *
 *  *Life Skills Thuto 5* inherited `ladder.ts` from the language lineage and
 *  could not use it — Life Skills teaches no grammar — so its rung list shipped
 *  **empty** and its forward-reference check shipped **passing trivially**.
 *  Its PRD said: *"Leave the check in and let it pass on an empty rung list —
 *  deleting it is a re-merge cost the next fork pays."*
 *
 *  **The next fork is this one, and this is now the most important thing in the
 *  repo** (PRD §18.1 finding 1). Same shape, same check, same signatures,
 *  pointed at arithmetic instead of at grammar.
 *
 *  ── What it is not ───────────────────────────────────────────────────────
 *
 *  **It is not adaptivity and it is not a knowledge model.** It does not track
 *  what this child knows, it does not unlock or lock anything, and it does not
 *  route her anywhere. **It is a check on the author, run at build time, and
 *  the child never meets it** (PRD §8.2c, §2.2).
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * **What a Grade 5 Mathematics child arrives holding** — PRD §8.2a.
 *
 * **This is the part that makes the whole thing honest.** In *English FAL Thuto
 * 4* the arrival ledger was a day of judgement about what a child knows on the
 * first morning. **Here it is printed in the source document**: the
 * `PREREQUISITE SKILL OR PRE-KNOWLEDGE` row of every topic is a list of Grade 4
 * skills, in the DBE's own words. **Copied. Not improved, not merged, not added
 * to.**
 *
 * ── Two departures from PRD §8.2a, both recorded ─────────────────────────
 *
 * **1. It is read off all four terms' prerequisite rows, not only Term 1's.**
 * PRD §8.2a describes the Term 1 rows and expects fifteen. Those fifteen are
 * here and they are first, marked. **But terms 2, 3 and 4 print the same row
 * under every one of their topics too**, and it names Grade 4 skills that no
 * earlier topic in this app teaches — naming a 2-D shape, collecting data with
 * tallies, reading a scale. Without them, check 1 fails on a forward reference
 * for a skill the child genuinely arrives with. **The alternative was to invent
 * eighteen topics' worth of teaching for content the ATP says she already has.**
 *
 * **2. Where a term's prerequisite row is a verbatim repeat of that same
 * topic's own content row, it is a printing artefact and the skill is taught,
 * not required.** The ATP's Term 3 page does this twice: *"Measure perimeter
 * using rulers or measuring tapes"* and *"Find areas of regular and irregular
 * shapes by counting squares on grids"* appear in the `PERIMETER, AREA AND
 * VOLUME` column **and** in the prerequisite row underneath it. A skill cannot
 * be its own prerequisite, so those two are `teaches`.
 *
 * ── And the risk that comes with an arrival set ──────────────────────────
 *
 * **A child who did not use *Mathematics Thuto 4* arrives holding what a Grade
 * 5 classroom gave her, which may be less.** The set inherits; the assumption
 * does not. Three things hold the line: **Term 1's first topic re-teaches place
 * value from four digits up rather than assuming six**, the worked example
 * opens every topic, and PRD §17 test 5 walks Term 2 as a child who has never
 * seen the app.
 */
export const ARRIVES_WITH: Skill[] = [
  /* ── Term 1's own prerequisite rows: the fifteen, verbatim (PRD §8.2a) ── */
  { id: 'count-order-represent-4-digit', name: 'counting, ordering and comparing numbers up to four digits' },
  { id: 'place-value-4-digit', name: 'knowing what each digit is worth in a four-digit number' },
  { id: 'round-to-nearest-100', name: 'rounding off to the nearest hundred' },
  { id: 'multiply-by-2-3-4-5-10', name: 'multiplying by 2, 3, 4, 5 and 10 up to a hundred' },
  { id: 'divide-by-2-3-4-5-10', name: 'dividing numbers up to a hundred by 2, 3, 4, 5 and 10' },
  { id: 'use-operation-symbols', name: 'using the plus, minus, times, divided by and equals signs' },
  { id: 'add-subtract-4-digit', name: 'adding and taking away four-digit numbers' },
  { id: 'round-to-nearest-1000', name: 'rounding to the nearest ten, hundred or thousand to guess an answer' },
  { id: 'add-subtract-multiples-of-10-100-1000', name: 'adding and taking away tens, hundreds and thousands' },
  { id: 'multiply-2-digit-by-2-digit', name: 'multiplying a two-digit number by a two-digit number' },
  { id: 'double-and-halve', name: 'doubling a number and halving it' },
  { id: 'multiply-by-multiples-of-10-100-1000', name: 'multiplying by ten, a hundred and a thousand' },
  { id: 'build-up-break-down-4-digit', name: 'building up and breaking down a four-digit number' },
  { id: 'multiples-of-1-digit-to-100', name: 'the multiples of a one-digit number up to a hundred' },
  { id: 'one-as-multiplicative-identity', name: 'knowing that one times a number is that number' },

  /* ── Terms 2, 3 and 4's prerequisite rows: the same Grade 4, later pages ── */
  { id: 'divide-3-digit-by-1-digit', name: 'dividing a three-digit number by a one-digit number' },
  { id: 'compare-order-simple-fractions', name: 'comparing and ordering halves, thirds, quarters and eighths in a picture' },
  { id: 'equivalent-fractions-in-diagrams', name: 'seeing that two different fractions can be the same amount' },
  { id: 'add-fractions-in-context', name: 'adding fractions in a story' },
  { id: 'extend-a-pattern', name: 'carrying on a pattern' },
  { id: 'describe-a-pattern-in-own-words', name: 'saying in your own words how a pattern works' },
  { id: 'name-basic-2d-shapes', name: 'naming circles, triangles, squares and rectangles' },
  { id: 'sort-2d-shapes-by-sides', name: 'sorting flat shapes by their straight and round sides' },
  // **Appendix A finding 3, resolved on the printed page.** PRD §8.1 treats
  // line symmetry as Grade 5 content inside *Flat Shapes*; the ATP prints
  // `SYMMETRY` in Term 2's PREREQUISITE row, not its content row. **The page
  // wins**, so recognising it arrives with her and *Flat Shapes* teaches
  // drawing one on grid paper instead. Recorded in `docs/topic-sheet.md`.
  { id: 'recognise-line-symmetry', name: 'seeing that a shape has a line of symmetry' },
  { id: 'name-basic-3d-objects', name: 'naming boxes, balls, tins and pyramids' },
  { id: 'sort-3d-objects-by-faces', name: 'sorting solid objects by their flat and curved sides' },
  { id: 'make-3d-model-from-polygons', name: 'making a solid model out of cut-out shapes' },
  { id: 'collect-data-with-tallies', name: 'collecting answers with tally marks in a table' },
  { id: 'draw-pictograph-one-to-one', name: 'drawing a picture graph where one picture is one thing' },
  { id: 'read-bar-graph-and-pie-chart', name: 'reading a bar graph and a pie chart' },
  { id: 'answer-questions-about-data', name: 'answering questions about what a graph shows' },
  { id: 'summarise-data-in-writing', name: 'writing a short paragraph about what you found' },
  { id: 'list-outcomes-of-an-event', name: 'saying what can happen when you toss a coin or roll a die' },
  { id: 'measure-with-instruments', name: 'measuring with a ruler, a metre stick or a tape measure' },
  { id: 'record-compare-order-lengths', name: 'writing down lengths and putting them in order' },
  { id: 'convert-between-consecutive-units', name: 'changing centimetres into metres and back' },
  { id: 'tell-time-12-and-24-hour', name: 'telling the time on a clock face and on a digital clock' },
  { id: 'read-a-calendar', name: 'reading a calendar' },
  { id: 'days-between-two-dates', name: 'counting the days between two dates' },
  { id: 'time-intervals-in-minutes-or-hours', name: 'working out how long something took in minutes or hours' },
  { id: 'measure-length-with-informal-units', name: 'measuring with hand spans, paces and steps' },
  { id: 'measure-mass-with-scales', name: 'weighing something on a bathroom scale or a kitchen scale' },
  { id: 'convert-grams-and-kilograms', name: 'changing grams into kilograms and back' },
  { id: 'make-composite-2d-shapes', name: 'putting flat shapes together to make a bigger shape' },
  { id: 'make-tessellated-patterns', name: 'packing shapes together with no gaps' },
  { id: 'describe-patterns-in-culture', name: 'talking about patterns you see around you' },
];

/**
 * **Every skill this year teaches** — PRD §8.2b.
 *
 * A skill is **one nameable thing a child can do**, and it is **taught in
 * exactly one topic**. *"Fractions"* is not a skill. *"Adding two fractions
 * that have the same denominator"* is.
 *
 * **Roughly one per lesson**, which is the granularity PRD §18.9's worked
 * example sets: *Adding And Taking Away* is six lessons and six skills. Some
 * topics run a little over — the data cycle is five distinct things in three
 * lessons because the ATP prints five — and none runs under.
 *
 * **Every `name` is what the app would say to the child**, not what a teacher
 * would write on a report: *'rounding to the nearest thousand'*, never
 * *'rounding to a specified place value'*.
 */
export const SKILLS: Skill[] = [
  /* ── Term 1 ── */
  { id: 'count-order-6-digit', name: 'counting, ordering and comparing numbers up to six digits' },
  { id: 'place-value-6-digit', name: 'knowing what each digit is worth in a six-digit number' },
  { id: 'round-to-nearest-5', name: 'rounding to the nearest five' },
  { id: 'build-up-break-down-6-digit', name: 'building up and breaking down a six-digit number' },

  { id: 'write-a-number-sentence', name: 'writing a number sentence for a story' },
  { id: 'solve-a-number-sentence', name: 'finding the missing number in a number sentence' },
  { id: 'properties-of-operations', name: 'knowing that you can swap and regroup when you add or times' },

  { id: 'add-subtract-5-digit', name: 'adding and taking away five-digit numbers' },
  { id: 'estimate-a-sum', name: 'guessing roughly how big an answer will be before you work it out' },
  { id: 'build-up-and-break-down', name: 'breaking numbers into parts to add or take away' },
  { id: 'add-subtract-in-columns', name: 'adding and taking away in columns' },
  { id: 'carry-across-a-zero', name: 'taking away when there is a zero in the way' },
  { id: 'inverse-check', name: 'checking a take-away by adding it back' },

  { id: 'multiply-3-digit-by-2-digit', name: 'multiplying a three-digit number by a two-digit number' },
  { id: 'estimate-a-product', name: 'guessing roughly how big a times answer will be' },
  { id: 'multiply-in-columns', name: 'multiplying in columns' },
  { id: 'multiples-and-factors', name: 'finding the multiples and the factors of a two-digit number' },
  { id: 'solve-ratio-and-rate-problems', name: 'solving a problem that compares two amounts' },

  /* ── Term 2 ── */
  { id: 'divide-3-digit-by-2-digit', name: 'dividing a three-digit number by a two-digit number' },
  { id: 'divide-in-columns', name: 'dividing in columns' },
  { id: 'divide-with-a-remainder', name: 'dividing when something is left over' },
  { id: 'inverse-check-multiply-divide', name: 'checking a divide by multiplying it back' },

  { id: 'count-in-fractions', name: 'counting forwards and backwards in fractions' },
  { id: 'compare-order-to-twelfths', name: 'putting fractions in order, up to twelfths' },
  { id: 'add-subtract-fractions-same-denominator', name: 'adding and taking away fractions with the same bottom number' },
  { id: 'division-as-a-fraction', name: 'seeing that sharing four things between two is the same as a half of four' },
  { id: 'use-equivalent-forms', name: 'using two names for the same amount' },

  { id: 'extend-geometric-pattern', name: 'carrying on a pattern made of shapes' },
  { id: 'describe-a-rule-in-my-words', name: 'saying the rule of a pattern in your own words' },
  { id: 'flow-diagram-input-output', name: 'putting a number into a rule and finding what comes out' },

  { id: 'extend-numeric-pattern', name: 'carrying on a pattern made of numbers' },
  { id: 'find-the-input-from-the-output', name: 'working backwards through a rule' },
  { id: 'rule-in-a-table', name: 'writing a rule as a table' },
  { id: 'same-rule-said-four-ways', name: 'seeing that a rule said four ways is one rule' },

  { id: 'name-polygons-to-heptagon', name: 'naming shapes up to seven sides' },
  { id: 'regular-and-irregular', name: 'telling a regular shape from an irregular one' },
  { id: 'sort-by-sides', name: 'sorting shapes by how many sides they have' },
  { id: 'draw-shapes-on-grid-paper', name: 'drawing a shape on grid paper' },
  { id: 'draw-a-line-of-symmetry', name: 'drawing the line of symmetry on a shape' },

  /* ── Term 3 ── */
  { id: 'name-3d-objects', name: 'naming prisms, cubes, cylinders, cones and pyramids' },
  { id: 'cube-and-rectangular-prism', name: 'saying how a cube and a box are the same and different' },
  { id: 'count-faces-flat-and-curved', name: 'counting the faces of a solid and saying which are flat' },
  { id: 'trace-a-net', name: 'seeing the flat net a solid folds up from' },

  { id: 'order-data-smallest-to-largest', name: 'putting groups in order from smallest to biggest' },
  { id: 'pictograph-many-to-one', name: 'reading a picture graph where one picture stands for many' },
  { id: 'draw-a-bar-graph', name: 'drawing a bar graph' },
  { id: 'read-a-graph-critically', name: 'spotting when a graph is telling you the wrong thing' },
  { id: 'find-the-mode', name: 'finding the answer that happens most often' },

  { id: 'list-all-outcomes', name: 'writing down everything that could happen' },
  { id: 'run-twenty-trials', name: 'doing the same thing twenty times and keeping a tally' },
  { id: 'compare-actual-frequencies', name: 'comparing what really happened with what you thought would' },

  { id: 'estimate-then-measure-length', name: 'guessing a length first, then measuring it' },
  { id: 'read-a-ruler', name: 'reading a length off a ruler' },
  { id: 'convert-length-units', name: 'changing millimetres, centimetres, metres and kilometres' },

  { id: 'measure-perimeter', name: 'measuring all the way round a shape' },
  { id: 'find-area-by-counting-squares', name: 'finding how much space a shape covers by counting squares' },
  { id: 'volume-by-packing', name: 'finding how much a box holds by packing it' },
  { id: 'capacity-by-filling', name: 'finding how much something holds by filling it' },

  /* ── Term 4 ── */
  { id: 'read-analogue-and-digital-together', name: 'reading the same time on a clock face and a digital clock' },
  { id: 'read-24-hour-time', name: 'reading twenty-four hour time' },
  { id: 'time-in-seconds', name: 'reading and writing time in seconds' },
  { id: 'days-between-dates-across-a-year', name: 'counting the days between two dates in different years' },
  { id: 'time-intervals-in-many-units', name: 'working out how long something took in days, weeks, months or years' },

  { id: 'estimate-then-measure-capacity', name: 'guessing how much something holds, then measuring it' },
  { id: 'read-a-measuring-jug', name: 'reading the level on a measuring jug' },
  { id: 'convert-millilitres-and-litres', name: 'changing millilitres into litres and back' },

  { id: 'estimate-then-measure-mass', name: 'guessing how heavy something is, then weighing it' },
  { id: 'read-a-scale', name: 'reading the needle on a scale' },
  { id: 'order-masses-g-and-kg', name: 'putting weights in order in grams and kilograms' },

  { id: 'rotate-translate-reflect', name: 'turning a shape, sliding it and flipping it' },
  { id: 'make-a-composite-shape', name: 'making a bigger shape out of smaller ones' },
  { id: 'make-a-tessellation', name: 'making a pattern that fits together with no gaps' },
  { id: 'describe-a-pattern-with-maths-words', name: 'describing a pattern using shape and symmetry words' },
];

/**
 * **The ladder — one rung per topic, in schedule order** (PRD §8.2).
 *
 * A Star Challenge teaches nothing and requires nothing: it is a celebration
 * drawn from the term behind it, and a topic that required something would be
 * claiming to be a lesson.
 */
export const LADDER: LadderEntry[] = [
  /* ══ Term 1 ══ */
  {
    topicId: 't1-big-numbers',
    requires: [
      'count-order-represent-4-digit',
      'place-value-4-digit',
      'round-to-nearest-100',
      'build-up-break-down-4-digit',
    ],
    teaches: [
      'count-order-6-digit',
      'place-value-6-digit',
      'round-to-nearest-5',
      'build-up-break-down-6-digit',
    ],
  },
  {
    topicId: 't1-number-sentences',
    requires: [
      'use-operation-symbols',
      'add-subtract-4-digit',
      'multiply-by-2-3-4-5-10',
      'divide-by-2-3-4-5-10',
      'one-as-multiplicative-identity',
    ],
    teaches: [
      'write-a-number-sentence',
      'solve-a-number-sentence',
      'properties-of-operations',
    ],
  },
  {
    // PRD §18.9, worked end to end. Eighteen hours, six lessons, and the
    // place a child who is behind gets stuck.
    topicId: 't1-adding-and-taking-away',
    requires: [
      'add-subtract-4-digit',                    // ARRIVES_WITH — the ATP's own row
      'round-to-nearest-1000',                   // ARRIVES_WITH
      'add-subtract-multiples-of-10-100-1000',   // ARRIVES_WITH
      'place-value-6-digit',                     // taught in t1-big-numbers, weeks 1–2
    ],
    teaches: [
      'add-subtract-5-digit',
      'estimate-a-sum',
      'build-up-and-break-down',
      'add-subtract-in-columns',
      'carry-across-a-zero',
      'inverse-check',
    ],
  },
  {
    topicId: 't1-times',
    requires: [
      'multiply-2-digit-by-2-digit',
      'double-and-halve',
      'multiply-by-multiples-of-10-100-1000',
      'multiples-of-1-digit-to-100',
      'build-up-and-break-down',
      'estimate-a-sum',
    ],
    teaches: [
      'multiply-3-digit-by-2-digit',
      'estimate-a-product',
      'multiply-in-columns',
      'multiples-and-factors',
      'solve-ratio-and-rate-problems',
    ],
  },
  { topicId: 't1-star-challenge', requires: [], teaches: [] },

  /* ══ Term 2 ══ */
  {
    topicId: 't2-sharing-out',
    requires: [
      'divide-3-digit-by-1-digit',
      'multiply-3-digit-by-2-digit',
      'multiply-in-columns',
      'multiples-and-factors',
    ],
    teaches: [
      'divide-3-digit-by-2-digit',
      'divide-in-columns',
      'divide-with-a-remainder',
      'inverse-check-multiply-divide',
    ],
  },
  {
    topicId: 't2-parts-of-a-whole',
    requires: [
      'compare-order-simple-fractions',
      'equivalent-fractions-in-diagrams',
      'add-fractions-in-context',
      'divide-3-digit-by-2-digit',
    ],
    teaches: [
      'count-in-fractions',
      'compare-order-to-twelfths',
      'add-subtract-fractions-same-denominator',
      'division-as-a-fraction',
      'use-equivalent-forms',
    ],
  },
  {
    topicId: 't2-shapes-that-grow',
    requires: [
      'extend-a-pattern',
      'describe-a-pattern-in-own-words',
      'multiples-and-factors',
    ],
    teaches: [
      'extend-geometric-pattern',
      'describe-a-rule-in-my-words',
      'flow-diagram-input-output',
    ],
  },
  {
    topicId: 't2-numbers-that-grow',
    requires: [
      'extend-geometric-pattern',
      'describe-a-rule-in-my-words',
      'flow-diagram-input-output',
      'write-a-number-sentence',
    ],
    teaches: [
      'extend-numeric-pattern',
      'find-the-input-from-the-output',
      'rule-in-a-table',
      'same-rule-said-four-ways',
    ],
  },
  {
    topicId: 't2-flat-shapes',
    requires: [
      'name-basic-2d-shapes',
      'sort-2d-shapes-by-sides',
      'recognise-line-symmetry',
    ],
    teaches: [
      'name-polygons-to-heptagon',
      'regular-and-irregular',
      'sort-by-sides',
      'draw-shapes-on-grid-paper',
      'draw-a-line-of-symmetry',
    ],
  },
  { topicId: 't2-star-challenge', requires: [], teaches: [] },

  /* ══ Term 3 ══ */
  {
    topicId: 't3-solid-shapes',
    requires: [
      'name-basic-3d-objects',
      'sort-3d-objects-by-faces',
      'make-3d-model-from-polygons',
      'name-polygons-to-heptagon',
    ],
    teaches: [
      'name-3d-objects',
      'cube-and-rectangular-prism',
      'count-faces-flat-and-curved',
      'trace-a-net',
    ],
  },
  {
    topicId: 't3-asking-and-counting',
    requires: [
      'collect-data-with-tallies',
      'draw-pictograph-one-to-one',
      'read-bar-graph-and-pie-chart',
      'answer-questions-about-data',
      'summarise-data-in-writing',
    ],
    teaches: [
      'order-data-smallest-to-largest',
      'pictograph-many-to-one',
      'draw-a-bar-graph',
      'read-a-graph-critically',
      'find-the-mode',
    ],
  },
  {
    topicId: 't3-what-might-happen',
    requires: [
      'list-outcomes-of-an-event',
      'collect-data-with-tallies',
      'find-the-mode',
    ],
    teaches: [
      'list-all-outcomes',
      'run-twenty-trials',
      'compare-actual-frequencies',
    ],
  },
  {
    topicId: 't3-how-long',
    requires: [
      'measure-with-instruments',
      'record-compare-order-lengths',
      'convert-between-consecutive-units',
      'estimate-a-sum',
    ],
    teaches: [
      'estimate-then-measure-length',
      'read-a-ruler',
      'convert-length-units',
    ],
  },
  {
    // **Appendix A finding 2 and the ladder's second departure.** The ATP
    // prints this topic's own two skills in its prerequisite row as well as in
    // its content row. A skill cannot be its own prerequisite, so both are
    // taught here. See `ARRIVES_WITH`'s header.
    topicId: 't3-round-it-and-fill-it',
    requires: [
      'read-a-ruler',
      'convert-length-units',
      'multiply-3-digit-by-2-digit',
    ],
    teaches: [
      'measure-perimeter',
      'find-area-by-counting-squares',
      'volume-by-packing',
      'capacity-by-filling',
    ],
  },
  { topicId: 't3-star-challenge', requires: [], teaches: [] },

  /* ══ Term 4 ══ */
  {
    topicId: 't4-telling-the-time',
    requires: [
      'tell-time-12-and-24-hour',
      'read-a-calendar',
      'days-between-two-dates',
      'time-intervals-in-minutes-or-hours',
      'add-subtract-5-digit',
    ],
    teaches: [
      'read-analogue-and-digital-together',
      'read-24-hour-time',
      'time-in-seconds',
      'days-between-dates-across-a-year',
      'time-intervals-in-many-units',
    ],
  },
  {
    topicId: 't4-how-much-it-holds',
    requires: [
      'measure-length-with-informal-units',
      'estimate-then-measure-length',
      'convert-length-units',
      'capacity-by-filling',
    ],
    teaches: [
      'estimate-then-measure-capacity',
      'read-a-measuring-jug',
      'convert-millilitres-and-litres',
    ],
  },
  {
    topicId: 't4-how-heavy',
    requires: [
      'measure-mass-with-scales',
      'convert-grams-and-kilograms',
      'estimate-then-measure-capacity',
    ],
    teaches: [
      'estimate-then-measure-mass',
      'read-a-scale',
      'order-masses-g-and-kg',
    ],
  },
  {
    topicId: 't4-slide-turn-flip',
    requires: [
      'make-composite-2d-shapes',
      'make-tessellated-patterns',
      'describe-patterns-in-culture',
      'draw-a-line-of-symmetry',
      'name-polygons-to-heptagon',
    ],
    teaches: [
      'rotate-translate-reflect',
      'make-a-composite-shape',
      'make-a-tessellation',
      'describe-a-pattern-with-maths-words',
    ],
  },
  { topicId: 't4-star-challenge', requires: [], teaches: [] },
];

/** Every skill id the app knows about, taught or arrived with. */
export const ALL_SKILL_IDS: Set<string> = new Set([
  ...ARRIVES_WITH.map((skill) => skill.id),
  ...SKILLS.map((skill) => skill.id),
]);

/** A skill by id, from either list. */
export function skillById(id: string): Skill | null {
  return (
    ARRIVES_WITH.find((skill) => skill.id === id) ??
    SKILLS.find((skill) => skill.id === id) ??
    null
  );
}

/** The rung for a topic, or null if it has none. */
export function ladderFor(topicId: string): LadderEntry | null {
  return LADDER.find((entry) => entry.topicId === topicId) ?? null;
}
