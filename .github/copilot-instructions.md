## Copilot Instructions: bootstrap-iconpicker

Purpose: jQuery/Bootstrap popover-based icon picker plugin (current `Iconpicker.VERSION = 1.13.1`) supporting multiple icon font families with versioned icon lists (FA 4–7, etc.).

### Architecture & Data Flow
1. Core plugin: `src/js/bootstrap-iconpicker.js` defines `$.fn.iconpicker` (initializes on `button[role="iconpicker"], div[role="iconpicker"]`). Buttons use a Bootstrap popover; divs render inline.
2. Iconset registry: `Iconpicker.ICONSET` pulls objects exposed as `$.iconset_<name>` from loader files in `src/js/iconset/`. Each loader assigns `$.iconset_<name> = data;` where `data` includes `iconClass`, `iconClassFix`, `icons`, and optional `allVersions` array → supports `iconsetVersion` selection (default `'latest'`).
3. Rendering cycle: `select()` updates hidden input + <i> tag; pagination/search drive `changeList() → filterIcons() → updateLabels() → updateIcons()`.
4. Bootstrap version detection via `$.fn.bsVersion()` influences popover destruction method and search input width.

### Key Conventions
* Columns must be ≥4; rows ≥0 (rows = 0 shows all). Violations throw early.
* Role attribute triggers auto init; use `data-iconset`, `data-icon`, `data-iconset-version` for defaults. Custom iconset: pass plain object to `setIconset()`.
* An "empty" sentinel icon is included as the first entry of most lists.
* For versioned iconsets (e.g. Font Awesome 6/7) choose a specific version by setting `iconsetVersion` to a value present in `allVersions.version`.
* Distribution: source (`src/`), temp minified intermediates (`temp/`), final distributables (`dist/`). CDN files are built from `dist/` output.

### Build & Verification Workflow
* Full build: `grunt build` (runs cssmin, uglify main+iconsets, concat all variants, bundle, then removes `temp/`). Output in `dist/`.
* Watch (dev): `grunt` default task (watch css/js, rebuild pieces).
* Icon coverage verification (Font Awesome): `grunt verifyFa5|verifyFa6|verifyFa7 [--strict]` calls scripts in `util/` comparing local loader vs JSON metadata (`faX-icons.json`). `--strict` causes task failure on missing icons.
* Before release: bump version in `package.json` AND `Iconpicker.VERSION`; run `grunt build`; update `docs/CHANGELOG.md`; verify FA lists; ensure test expectations (`test/test.js`) match new version (file currently lags and uses misspelled `'lastest'`).

### Adding / Updating an Iconset
1. Create `src/js/iconset/iconset-<myset>-all.js` patterned after existing loaders: IIFE assigning `$.iconset_<myset> = data;`.
2. If multiple upstream versions: include `allVersions: [{ version: 'X.Y.Z', icons: [...] }, ...]` plus a flattened `icons` array for latest.
3. Add uglify target + concat entries in `gruntfile.js` (both `uglify.iconset.files` and `concat.iconsetJS/src` & `concat.iconsetJSMin/src`).
4. Run `grunt build` and confirm new icons appear via demo page `index.html`.
5. Document in `docs/SUPPORTED.md`.

### Debugging & Testing
* Use `index.html` / `index_v3x.html` for manual Bootstrap 4/3 checks; open `test/index.html` to run Mocha/Chai assertions in browser (no Node test runner configured).
* Common pitfalls: missing Bootstrap Popover plugin (throws early); mismatch between icon list count assertions in `test/test.js` and updated iconset; forgetting to update version string.
* To inspect runtime options: `$('#myPicker').data('bs.iconpicker').options`.

### External Dependencies
* Requires jQuery + Bootstrap (3.x–5.x popover). Ensure Font CSS (e.g. Font Awesome) loaded for chosen iconset; loaders themselves only enumerate class names.

### Performance Notes
* Pagination slices DOM insertion to `rows * cols`; set `rows=0` only for smaller sets or when search narrowed.
* Search is linear over current version's `icons` array; large FA sets benefit from keeping rows >0.

### Quick Usage Example
```html
<button class="btn btn-secondary" role="iconpicker" data-iconset="fontawesome6" data-icon="fas fa-wifi"></button>
```
Access selection changes: `$('button[role="iconpicker"]').on('change', e => console.log(e.icon));`

---
Feedback welcome: let us know if any workflow or convention above is unclear or missing so we can refine these instructions.
