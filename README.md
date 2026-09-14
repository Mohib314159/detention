# Detention

Local browser prototype. Serve `dist` over HTTPS (or localhost). No build step.

## iPhone test
Open the deployed private Site in Safari using the owner account. Share > Add to Home Screen > Open as Web App. Camera access requires HTTPS. Select webcam, enable camera, capture screen-facing gaze, then working gaze. Physical-device calibration still needs testing with the owner. An iPhone 15 Pro Max is suitable for this browser prototype; the iPad Air 4 can also run it.

No Apple membership is needed for the website. It cannot block other apps or prevent closing. Leaving pauses class. A native version requires separate implementation and Apple entitlements; it has not been built here.

## Native path without owning a Mac
Cloud macOS builds can produce signed iOS builds from a Windows workflow. Expo EAS is one option, but ARKit and Screen Time require custom native modules/extensions and a development build, not ordinary Expo Go. Paid Apple membership is needed for distributing physical-device builds through TestFlight; membership and cloud charges are not authorized or purchased. App Store release also needs privacy disclosures, screenshots, signing, review and Screen Time distribution entitlement approval.

https://docs.expo.dev/develop/development-builds/introduction/
https://developer.apple.com/programs/enroll/
https://developer.apple.com/documentation/familycontrols/requesting-the-family-controls-entitlement
https://support.apple.com/en-mide/guide/iphone/iphea86e5236/ios

## Behavior
A short glance is forgiven; sustained looking increases suspicion. Missing/uncertain camera detections lower suspicion. Mouse mode detects interaction only inside this page. Progress is local browser storage; demo does not earn rewards. Sound defaults off. Reduced motion and cracks are configurable. Avatars: classic Slate, Knox, Unit Zero. Original version retained under versions/classic-professor.

## Validation
`node tests/engine.mjs` checks grace, escalation, recovery and rewards. Browser QA is necessary for rendering and permissions. No physical iPhone gaze accuracy or native app blocking claim is made.

## Human animation edition
Coach Vale uses Quaternius's CC0 skinned human model and authored clips, with rest-pose retargeting, finger tracks, crossfades and jab/cross/hook recovery. The primitive characters remain available in settings; the complete earlier edition is also in `versions/rigid-classroom-v1` with a verified SHA-256 manifest. Rig binding and focus tests pass; visual validation of this edition was blocked by unavailable browser controls at the time of implementation. This is not a claim of AAA animation quality.
