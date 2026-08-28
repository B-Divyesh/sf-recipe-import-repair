# Demo sandbox

- URL: `https://recipe-import-repair.sociobot.in/demo` or local `http://127.0.0.1:5173/demo`
- Sample: JSON-LD for “Rosemary tomato beans.” It includes a Unicode fraction, malformed decimal, and verbose unit.
- Expected flow: select “Apply 3 safe repairs,” review the cleared issue list, undo if wanted, then export neutral JSON.
- Reset: select “Reset demo” in the persistent demo strip.
- Exit: select “Start for real.” This discards demo state and opens an empty bench.
- Storage: demo source uses session storage key `demo:recipe-import-repair:source`. Normal recipe text is not stored. Demo state never enters a real-data key.
- Network: the sample is compiled into the app. The demo needs no account or external request.
