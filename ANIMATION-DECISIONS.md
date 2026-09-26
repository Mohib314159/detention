# Animation replacement - 14 September 2026

The previous character was rigid geometry, not a skinned human. It has been preserved in versions/rigid-classroom-v1 and Git commit 97dff294cf8a5958925b65a4e98700476a3f2580. No original asset archive has been deleted.

Sources reviewed:
1. Adobe Mixamo FAQ: free with Adobe ID, royalty-free game use. https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html
2. Quaternius Universal Base Characters: humanoid rig, animation topology, CC0. https://quaternius.com/packs/universalbasecharacters.html
3. Quaternius Universal Animation Library: locomotion, seated states, jab/cross, CC0. https://quaternius.com/packs/universalanimationlibrary.html
4. Quaternius Universal Animation Library 2: hook/recovery and combat combinations, CC0. Free Standard subset inspected directly; paid clips were not acquired. https://quaternius.com/packs/universalanimationlibrary2.html
5. Three.js animation system: mixer/actions, crossfading, skinned models. https://threejs.org/manual/en/animation-system.html
6. Blender inverse kinematics: controlling endpoint contact through joint chains. https://docs.blender.org/manual/en/4.0/animation/constraints/tracking/ik_solver.html

Implemented: real textured human with finger bones; 15 selected authored clips; rest-pose correction; frame-rate-independent playback; crossfades; jab/cross/hook and hook recovery; impact timing sampled from fist extension. The original avatars remain selectable. The new instructor waits standing with folded arms, approaches on prolonged gaze, and retreats when gaze stops. Fitted uniform colors are assigned in bind pose and deform with the mesh.

Not implemented or verified: contact IK against an actual plane, facial performance capture, bespoke teacher acting, AAA rendering quality, physical iPhone gaze accuracy. UI browser unavailable during this replacement, so no claim that the visual quality is approved. Tests verify finite rig binding and animated finger/hand motion, not visual quality. The generated uniform uses vertex colors rather than a bespoke garment mesh.


## Visual and behavior pass - 15 September
The local mobile preview was inspected after reconnecting browser controls. Fixed mixed Windows/UTF-8 source encodings and cache-stale module loads, neutralized lighting, removed the incorrect board name, held the human camera steady, enlarged resting framing, added approach/retreat hysteresis, and retired faded actions. The demo now has a real stare/look-away override. Human revenge effects follow the actual head. Runtime tests now execute the director through prolonged rage, retreat and reduced-motion sequences, verifying repeated impacts and a single active idle action after settling. Physical iPhone camera testing and bespoke facial animation remain pending.


## Build 14 — character and arena separation
- Preserved build 13 in versions/before-environments before changes.
- Added Rhea from the existing Quaternius Universal Base Characters CC0 archive, with buns hairstyle and retargeted existing motion clips.
- Characters, training outfit palette, and arena persist independently. Existing currencies and profile key remain intact; discipline is now labelled class points.
- Three environments: original classroom, boxing gym, midnight rooftop.
- Vale/Rhea revenge has a timed dodge challenge, free misses, clean-shot assistance after three misses, and cancellation before spending. Classic characters and reduced-motion use direct delivery.
- Models have zero facial morph targets and no jaw joints. Expressive faces and photoreal animation remain unfinished; do not claim this pass implements them. Three.js reference: https://threejs.org/examples/webgl_animation_skinning_morph shows independent facial morph targets; https://threejs.org/examples/webgl_animation_skinning_additive_blending covers layered skeletal motion.
- Automated appearance, rig, effects, engine, locker and preferences checks pass. No visual browser review in this pass. Local preview only; not published.


## Build 15 — MakeHuman facial experiments
Research sources: MakeHuman/MPFB core asset license (https://static.makehumancommunity.org/about/license.html), Faceunits01 (https://static.makehumancommunity.org/assets/assetpacks/faceunits01.html), Mindfront Aksel skin from Skins02 (https://static.makehumancommunity.org/assets/assetpacks/skins02.html), Three.js facial morph example (https://threejs.org/examples/webgl_morphtargets_face.html).
- Selected CC0 MakeHuman mesh and authored ARKit-style facial deltas. Source geometry and packs preserved under asset-sources/makehuman; deterministic local baker scripts/build-realistic-face.py. No paid service.
- Exported head-and-neck experiment: 4,511 vertices, 8,580 triangles, 52 expressions plus two identity controls. UVs preserved; normal-field deltas recomputed for each facial target. Skin colour and normal maps by Mindfront.
- avatar-lab.html compares lean, weathered and broad facial presets, age and jaw sliders, expression ramp, blink and motion controls.
- avatar-performance.html attaches an experimental expressive Warden head to the existing body rig, removing the original head triangles/eyes/brows/hair. Existing instructors are unchanged.
- Not yet production quality: neck seam/skin matching, proper hair/teeth, richer eyes, authored performance, glass-contact IK and realistic subsurface scattering remain. No visual browser QA was performed. Do not advertise as ultra-realistic or as a finished replacement.
- tests/realistic-face.mjs verifies deformation, finite values, facial recovery, reduced head motion, head attachment, repeated boxing impacts and action retirement. Existing rig/appearance/preferences tests pass.
