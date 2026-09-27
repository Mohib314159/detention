# Put Detention on Render

This deploys the character experiment. It does not merge it into main or change the blue branch.

1. Sign in at https://dashboard.render.com and select **New → Blueprint**.
2. Connect GitHub and allow Render to access **Mohib314159/detention**. If the repository is private, select it explicitly in GitHub's access screen.
3. Select the repository and branch **codex/overseer-character**. Leave the Blueprint path as **render.yaml**.
4. Review the static site named **detention-overseer**, then create the Blueprint. No database, API keys or environment variables are needed.
5. Wait until the deployment is **Live**. Open the HTTPS address Render gives you. It should show Morrow/Riot and the ivory observation booth.

Alternative: **New → Static Site**, same repository and branch, build command `node scripts/prepare-static.mjs`, publish directory `dist`. Do not choose Web Service. The Blueprint additionally configures response headers.

## Install on your iPhone

Open your Render HTTPS address in **Safari**. Tap **Share → Add to Home Screen**, keep **Open as Web App** enabled if shown, then tap **Add**. Launch from the new icon. No Mac or Apple Developer membership is needed for this web app.

The localhost link from your PC will not open this app on your phone. Use the Render address. Camera permission is requested only when you choose camera mode and enable it. Keep the app open while focusing; switching away pauses class. A PWA cannot enforce native iOS app blocking.

## Offline use

In Detention choose **Get the app → Save offline**. The optional pack is approximately 77 MB; the exact size appears before download. Wait for confirmation, then close every Detention tab/window and reopen the installed app once while online. After that, try it in airplane mode. The pack includes character models and local camera tools; external Google fonts can fall back to system fonts offline. Your device can evict browser storage, so offline availability is not permanent.

Browser and Home Screen storage can differ, and devices do not sync progress. This experiment has separate progress from the blue version.

## Later updates

With Render auto-deploy enabled, pushes to **codex/overseer-character** deploy this experiment. Other branches remain separate. A new offline worker waits until old app windows close; it never deliberately reloads a running class. When changing shipped assets, bump the cache version in `dist/sw.js` and `dist/install.js`, then regenerate the pack. Run `node scripts/prepare-static.mjs` before committing.

## Check after deployment

- Verify the app opens over HTTPS and both new characters load.
- Try the 25-second demo and the sound toggle; sound starts only after interaction.
- Add to Home Screen on a real iPhone and verify the notch, bottom controls and camera permission flow.
- Save offline, reopen once, then try offline reload.

The branch has local browser and automated checks; a real iPhone installation and Render deployment still need verification on your account/device.

Sources: https://render.com/docs/blueprint-spec and https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios
