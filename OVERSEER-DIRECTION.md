# Observation Division experiment

Branch: codex/overseer-character, based on the approved electric-blue-ui branch.

Ivory, charcoal olive and safety orange. The main character stands inside an arched observation booth; the cast is selectable directly from the lobby. The existing instructors, arenas, focus modes, departure warning and revenge remain available.

Morrow and Riot use the CC0 RobotExpressive rig with authored animation and independent Angry, Surprised and Sad face morphs. Riot has a brow guard, red shell and faster movement. These are variants of one new character model, not separate original sculpts. The performance controller samples the authored punch to locate hand contact, crossfades movement, retires old actions and suppresses impacts in reduced-motion mode.

The experiment uses its own browser storage keys (detention-overseer-v1 and detention-overseer-active-v1), so trying it does not overwrite the approved version's progress or appearance preferences. It starts with a fresh experiment profile.

Validation: automated loaded-asset checks cover repeated punches, finite contact points, look-away retreat, expression recovery, revenge recovery, reduced motion and action cleanup. Existing engine and preference tests also pass. Phone-width browser inspection is separate from these checks.

This is a stylised character direction, not a finished photoreal pipeline. Further bespoke silhouettes and more specific dialogue would distinguish the cast further. No change has been merged into main or the electric blue branch.
