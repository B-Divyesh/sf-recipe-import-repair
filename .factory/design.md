# Visual thesis: the repair notebook

Recipe Import Repair looks like a careful cook's lab notebook: warm graph paper, blue-black ink, rust-red proof marks, clipped specimens, and taped annotations. The bench metaphor is literal enough to explain inspection, but restrained enough for long editing sessions. The interface should feel deterministic and handmade, never automated or magical.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#F4EFDf` | page background |
| Paper raised | `#FFFDF5` | fields and sheets |
| Ink | `#202A2E` | primary text |
| Graphite | `#566065` | secondary text |
| Lab blue | `#1F5964` | primary actions and focus |
| Blue wash | `#D9E7E5` | selected and informational states |
| Proof red | `#9E3F32` | errors and repair marks |
| Amber | `#8A5A12` | warnings |
| Leaf | `#356346` | valid and exported states |
| Night paper | `#182124` | dark background |
| Night sheet | `#222E31` | dark raised surface |

All functional pairings meet WCAG AA for normal text. Light and dark treatments follow the browser preference; paper texture stays subtle in both.

## Type

- Display and annotations: `Segoe Print`, `Bradley Hand`, `Comic Sans MS`, cursive. It supplies the handwritten notebook voice without a network font.
- Body and controls: `ui-monospace`, `SFMono-Regular`, `Cascadia Code`, `Roboto Mono`, monospace. Recipe fields become inspectable records, not glossy content cards.
- Sizes follow a compact 1.2 scale. Body text is 16px minimum and line height is at least 1.5.

System font stacks avoid a font download and keep the first load small.

## Spacing and shape

An 8px base rhythm (`4, 8, 12, 16, 24, 32, 48, 64`) aligns with the graph-paper grid. Sheets use 2px ink borders, clipped top corners, and slightly irregular 3px radii. Repair controls look like proofreader stamps. The workbench uses a wide source/inspection split on desktop and a single stack at 390px.

## Interaction grammar

- Source material enters on the left; the parsed, editable recipe sits on the right.
- Every repair is proposed as a named change with Before and After values.
- Applying a repair adds it to an undoable repair log. Undo walks back one exact transform.
- Valid fields carry a written status as well as color. Errors lead directly to the affected field.
- The sample demo uses a persistent ruled-paper strip that labels its isolated state.

## Motion

The signature motion is a 180ms proof-mark stamp when a repair is applied. Sections settle by opacity and a 4px vertical move. Nothing loops. With `prefers-reduced-motion: reduce`, transitions and transforms are removed and state changes are instant.

## Original asset plan

The hero illustration is an overhead editorial still life: an open graph-paper recipe notebook, clipped JSON printout, measuring spoon, pencil proof marks, and small ingredient specimens. It has room around the subject and contains no text, people, brands, logos, or UI claims. It anchors the notebook world without pretending to show the product screen.

Prompt sheet:

> Use case: stylized-concept. Asset type: landing page hero illustration and social crop. Primary request: an overhead editorial still life of a handwritten recipe repair workbench. Scene: warm ivory graph-paper notebook, clipped structured-data printout represented only by abstract lines, brass measuring spoon, graphite pencil, rust-red proofreader marks, a few rosemary leaves and flour specks. Style: tactile cut-paper and colored-pencil illustration, restrained natural shadows, slight registration imperfections. Composition: wide landscape, main notebook on the right with calm negative space, readable at small sizes. Lighting: soft north-window light. Palette: warm paper, blue-black ink, muted teal, rust red, leaf green. Constraints: no readable text, no letters, no numbers, no people, no hands, no logos, no watermark, no glossy 3D, no gradient background.

Generation provenance: original generated image, Factory Azure image deployment through `/opt/fleet/lib/gen-image.sh`, 2026-08-28. Final source and prompt sidecar live in `assets/src/`; WebP derivatives ship from `public/assets/`. The footer discloses generated illustration.

## Dark treatment

Dark mode resembles a notebook under a task lamp: charcoal paper, pale ink, desaturated teal controls, and brighter red proof marks. Decorative graph lines are reduced to prevent shimmer. Form fills remain distinct from the page without relying on shadows.
