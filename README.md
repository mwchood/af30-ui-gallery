# AF30 UI System v0.1

React component gallery and design-system-constrained restoration baseline for the Typhur AF30 1280×720 TFT.

## Run

The simplest Windows option is to double-click:

`双击打开-AF30组件画廊.cmd`

Keep the opened command window running while using the gallery.

Or run manually:

```powershell
npm install
npm run dev
```

Open the local URL. Use the left control panel or URL parameters, for example:

`?page=manual&state=MAN-AI-CS03`

`?page=cooking&state=CWB-V05`

## Boundaries

- Device pages are fixed 1280×720 and non-responsive.
- The gallery shell scales the entire canvas for desktop preview.
- Inter and Lucide are prototype dependencies, not approved embedded production assets.
- Embedded resource constraints remain `pending-embedded-validation`.
