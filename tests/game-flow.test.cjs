const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const inlineScript = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
assert.ok(inlineScript.includes('function newHand()'), 'game script should include newHand()');

class FakeElement {
  constructor(id = '') {
    this.id = id;
    this.textContent = '';
    this.value = '';
    this.className = '';
    this.disabled = false;
    this.children = [];
    this._innerHTML = '';
    this.handlers = {};
    this.classList = { toggle: () => {} };
  }
  set innerHTML(value) { this._innerHTML = value; this.children = []; }
  get innerHTML() { return this._innerHTML; }
  appendChild(child) { this.children.push(child); return child; }
  addEventListener(name, fn) { this.handlers[name] = fn; }
  showModal() { this.open = true; }
  close() { this.open = false; }
}

function bootGame() {
  const elements = new Map();
  const getElementById = id => {
    if (!elements.has(id)) elements.set(id, new FakeElement(id));
    return elements.get(id);
  };
  const document = {
    getElementById,
    createElement: tag => new FakeElement(tag)
  };
  const context = {
    document,
    Math,
    Number,
    Array,
    String,
    alert: () => {},
    console
  };
  vm.createContext(context);
  vm.runInContext(inlineScript + '\nthis.__state = () => ({chips, played, wins, round, finished, myCards, botHands});', context);
  return { context, get: getElementById, state: () => context.__state() };
}

test('guest can start a round with three cards and three computer hands', () => {
  const game = bootGame();
  game.get('playerName').value = 'Test Player';
  game.get('guestBtn').onclick();
  assert.equal(game.get('welcomeTitle').textContent, 'Welcome, Test Player');
  game.get('startBtn').onclick();
  const state = game.state();
  assert.equal(state.round, 1);
  assert.equal(state.myCards.length, 3);
  assert.equal(state.botHands.length, 3);
  assert.ok(state.botHands.every(hand => hand.length === 3));
  assert.equal(game.get('roundBadge').textContent, 'PRACTICE ROUND 1');
  assert.equal(game.get('playBtn').disabled, false);
});

test('reveal completes a round only once and disables repeat actions', () => {
  const game = bootGame();
  game.get('guestBtn').onclick();
  game.get('startBtn').onclick();
  const initial = game.state();
  game.get('playBtn').onclick();
  const afterFirstReveal = game.state();
  const pointsAfterFirstReveal = afterFirstReveal.chips;
  assert.equal(afterFirstReveal.played, 1);
  assert.equal(afterFirstReveal.finished, true);
  assert.equal(game.get('playBtn').disabled, true);
  assert.equal(game.get('seeBtn').disabled, true);
  game.get('playBtn').onclick();
  assert.equal(game.state().played, 1);
  assert.equal(game.state().chips, pointsAfterFirstReveal);
  assert.ok(game.get('message').textContent.includes('Round') || game.get('message').textContent.includes('hand') || game.get('message').textContent.includes('player') || game.get('message').textContent.includes('tied') || game.get('message').textContent.includes('beat'));
  assert.equal(initial.chips, 1000);
});

test('starting another round resets finished state and deals fresh hands', () => {
  const game = bootGame();
  game.get('guestBtn').onclick();
  game.get('startBtn').onclick();
  game.get('playBtn').onclick();
  game.get('newHandBtn').onclick();
  const state = game.state();
  assert.equal(state.round, 2);
  assert.equal(state.finished, false);
  assert.equal(state.myCards.length, 3);
  assert.equal(state.botHands.length, 3);
  assert.equal(game.get('playBtn').disabled, false);
  assert.equal(game.get('roundBadge').textContent, 'PRACTICE ROUND 2');
});

test('see hand reveals the hand label without completing the round', () => {
  const game = bootGame();
  game.get('guestBtn').onclick();
  game.get('startBtn').onclick();
  game.get('seeBtn').onclick();
  const state = game.state();
  assert.equal(state.finished, false);
  assert.equal(state.played, 0);
  assert.match(game.get('handLabel').textContent, /YOUR HAND/);
  assert.equal(game.get('seeBtn').disabled, true);
  assert.equal(game.get('playBtn').disabled, false);
});

test('practice bonus is reflected in both displayed balances', () => {
  const game = bootGame();
  assert.equal(game.state().chips, 1000);
  game.get('bonusBtn').onclick();
  assert.equal(game.state().chips, 1100);
  assert.equal(game.get('chipCount').textContent, '1,100');
  assert.equal(game.get('lobbyChips').textContent, '1,100');
  assert.equal(game.get('bonusBtn').disabled, true);
});
