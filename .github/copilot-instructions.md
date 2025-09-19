# Copilot Instructions for bootstrap-iconpicker

## Project Overview
- **bootstrap-iconpicker** is a jQuery-based icon picker supporting Bootstrap 3.x/4.x and multiple icon fonts (Elusive, Font Awesome, Ionicons, Map Icons, Material Design, Octicons, Typicons, Weather Icons, Flag Icons, Glyphicons).
- Main source files are in `src/` (unminified) and `temp/` (minified). Distribution bundles are generated for CDN and npm.
- Iconsets are modular: each icon font has its own loader in `src/js/iconset/` and is bundled/minified for production.

## Key Files & Structure
- `src/js/bootstrap-iconpicker.js`: Core plugin logic.
- `src/js/iconset/`: Individual iconset loaders (e.g., `iconset-fontawesome-5-all.js`).
- `src/css/bootstrap-iconpicker.css`: Main styles.
- `gruntfile.js`: Build automation (minification, bundling).
- `index.html`, `index_v3x.html`, `test/index.html`: Demo and test pages.
- `docs/CHANGELOG.md`, `docs/SUPPORTED.md`: Changelog and supported iconsets.

## Build & Development Workflow
- **Build:** Run `grunt` (see `gruntfile.js`) to generate minified assets in `temp/`.
- **Test:** Open `test/index.html` in a browser for manual testing. No automated test suite is present.
- **Debug:** Use unminified files in `src/` for debugging. Minified files in `temp/` are for production/CDN.
- **Release:** Update version in `package.json`, run build, and publish to npm/CDN.

## Project Conventions
- **Iconset Integration:** Add new iconsets by creating a loader in `src/js/iconset/` and updating the bundle logic.
- **Options:** Default options (iconset, classes) are set in the core JS file and documented in the changelog.
- **Semantic Versioning:** Follows SemVer for releases. See `docs/CHANGELOG.md` for details.
- **Manual Testing:** Use provided JSFiddle template for bug reports.

## External Dependencies
- **jQuery** and **Bootstrap** (3.x/4.x) are required for plugin operation.
- Icon font CSS/TTF/WOFF files are in `icon-fonts/` and referenced by iconset loaders.

## Examples
- To add a new iconset, create `src/js/iconset/iconset-NEWICON-all.js`, update the build process, and document in `docs/SUPPORTED.md`.
- To debug, edit `src/js/bootstrap-iconpicker.js` and test in `test/index.html`.

## References
- [Live documentation & examples](https://clinical-support-systems.github.io/bootstrap-iconpicker)

---
For questions, open an issue or consult the README for links to bug report templates and documentation.
