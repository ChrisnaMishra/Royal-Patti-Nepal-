const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('function score(cards)');
const end = html.indexOf('function fmt(n)', start);
assert.notEqual(start, -1, 'score() must exist in index.html');
assert.notEqual(end, -1, 'score() must be followed by fmt()');

const context = {};
vm.runInNewContext("const suits = ['♠','♥','♦','♣'];\n" + html.slice(start, end) + '\nthis.score = score; this.compare = compare; this.handName = handName;', context);
const { score, compare, handName } = context;

const hand = (cards) => cards.map(([v, s]) => ({ v, s }));
const trail = hand([[9, '♠'], [9, '♥'], [9, '♦']]);
const pureSequence = hand([[7, '♣'], [6, '♣'], [5, '♣']]);
const sequence = hand([[7, '♣'], [6, '♥'], [5, '♠']]);
const color = hand([[14, '♦'], [10, '♦'], [4, '♦']]);
const pairKings = hand([[13, '♣'], [13, '♥'], [8, '♦']]);
const pairKingsLowerKicker = hand([[13, '♠'], [13, '♦'], [6, '♣']]);
const highAce = hand([[14, '♠'], [11, '♥'], [4, '♣']]);
const wheel = hand([[14, '♣'], [3, '♣'], [2, '♣']]);
const wheelMixed = hand([[14, '♣'], [3, '♥'], [2, '♦']]);

test('hand categories follow the expected Teen Patti practice order', () => {
  assert.equal(score(trail)[0], 6);
  assert.equal(score(pureSequence)[0], 5);
  assert.equal(score(sequence)[0], 4);
  assert.equal(score(color)[0], 3);
  assert.equal(score(pairKings)[0], 2);
  assert.equal(score(highAce)[0], 1);
  assert.ok(compare(trail, pureSequence) > 0);
  assert.ok(compare(pureSequence, sequence) > 0);
  assert.ok(compare(sequence, color) > 0);
  assert.ok(compare(color, pairKings) > 0);
  assert.ok(compare(pairKings, highAce) > 0);
});

test('A-2-3 is a special sequence above K-Q-J and below A-K-Q', () => {
  const aceKingQueen = hand([[14, '♠'], [13, '♥'], [12, '♦']]);
  const kingQueenJack = hand([[13, '♠'], [12, '♥'], [11, '♦']]);
  assert.equal(score(wheel)[0], 5);
  assert.equal(score(wheelMixed)[0], 4);
  assert.ok(compare(aceKingQueen, wheelMixed) > 0);
  assert.ok(compare(wheelMixed, kingQueenJack) > 0);
  assert.ok(compare(wheel, pureSequence) > 0);
});

test('same-rank pairs use the kicker to break ties', () => {
  assert.ok(compare(pairKings, pairKingsLowerKicker) > 0);
});

test('identical hand values tie even when suits differ', () => {
  const otherPairKings = hand([[13, '♦'], [13, '♠'], [8, '♣']]);
  assert.equal(compare(pairKings, otherPairKings), 0);
});

test('hand names match the score category labels', () => {
  assert.equal(handName(trail), 'Three of a kind');
  assert.equal(handName(pureSequence), 'Pure sequence');
  assert.equal(handName(sequence), 'Sequence');
  assert.equal(handName(color), 'Color');
  assert.equal(handName(pairKings), 'Pair');
  assert.equal(handName(highAce), 'High card');
});

test('invalid hands return a safe low score instead of throwing', () => {
  assert.deepEqual(Array.from(score([])), [0]);
  assert.deepEqual(Array.from(score(null)), [0]);
  assert.deepEqual(Array.from(score([{ v: 14, s: '♠' }])), [0]);
});

test('a pair is compared by pair rank then the single kicker', () => {
  const pairQueensHighKicker = hand([[12, '♠'], [12, '♥'], [14, '♦']]);
  const pairJacksAceKicker = hand([[11, '♠'], [11, '♥'], [14, '♦']]);
  const pairQueensLowKicker = hand([[12, '♣'], [12, '♦'], [2, '♠']]);
  assert.ok(compare(pairQueensHighKicker, pairJacksAceKicker) > 0);
  assert.ok(compare(pairQueensHighKicker, pairQueensLowKicker) > 0);
});

test('duplicate physical cards and invalid suits are rejected', () => {
  assert.deepEqual(Array.from(score(hand([[14, '♠'], [14, '♠'], [2, '♥']]))), [0]);
  assert.deepEqual(Array.from(score(hand([[14, 'X'], [13, '♥'], [2, '♦']]))), [0]);
});

test('A-K-Q sequence beats K-Q-J, and sequence ranks beat colour', () => {
  const akq = hand([[14, '♠'], [13, '♥'], [12, '♦']]);
  const kqj = hand([[13, '♠'], [12, '♥'], [11, '♦']]);
  assert.ok(compare(akq, kqj) > 0);
  assert.ok(compare(kqj, color) > 0);
});
