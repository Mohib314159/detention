# Focus interface revision 22

## Evidence and direction

- Re-read the Otherwise MASTER UI discussion, including the interaction refinements, contextual controls and mobile-specific workflow. Read the attached baseline mobile CSS. The final V6 downloadable source was not available through the thread reader; no claim of having inspected that code.
- Visited Opal's website and inspected its rendered hierarchy. Read Forest's official product page, but browser rendering failed, so it was not visually inspected.
- Material dark-theme guidance: https://design.google/library/material-design-dark-theme
- W3C contrast guidance: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum

The resulting decision is to expose the focus activity directly: character stage, compact cast selector, duration and one primary action. Secondary progress/revenge/install/help controls move out of the crowded header. The scene remains separate from the setup controls on desktop and stacks above thumb-reachable controls on phones. No purple theme is offered. Low-light is the default, with daylight retained as a user choice.

## Iterations performed

1. Replaced the previous stack of electric/overseer CSS overrides with a new focus-ui stylesheet. Rebuilt header, stage, session panel and secondary navigation. Compared phone and desktop screenshots.
2. The dark-room screenshot showed the character was too dim. Increased character lighting while keeping wall materials dark. Fixed heading word spacing and enlarged phone tap targets. Verified 50-minute selection updates the main duration display.
3. Phone screenshot showed a duplicate label crowding the character quote. Removed it on phones. Setup inspection showed too much explanatory copy before the primary action, so shortened the descriptions and kept the start control reachable. Ran the full 25-second demo and inspected the live controls.

Checks: existing engine/preferences/character tests; offline-pack and service-worker fallback tests; main and scene syntax. Text colour-pair contrast calculations: primary 13.85:1, secondary on background 8.16:1, secondary on panel 7.25:1, primary-action text 10.61:1. These are token checks, not a complete accessibility certification.

Real-device Safari installation and Render deployment still need checking. The experimental rig remains stylised rather than photoreal. This revision changes presentation and room lighting, not gaze/scoring/departure rules.
