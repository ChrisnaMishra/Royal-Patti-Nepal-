# Royal Patti Nepal 🃏

Royal Patti Nepal is a planned online Teen Patti card game project.

## Development roadmap

- [ ] Build a responsive game lobby and table UI
- [ ] Implement and test Teen Patti rules for a local demo
- [ ] Add player names, seat positions, and turn indicators
- [ ] Add secure real-time multiplayer rooms
- [ ] Add account security, reconnect handling, and server-side validation
- [ ] Test on mobile and desktop

## Development principles

- Start with play-money / no-cash gameplay.
- Keep authoritative game state and card dealing on the server for multiplayer.
- Never store passwords or secret keys in client-side code or Git.
- Clearly explain privacy rules and game rules to players.

## First milestone

Create a polished playable demo before connecting online multiplayer. Real multiplayer requires a backend service; GitHub Pages alone can host the front end but cannot manage real-time game rooms by itself.

## Automated regression tests

The card-ranking tests use Node.js's built-in test runner and do not require installing packages.

```bash
node --test tests/*.test.cjs
```

The tests cover hand-category order, the A-3-2 low sequence, kicker tie-breaks, equal hands, hand labels, and invalid input handling. These tests validate the card-ranking functions; they do not replace real browser/mobile testing of the full interface.

## Manual mobile/browser smoke test

Before release, test the deployed page on an Android phone and a desktop browser:

1. Open the page and confirm the login screen fits without horizontal scrolling.
2. Enter a guest name and start a practice round.
3. Confirm three player cards and three computer hands appear.
4. Tap **See hand**, then **Reveal & compare**; confirm the round completes only once.
5. Start another round and confirm the round number increments and the actions become available again.
6. Open Stats, Challenges, Friends, and Settings; close each dialog.
7. Rotate the phone and check that cards, buttons, and navigation remain usable.
8. Inspect the browser console for JavaScript errors and verify the manifest/icon load.
9. Confirm the page clearly communicates that this is a practice-only demo, with no cash wagers or cash-outs.

This checklist is manual; do not mark these checks as passed until they have been run on the actual deployed page.
