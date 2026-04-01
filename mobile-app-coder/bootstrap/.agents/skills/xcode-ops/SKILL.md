---
name: xcode-ops
description: Use when the user asks for Xcode or iOS-native workflow help.
---

Follow this workflow for Xcode work:

1. Read `docs/runbooks/xcode.md` first.
2. Run `node scripts/mobile/run-native-tooling-check.mjs --platform ios` to create the tooling checklist artifact.
3. Document simulator, provisioning, and signing assumptions before asking a human to validate.

- Do not assume Xcode provisioning is already solved.
- Keep human validation steps explicit.
