# Detention: source-grounded product brief

Source: ChatGPT conversation 6a968216-0d30-83eb-9406-3021f4480e9d, “Study methods like Pomodoro”. All 22 turns / 44 user and assistant messages were retrieved and read in chronological, untruncated sections on 14 September 2026. The original conversation contains 121,776 text characters. Earlier tool displays had been truncated; the initial dashboard failed to capture the product.

## What the user settled on

- Message 29 selects the avatar over earlier concepts: instructor works while you work; notices staring; looks up, down, then up again; countdown; shaking; approaching; banging desk/device; angry gestures; rage and buzzing. Customizable avatar and personality.
- Message 31 narrows the monitored offence: being on this device. Reading, writing, thinking, or leaving the desk is irrelevant. One-second glance grace, suspicion on the right, rage around five seconds rather than nine. Class progression starting at 0, success promotes, failure demotes. Many animation variants. Learns typical warning times over repeated sessions.
- Message 33 adds earned revenge: water, cake, tapping interactions, an initial trial, one reward per class, five-class challenge and extra rewards. No Mac available.
- Message 35 demands huge silent disappointed frown on leaving; failure makes the instructor more suspicious in subsequent classes.
- Message 37 requires camera positioning checked before starting, phone upright in front/side; fake screen crack caused by punch at maximum rage, no violent flashing. In-app quitting/reset joke possible; cannot intercept operating-system uninstall UI.
- Current task: PC/web acceptable; instructor feels trapped inside the device and lashes out through its glass. Not a floating picture, dashboard, landing page, or generic cozy companion. Webcam OR mouse movement mode accepted. On web, react to leaving and pause class. Native blocking remains separate.

## Interaction contract

1. Setup duration, personality, input method. Camera mode must pass position and gaze calibration; fail explicitly when unreliable.
2. Actual study: no feed, minimal controls. Avatar animates at a desk with planted physical contact and arm motion.
3. Brief glances forgiven. At ~1 second: eye movement then visible meter. Continued input: stop writing, head raise, frown, stand, advance. Around five seconds: invade foreground, strike the glass, rage, optional sound/vibration, non-strobing red edge and crack.
4. Looking away / stopping interaction lowers suspicion quickly; instructor stays suspicious briefly then returns to work. Tracking uncertainty never means guilty. Detects visible behaviour, not concentration.
5. Leaving website pauses and records departure. Returning shows disappointed close-up and resume. No fake app blocking or notification spam.
6. Complete class: earned revenge credit, progress, optional break. Failure: rank/temper consequence with bounded recovery. Demo does not earn rank or unlimited rewards.
7. Camera frames, facial features and calibration remain in volatile local memory. Session events/preferences may persist locally. No invented global players/rankings.

## Earlier brainstorming, not current build requirements

Messages 1–10: choosing timer apps. 11–16: civilizations, pets, reels, reward feeds, competition. 17–24: virtual library, multiplayer, local/campus presence and additional ideas. 25–28: study reels and competitor landscape. These precede the explicit avatar selection and must not crowd out the instructor mechanic. Messages 39–44: friend-message wording and WhatsApp edits.

## Platform route

Web: browser camera via getUserMedia plus MediaPipe face/iris landmarks and calibration, or local pointer activity; visibility change pauses. Cannot read system-wide mouse activity or invoke Apple Screen Time blocking. Real camera efficacy needs physical-device testing.

Native iOS: SwiftUI presentation, ARKit supported-device checks plus ARFaceAnchor eye transforms/lookAtPoint, on-device state machine, FamilyControls/ManagedSettings and shield extensions, optional CoreHaptics. Xcode/macOS build, Apple Developer membership for distribution, TestFlight then App Review, Family Controls distribution entitlement. None of the native build/signing/device testing/Apple approvals has been done.

## Evidence consulted

- https://developer.apple.com/documentation/arkit/arfaceanchor/lookatpoint
- https://developer.apple.com/documentation/familycontrols/requesting-the-family-controls-entitlement
- https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases
- https://developer.apple.com/programs/enroll/
- https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js
- https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- https://store.steampowered.com/app/3213850/gogh_Focus_with_Your_Avatar/
- https://www.yourfocusfriend.com/
- https://threejs.org/manual/en/animation-system.html
