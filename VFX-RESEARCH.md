# Revenge VFX: findings and current limits

Reviewed 16 September 2026 after the user rejected the bead-and-tube prototype.

## Sources

- Epic, Niagara Flipbook Baker: https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-flipbook-baker-quick-start-guide-in-unreal-engine
  Simulation can be baked into a sprite atlas when live simulation is too expensive. Texture/frame layout and alpha handling matter. This is a credible eventual route for authored fluid assets, not evidence that our procedural effect is a fluid simulation.
- SideFX, Crown Splash: https://www.sidefx.com/docs/houdini/shelf/crownsplash.html
  Surface tension and thin-sheet resolution determine the splash silhouette; more particles alone do not solve the appearance.
- SideFX, splashing water: https://www.sidefx.com/docs/houdini/fluid/splashingwater.html
  Primary liquid and secondary whitewater are separate layers. Collision shapes influence the liquid motion.
- Three.js sprite example: https://threejs.org/examples/webgpu_sprites.html
- Kenney particle pack: https://kenney.nl/assets/particle-pack
  Free CC0 texture option evaluated; not installed because generic particles do not supply the missing fluid silhouette.

## Implementation decision

Archive the rejected implementation. Replace its large spheres and cylinder with continuously deformed liquid sheets, light-dependent translucent highlights, fine ballistic spray, short cream spread and longer face residue. Contact controls recoil and sound. Keep the pool bounded and verify restart/cleanup. No purchased assets or paid tools.

These are procedural approximations, not FLIP fluid simulation or photoreal assets. They have no physical skin/clothing collision, true wet-clothing response or refraction. A licensed baked splash sequence plus character-specific wetness masks remains the better route to realistic liquid.

## Original brief audit

Preserve: device-looking detection only; brief-glance grace; fast escalation; away/uncertain means calm; camera and pointer modes; departure pauses; multiple instructors; optional sound and reduced motion; earned revenge and weekly progress; original cute instructor.

Still incomplete: authored face rig and expressions, fist-to-glass contact constraint, human desk-working clip, several distinct game-quality human avatars, adaptive warning timing, convincing disappointment and wetness reactions, native iOS Screen Time blocking. Do not report these as completed by an effects update.

## Follow-up pass

Cream residue now follows a head-relative pose and has slow drips. Water adds three thin runoff ribbons and temporary material roughness changes. These are visual approximations, not skin collision or simulated wet fabric. The hit clip now crossfades into the authored head-no gesture and returns to idle instead of holding its last frame. Automated recovery, face-anchor, wetness-decay and action-cleanup checks pass; this pass has not had a new browser visual review or deployment. Previous surface prototype preserved in versions/surface-effects-v8.
