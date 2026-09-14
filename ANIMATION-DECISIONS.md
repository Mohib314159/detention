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
