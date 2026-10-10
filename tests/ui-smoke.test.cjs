const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));

test('mobile viewport and responsive breakpoints are present', () => {
  assert.match(html, /name="viewport"[^>]*width=device-width/i);
  assert.ok((html.match(/@media/g) || []).length >= 2, 'expected responsive CSS breakpoints');
});

test('primary gameplay controls have stable IDs and button types', () => {
  for (const id of ['guestBtn', 'startBtn', 'seeBtn', 'playBtn', 'newHandBtn', 'homeBtn']) {
    assert.match(html, new RegExp('<button\\b(?=[^>]*\\bid="' + id + '")[^>]*>', 'i'), id + ' button should exist');
  }
  assert.match(html, /id="playBtn"[^>]*type="button"/i);
  assert.match(html, /id="newHandBtn"[^>]*type="button"/i);
});

test('practice-only notice is present and no betting controls are wired in the UI', () => {
  assert.match(html, /practice only|practice points|practice table/i);
  assert.doesNotMatch(html, /id="(?:betBtn|raiseBtn|cashoutBtn|withdrawBtn)"/i);
});

test('PWA manifest has standalone display and relative paths', () => {
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.start_url.startsWith('./'));
  assert.ok(manifest.scope.startsWith('./'));
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);
});

test('page has no remote script dependency and includes accessible dialog labels', () => {
  assert.doesNotMatch(html, /<script[^>]+src=["']https?:/i);
  assert.match(html, /<dialog[^>]*id="infoDialog"/i);
  assert.match(html, /id="closeDialogBtn"/i);
  assert.match(html, /aria-label="Open my stats"/i);
});
