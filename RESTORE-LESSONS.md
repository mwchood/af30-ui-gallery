# Restoration Lessons

Record every user correction as a prevention rule and a verifiable check.

## 2026-08-16 - Cooking parameter cards were stretched to consume empty space; Manual Time was duplicated in the summary; adding an edit affordance shifted the centered timer.

- Cause: Whitespace reduction was prioritized over preserving component proportions, single-source data hierarchy, and cross-state alignment invariants.
- Default rule: Never fill runtime whitespace by stretching repeated controls. Keep summary fields limited to their defined schema, and position accessory actions without moving the primary numeric center.
- Required check: For every runtime state, assert summary labels exactly match the state schema, card height stays within the approved component range, and the timer center differs from the panel center by less than 1 px with or without an edit button.
- Evidence: User correction 2026-08-16; CWB-V03 final browser check: Mode/Temperature/Fan speed only, timer-center delta 0.002 px.

## 2026-08-16 - Recipe running screen ignored the selected cooking reference and introduced a different camera-first composition with Current step, Next, progress, and a vertical settings summary.

- Cause: REC-V03 was treated as an unconstrained extension because its source was not explicitly linked during the first pass, even though the matching recipe cooking image already existed in the asset set.
- Default rule: Before extending an unsourced state, search the full provided asset set and bind the exact selected reference. Do not invent runtime sections or duplicate step context that the reference does not show.
- Required check: For REC-V03, assert the right workspace contains exactly the reference hierarchy: Recipe cooking title, Remaining Time, one compact Adjust Time action, one live image, Current Cooking Parameters, one Adjust Parameters action, and three horizontal values; assert Current step, Next, progress bar, and vertical runtime rows are absent.
- Evidence: User correction and selected source: cooking-screen-left-info-text-enlarged-compact-adjust-time.png.

## 2026-08-16 - REC-V03 horizontal parameter card touched the bottom edge of the workspace.

- Cause: The fixed 322 px top row plus gap left only 190 px for a 217 px parameter section, so the second row overflowed into the bottom padding.
- Default rule: Size nested runtime regions against the actual content-box height. A child section must fit inside its assigned grid row and may not consume the parent bottom padding.
- Required check: For REC-V03 at 1280x720, assert the parameter card bottom is at least 24 px above the running workspace bottom and the parameter section scroll height equals client height.
- Evidence: User correction 2026-08-16: parameter card was flush with the bottom edge.

## 2026-08-19 - Cooking guidance popover displaced runtime data

- Cause: The optional helper copy was rendered in normal flex flow.
- Default rule: Optional runtime guidance must be absolutely positioned and must not change sibling layout bounds.
- Required check: For CWB-V01, assert the top coordinates of timer, timeline and settings are identical before and after opening guidance.
- Evidence: User correction 2026-08-19; browser position check passed.

## 2026-08-19 - Cooking runtime variants drifted in title, timer, and progress hierarchy

- Cause: AI-only selectors allowed paused, drawer-removed, Manual, and completion views to retain different typography and vertical composition.
- Default rule: Cooking V01-V06 must share one runtime hierarchy for title, time, and progress; only state copy and values may vary.
- Required check: Capture CWB-V01 through CWB-V06 and verify identical title, timer, and progress-region bounds for the shared runtime template.
- Evidence: User correction 2026-08-19; V01 reference supplied as codex-clipboard-056893f9-99bb-4fe2-8656-5493a1c3b506.png.

## 2026-08-19 - Cooking complete used the live-runtime spacing after its progress bar was removed

- Cause: The completion panel inherited an oversized settings block and action spacing rather than defining the compact post-completion stack shown in the reference.
- Default rule: When a runtime state removes a region, recompose the remaining regions against its selected reference instead of leaving inherited empty space.
- Required check: For CWB-V06, verify title remains fixed and the total-time, settings card and paired actions appear as one compact vertical stack without a progress bar.
- Evidence: User reference and correction 2026-08-19: codex-clipboard-78b3a6b0-83b4-48c7-a7bc-a9bb595edcd0.png.

## 2026-08-19 - A supplied screenshot was mistakenly treated as a target rather than the current-state context

- Cause: The requested redesign direction was not separated from the screenshot provenance before applying visual matching.
- Default rule: When a user says a screenshot shows the original page, preserve only explicitly fixed elements and redesign the remaining layout to satisfy the stated outcome.
- Required check: Before matching any supplied screenshot, confirm whether it is a target reference or a current-state illustration; for CWB-V06 keep only the title fixed and evaluate bottom whitespace after the redesign.
- Evidence: User clarification 2026-08-19: codex-clipboard-78b3a6b0-83b4-48c7-a7bc-a9bb595edcd0.png is the original page screenshot.

