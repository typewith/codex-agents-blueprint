---
name: expo-app-workflow
description: Use when the user asks for Expo or React Native implementation work.
---

Follow this workflow for Expo app work:

1. Map the target screen, route, and dependent state.
2. Use `node scripts/mobile/run-screen-check.mjs --item <ITEM_ID>` to create review notes.
3. Implement the narrowest safe slice and record screen-state assumptions.

- Do not hide navigation assumptions.
- Keep screen states and API dependencies explicit.
