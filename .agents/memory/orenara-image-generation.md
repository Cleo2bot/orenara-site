---
name: Orenara image-generation lessons
description: Prompt tactics that worked for the Orenara night/LED image set (people counts, sconce suppression, figure artifacts).
---

# Orenara image-generation lessons

- **People counts overshoot by one.** Asking for "exactly four" repeatedly produced five. Prompt one fewer than the max ("three people") — the model's habit of adding a figure then lands within bound.
  **Why:** two slots failed 2–3 attempts on count alone; the N-1 tactic passed first try.
- **Wall sconces are the default failure for night exteriors.** Negative prompts alone don't stop them. What works: pull the camera back so the wall is small/dark, and state "the only light sources in the scene are the LED strips and interior window light" positively in the prompt.
- **Figure artifacts by attempt:** censor-smeared faces → prompt "seen from behind, facing away, natural soft focus falloff"; glowing-white/translucent figures → specify dark matte clothing ("dark knitwear and jeans") + "solid and opaque".
- **Unwanted decor props (lanterns, pillar candles, plates)** creep onto bench tops; say "bench tops completely bare" and name the single allowed prop ("one open paperback as the only loose object").
- Global style block + "exposure slightly brighter than typical night photography" held grade consistency across a 12-image batch vs. the hero reference; the site treatment (saturate .85 + strong scrim) absorbs it well.
