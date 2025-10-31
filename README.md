[![NPM Version](https://img.shields.io/npm/v/css-bootstrap-iconpicker)](https://www.npmjs.com/package/css-bootstrap-iconpicker)
[![Release](https://img.shields.io/github/v/release/clinical-support-systems/bootstrap-iconpicker)](https://github.com/Clinical-Support-Systems/bootstrap-iconpicker/releases)
![Tag](https://img.shields.io/github/v/tag/clinical-support-systems/bootstrap-iconpicker)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/clinical-support-systems/bootstrap-iconpicker)
![GitHub License](https://img.shields.io/github/license/clinical-support-systems/bootstrap-iconpicker)

# [Bootstrap-Iconpicker v1.14.0]([http://clinical-support-systems.github.io/bootstrap-iconpicker](https://clinical-support-systems.github.io/bootstrap-iconpicker/))
![Iconpicker](bootstrap-iconpicker_4x.png)

An (updated) simple iconpicker for Bootstrap 3.x, 4.x, and 5.x.

This project is for [Bootstrap 3.x, 4.x, and 5.x](http://getbootstrap.com/), including Glyphicons in Bootstrap 3.x. Bootstrap 5 popovers are supported natively without the legacy jQuery plugin wrapper.
Other icon fonts thats supports: [Elusive Icons](http://press.codes/downloads/elusive-icons-webfont/), [Font Awesome](http://fontawesome.io/), [Ionicons](http://ionicons.com/), [Map Icons](http://map-icons.com/), [Material Design Icons](http://zavoloklom.github.io/material-design-iconic-font/), [Octicons](https://octicons.github.com/), [Typicons](http://typicons.com), [Weather Icons](http://erikflowers.github.io/weather-icons/), [Flag Icons](http://flag-icon-css.lip.is/).

## Why did we update this?

We needed to update this project because the [original repository](https://github.com/victor-valencia/bootstrap-iconpicker) is no longer actively maintained. This means that any issues or feature requests will not be addressed, and the project may become outdated as new versions of Bootstrap are released not to mention the need to update the Font Awesome iconset to version 6.x and add support for Font Awesome 5.x and 6.x Pro.

## Table of contents
- [Quick start](#quick-start)
- [CDN](#cdn)
- [What's included](#whats-included)
- [Supported iconset](#supported-iconset)
- [Documentation and live examples](#documentation-and-live-examples)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [What's next and changelog](#whats-next-and-changelog)
- [Versioning](#versioning)
- [Author](#author)
- [Contributors](#contributors)
- [License](#license)
- [Used by](#used-by)

## Quick start

Several quick-start options are available:

- Download the latest release: [![Tag](http://img.shields.io/github/release/Clinical-Support-Systems/bootstrap-iconpicker.svg)](https://github.com/Clinical-Support-Systems/bootstrap-iconpicker/archive/v1.10.0.zip).
- Clone the repo: `git clone https://github.com/Clinical-Support-Systems/bootstrap-iconpicker.git`.
- Install with [npm](https://www.npmjs.com): `npm install bootstrap-iconpicker`.

### Maintaining Font Awesome iconsets

The Font Awesome iconset bundles in `src/js/iconset/` are generated from the official metadata. If the upstream JSON files change (for example, when updating to a new Font Awesome release), regenerate and verify the bundles with:

```powershell
npm run verify:iconsets
```

Running the command without any local modifications confirms that the checked-in bundles match the metadata. If the script reports they are outdated, rerun the same command without the `--check` flag (see `util/generate-fa-iconset.js`) to regenerate the files before committing.

### Font Awesome version selection

As of v1.13.3 the picker automatically resolves the latest matching Font Awesome list. When you declare `data-iconset="fontawesome6"` or `data-iconset="fontawesome7"` you can omit `data-iconset-version` entirely:

```html
<button class="btn btn-secondary" role="iconpicker" data-iconset="fontawesome7" data-icon="fat fa-tombstone"></button>
```

If Font Awesome Pro CSS is present on the page the picker promotes itself to the newest `_pro` release. Otherwise it falls back to the most recent free release. The resolved version is exposed as `options.iconsetVersionResolved` and whether Pro assets were detected appears as `options.iconsetHasPro` on the iconpicker instance.

To pin to a specific bundle (for example to match an older deployment) you can still provide `data-iconset-version="7.0.1"`, or set `iconsetVersion: '7.0.1'` via JavaScript. Passing `'latest'` forces the highest numbered release regardless of tier, while `'auto'` (the default) keeps the adaptive behaviour described above.

## CDN

The [CDN](https://cdnjs.com/libraries/bootstrap-iconpicker) is updated after the release is made public, which means that there is a delay between the publishing of a release and its availability on the CDN. Check the GitHub page for the latest release.

- [https://cdnjs.cloudflare.com/ajax/libs/bootstrap-iconpicker/1.10.0/css/bootstrap-iconpicker.min.css](https://cdnjs.cloudflare.com/ajax/libs/bootstrap-iconpicker/1.10.0/css/bootstrap-iconpicker.min.css)
- [https://cdnjs.cloudflare.com/ajax/libs/bootstrap-iconpicker/1.10.0/js/bootstrap-iconpicker-iconset-all.min.js](https://cdnjs.cloudflare.com/ajax/libs/bootstrap-iconpicker/1.10.0/js/bootstrap-iconpicker-iconset-all.min.js)
- [https://cdnjs.cloudflare.com/ajax/libs/bootstrap-iconpicker/1.10.0/js/bootstrap-iconpicker.bundle.min.js](https://cdnjs.cloudflare.com/ajax/libs/bootstrap-iconpicker/1.10.0/js/bootstrap-iconpicker.bundle.min.js)
- [https://cdnjs.cloudflare.com/ajax/libs/bootstrap-iconpicker/1.10.0/js/bootstrap-iconpicker.min.js](https://cdnjs.cloudflare.com/ajax/libs/bootstrap-iconpicker/1.10.0/js/bootstrap-iconpicker.min.js)

### What's included
Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
bootstrap-iconpicker/
├── css/
│   ├── bootstrap-iconpicker.css
│   ├── bootstrap-iconpicker.min.css
├── js/
│   ├── bootstrap-iconpicker-iconset-all.js
│   ├── bootstrap-iconpicker-iconset-all.min.js
│   ├── bootstrap-iconpicker.bundle.min.js
│   ├── bootstrap-iconpicker.js
│   └── bootstrap-iconpicker.min.js
```

We provide compiled CSS and JS (`bootstrap-iconpicker.*`), as well as compiled and minified CSS and JS (`bootstrap-iconpicker.min.*`).

All iconset includes in previous versions are included in file (`bootstrap-iconpicker-iconset-all.js`) compiled and (`bootstrap-iconpicker-iconset-all.min.js`) minified.

Files (`bootstrap-iconpicker-iconset-all.min.js`) and (`bootstrap-iconpicker.min.js`) are included in bundle version (`bootstrap-iconpicker.bundle.min.js`).

## Supported Iconset
You can see all supported iconsets in [this doc](docs/SUPPORTED.md).

## Documentation and live examples
See documentation and live examples here: [https://clinical-support-systems.github.io/bootstrap-iconpicker](https://clinical-support-systems.github.io/bootstrap-iconpicker)

## Bugs and feature requests
Have a bug or a feature request? [Please open a new issue](https://github.com/Clinical-Support-Systems/bootstrap-iconpicker/issues). Before opening any issue, please search for existing issues and read the [Issue Guidelines](https://github.com/necolas/issue-guidelines), written by [Nicolas Gallagher](https://github.com/necolas/).
You may use [this JSFiddle](http://jsfiddle.net/victor_valencia/y1q541ar/) as a template for your bug reports.

## What's next and changelog
You can see what's next and the changelog in [this doc](docs/CHANGELOG.md).

## Versioning
For transparency into our release cycle and in striving to maintain backward compatibility, Bootstrap-Iconpicker is maintained under [the Semantic Versioning guidelines](http://semver.org/). Sometimes we screw up, but we'll adhere to those rules whenever possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

- Breaking backward compatibility **bumps the major** while resetting minor and patch
- New additions without breaking backward compatibility **bumps the minor** while resetting the patch
- Bug fixes and misc changes **bumps only the patch**

For more information on SemVer, please visit <http://semver.org/>.

## Authors
(Original) @[clinical-support-systems](https://github.com/clinical-support-systems)

## Contributors
@[clinical-support-systems](https://github.com/clinical-support-systems), @[promatik](https://github.com/promatik), @[jwhitfieldseed](https://github.com/jwhitfieldseed), @[crlcu](https://github.com/crlcu), @[michaelbilcot](https://github.com/michaelbilcot), @[joews](https://github.com/joews), @[s-belichenko-sold](https://github.com/s-belichenko-sold), @[mahmoud-asadi](https://github.com/mahmoud-asadi), @[ibrahimyilmaz7](https://github.com/ibrahimyilmaz7), @[kfrancis](https://github.com/kfrancis)

## License
Licensed under [the MIT license](LICENSE).

## Used by
- [Cake Cup](http://cake-cup.herokuapp.com/)
- [SAPRIGRAT](http://www.saprigrat.mx/)
- [KML App](http://kml-riegotec.herokuapp.com/)
- [Opti Riego](http://optiriego.herokuapp.com/)

Does your organization use bootstrap-iconpicker?
You can just open an issue, include a link, and you'll be added to the list.
