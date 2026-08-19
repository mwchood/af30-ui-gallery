# AF30 Parameter Adjuster Design QA

- Source visual truth:
  - `C:\Users\hood.ma\AppData\Local\Temp\codex-clipboard-99700341-f59d-4b2e-8bb2-efe5454ecf0c.png`
  - `C:\Users\hood.ma\AppData\Local\Temp\codex-clipboard-1dbfa624-0c38-405c-88ac-8000ba92bdf2.png`
  - `C:\Users\hood.ma\AppData\Local\Temp\codex-clipboard-7e07f7a1-90eb-4338-9cc7-79ce140c63ca.png`
- Implementation screenshots:
  - `qa/recipe-confirm-implementation.png`
  - `qa/recipe-running-entry-implementation.png`
  - `qa/parameter-adjust-four-tabs-implementation.png`
  - `qa/parameter-adjust-time-implementation.png`
- Viewport: in-app browser 944 × 791; fixed device canvas 1280 × 720; Physical V2 enabled.
- States: `CWB-V03`, `REC-V02`, `REC-V03`.
- Recipe runtime variants additionally verified: `REC-V04` (Cooking complete), `REC-V05` (Cooking paused), and `REC-V06` (Drawer removed).

## Full-view comparison evidence

- `qa/comparison-recipe-confirm.png`: the four parameter rows no longer contain chevrons; one shared Adjust settings entry sits above the card at the upper right.
- `qa/comparison-recipe-running-entries.png`: Adjust settings and Adjust Time remain visually distinct and are positioned next to the content they affect.
- `qa/comparison-shared-dialog-states.png`: the four-tab and time-only variants share the same modal geometry, control language, typography, colors, and footer action.

## Focused region comparison evidence

Focused comparisons were required because the source screenshots isolate small controls rather than a full 1280 × 720 page. The comparison boards enlarge the entry controls, parameter card rows, and modal states enough to verify labels, arrows, spacing, and affordances.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: the shared dialog uses the existing AF30/SV03 font tokens and maintains readable 17–66 px hierarchy in Physical V2.
- Spacing and layout rhythm: the dialog remains centered with one active control area; three- and four-tab variants do not overflow the fixed canvas.
- Colors and visual tokens: existing black, #171717, #424242, #737373, and white interaction states are reused.
- Image quality and asset fidelity: no new raster assets were required; existing SV03 close, settings, edit, and chevron assets are reused.
- Copy and content: unified copy uses Adjust settings, Temp, Time, and Fan speed consistently. Adjust Time opens a time-only state.

## Interaction verification

- Manual Cooking Adjust settings opens Mode / Temp / Fan speed tabs.
- Manual Cooking timer edit opens the time-only variant.
- Recipe confirmation Adjust settings opens Mode / Temp / Time / Fan speed tabs.
- Recipe running Adjust settings opens three tabs; Adjust Time opens no tabs.
- Tab selection persists while values are changed repeatedly.
- Mode cycles through eight modes; Temp changes by 5°C; Time changes by 1 minute; Fan speed changes by one level.
- Browser console errors and warnings checked: none.

## Comparison history

- Initial implementation issue: parent state updates could reset the active parameter tab to Mode.
- Fix: removed unnecessary prop-to-state resynchronization in the shared dialog.
- Post-fix evidence: repeated Temp increments remained on the Temp tab and changed 190°C → 200°C.

## Follow-up polish

- No blocking polish items. Swipe gestures can be added later if the embedded touch framework supports them reliably; the current arrow controls provide the required functionality and hit size.

## Recipe library and Green Beans validation

- Source visual truth: `C:\Users\hood.ma\AppData\Local\Temp\codex-clipboard-79fe37b6-cba6-4b97-b94d-3e78327bf449.webp`
- Implementation screenshots:
  - `qa/recipe-library-page-one-green-beans.png`
  - `qa/green-beans-detail.png`
  - `qa/green-beans-second-cook-stage.png`
- Full-view comparison evidence: `qa/green-beans-detail.png` shows the generated Green Beans hero, recipe facts, equipment, and ingredient list inside the fixed 1280 × 720 canvas; `qa/recipe-library-page-one-green-beans.png` shows the first six-card page and page counter; `qa/green-beans-second-cook-stage.png` shows the second cook stage with its own 03:00 countdown.
- Focused region comparison evidence: the source mobile screenshot was used to verify Green Beans name, 2 servings, 30 min total time, 20 min prep time, 9 ingredients, 4 equipment items, and eight step titles. The implementation preserves this content while adapting it to the AF30 TFT layout.
- Pagination: All recipes show 12 total, six cards per page, page 1/2 and 2/2, with disabled edge arrows and functional previous/next controls.
- Recipe flow: Green Beans opens from the first card, starts at Step 1 of 8, enters the first cook stage at Step 4 with 190°C / 7 min / Level 5, and enters the second cook stage at Step 6 with 190°C / 3 min / Level 5.
- Console errors and warnings checked after the full flow: none.

## Recipe comparison history

- Initial implementation issue: local preview was serving a stale Vite module after source edits.
- Fix: restarted only the AF30 local preview process on port 5173, then reran the browser flow against the latest source.
- Post-fix evidence: pagination, Green Beans detail, Step 4, Step 6, and both countdown values were verified in the refreshed preview.

## Recipe runtime state validation

- `REC-V03` keeps the active cooking layout and exposes Remaining Time, Adjust Time, and Adjust settings.
- `REC-V04` changes the upper-left runtime block to Cooking complete / Total cooking time, removes runtime edit entries, and adds fixed Previous / Next actions for moving to the adjacent recipe steps.
- `REC-V05` changes the upper-left runtime block to Cooking paused / Remaining Time while preserving the existing adjustment entries.
- `REC-V06` changes only the upper-left title to Drawer removed; Remaining Time, Adjust Time, Adjust settings, and current parameters match the Cooking paused state.
- The camera and lower parameter region remain shared across these variants to keep the Recipe Cook workspace stable.

## Latest recipe-step corrections

- The left recipe step rail now has a scrollable vertical region; the 8-step Green Beans rail reports `scrollHeight > clientHeight` with `overflow-y: auto`.
- Step metadata is conditional: Step 2 shows only its ingredient; Step 3 shows neither ingredient nor tool; empty metadata rows are not rendered.
- Cook steps no longer render an intermediate instruction page. Selecting or advancing to Step 4 / Step 6 directly opens the left-rail Cooking settings confirmation state.
- Post-fix evidence: Step 4 resolves to `Cook the Green Beans` with 7 min; selecting Step 6 from the rail resolves to `Cook the Green Beans Again` with 3 min.

final result: passed
