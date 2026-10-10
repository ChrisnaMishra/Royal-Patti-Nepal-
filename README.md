# Royal Patti Nepal — Practice Demo 🃏

Royal Patti Nepal is a single-player card-practice demo. It uses practice points for learning and testing only. It does not support cash wagers, deposits, withdrawals, or cash-outs.

## Current features

- Guest access for local practice
- Deal, view, reveal, and compare hands
- Start a new practice round
- Practice-point display and informational panels
- Responsive page layout and installable-web-app metadata
- A service worker for app-shell caching and repeat visits

## Development principles

- Keep this project practice-only: no real-money features or cash-out flows.
- Do not store passwords, API keys, or other secrets in client-side code or Git.
- Keep privacy and practice-only messaging clear.
- Treat browser and mobile testing as a separate requirement from automated tests.

## Automated regression tests

The tests use Node.js's built-in test runner and do not require installing packages.

```bash
node --test tests/*.test.cjs
```

The test suite checks card-ranking logic, gameplay flow, and basic UI/PWA source requirements. Passing automated tests does not prove the app works correctly on every browser or phone.

## Manual browser/mobile smoke test

Run these checks on the deployed HTTPS page before considering the app ready:

1. Confirm the page fits on a narrow phone screen without horizontal scrolling.
2. Enter a guest name and start a practice round.
3. Confirm the cards and computer hands render correctly.
4. Tap **See hand**, then **Reveal & compare**; verify the round resolves only once.
5. Start another round and verify controls reset correctly.
6. Open and close Stats, Challenges, Friends, and Settings.
7. Rotate the phone and check that cards, buttons, and navigation remain usable.
8. Check the browser console for JavaScript errors and verify the manifest, icon, and service worker load.
9. Reload while online, then test a repeat visit with the network disabled.
10. Test the add-to-home-screen/install flow on supported browsers.
11. Confirm practice-only/no-cash messaging is clear.

Do not mark these checks as passed until they have actually been performed on the deployed app and target devices.

## Release checklist

- [ ] Run `node --test tests/*.test.cjs` and confirm all tests pass.
- [ ] Confirm the latest `main` commit has deployed to GitHub Pages.
- [ ] Complete the manual browser/mobile smoke test above.
- [ ] Verify service-worker registration and offline behavior.
- [ ] Verify the install/add-to-home-screen flow on supported browsers.
- [ ] Check keyboard/touch usability, dialogs, and console errors.
- [ ] Keep practice-only/no-cash wording visible and accurate.

## Limitations

This is a single-player practice demo. It does not have a real account system, online multiplayer backend, or real-money wagering/cash-out. GitHub Pages hosts the front end; it does not provide a server for real-time game rooms. A successful deployment workflow is not a substitute for hands-on browser, phone, install, and offline testing.
