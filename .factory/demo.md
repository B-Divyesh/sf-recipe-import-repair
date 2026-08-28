# Demo sandbox

- URL: `https://recipe-import-repair.sociobot.in/demo` or local `http://127.0.0.1:5173/demo`
- Sample: JSON-LD for “Rosemary tomato beans.” It includes a Unicode fraction, malformed decimal, and verbose unit.
- Expected flow: select “Apply 3 safe repairs,” review the cleared issue list, undo if wanted, then export neutral JSON.
- Reset: select “Reset demo” in the persistent demo strip.
- Exit: select “Start for real.” This discards demo state and opens an empty bench.
- Storage: demo source uses the separate session storage key `demo:recipe-import-repair:source`. It never enters a real-data key and is removed when the user starts normal work.
- Network: the sample is compiled into the app. The demo repair flow makes no third-party request.
