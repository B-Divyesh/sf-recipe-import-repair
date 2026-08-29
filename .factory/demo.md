# Demo sandbox

- URL: `https://recipe-import-repair.sociobot.in/?demo=1` (the one-click catalog path), with `/demo` as an equivalent route.
- Sample: JSON-LD for “Rosemary tomato beans.” It includes a Unicode fraction, malformed decimal, and verbose unit.
- Expected flow: select “Apply 3 suggested repairs,” review the cleared issue list, undo if wanted, then choose an export format.
- Reset: select “Reset demo” in the persistent demo strip.
- Exit: select “Leave demo and clear sample.” This discards demo state and opens an empty workspace.
- Storage: demo source uses the separate session storage key `demo:recipe-import-repair:source`. It never enters a real-data key and is removed when the user starts normal work.
- Network: the sample is compiled into the app. The demo repair flow makes no third-party request.
