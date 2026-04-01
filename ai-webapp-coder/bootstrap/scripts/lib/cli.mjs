export function parseArgs(argv) {
  const positional = [];
  const flags = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }

    const [rawKey, inlineValue] = value.slice(2).split("=", 2);

    if (inlineValue !== undefined) {
      flags[rawKey] = inlineValue;
      continue;
    }

    const nextValue = argv[index + 1];
    if (nextValue && !nextValue.startsWith("--")) {
      flags[rawKey] = nextValue;
      index += 1;
    } else {
      flags[rawKey] = "true";
    }
  }

  return { positional, flags };
}
