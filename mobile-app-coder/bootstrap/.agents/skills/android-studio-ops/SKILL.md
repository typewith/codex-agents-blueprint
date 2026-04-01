---
name: android-studio-ops
description: Use when the user asks for Android Studio or Android-native workflow help.
---

Follow this workflow for Android tooling work:

1. Read `docs/runbooks/android-studio.md` first.
2. Run `node scripts/mobile/run-native-tooling-check.mjs --platform android` to create the tooling checklist artifact.
3. Document SDK, emulator, signing, and native dependency assumptions before asking a human to validate.

- Do not assume a clean Android SDK environment.
- Keep human validation steps explicit.
