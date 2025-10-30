#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Generate bootstrap-iconpicker Font Awesome iconset files from official metadata.
 *
 * Example:
 * node util/generate-fa-iconset.js \
 *   --metadata util/icons-7.0.1.json \
 *   --out src/js/iconset/iconset-fontawesome-7-all.js \
 *   --version 7.0.1 \
 *   --iconset-key fontawesome_7
 */

const fs = require('fs');
const path = require('path');

const STYLE_PREFIX_BASE = {
    brands: 'fab',
    solid: 'fas',
    regular: 'far',
    light: 'fal',
    thin: 'fat',
    duotone: 'fad',
    'sharp-solid': 'fass',
    'sharp-regular': 'fasr',
    'sharp-light': 'fasl',
    'sharp-thin': 'fast'
};

const FREE_STYLE_ORDER = ['brands', 'regular', 'solid'];
const PRO_STYLE_ORDER = ['brands', 'duotone', 'light', 'regular', 'solid', 'thin'];
const SHARP_STYLES = ['sharp-solid', 'sharp-regular', 'sharp-light', 'sharp-thin'];

function parseArgs(argv) {
    const args = argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg.startsWith('--')) {
            options._ = options._ || [];
            options._.push(arg);
            continue;
        }
        const key = arg.slice(2);
        const next = args[i + 1];
        if (typeof next === 'undefined' || next.startsWith('--')) {
            options[key] = true;
        }
        else {
            options[key] = next;
            i += 1;
        }
    }
    return options;
}

function readMetadata(metadataPath) {
    const raw = fs.readFileSync(metadataPath, 'utf8');
    try {
        return JSON.parse(raw);
    }
    catch (error) {
        throw new Error(`Unable to parse metadata at ${metadataPath}: ${error.message}`);
    }
}

function buildIconList(metaMap, styleOrder, selector, stylePrefix) {
    const result = ['empty'];
    const seen = new Set(result);
    const grouped = new Map();
    for (const style of styleOrder) {
        grouped.set(style, []);
    }

    const iconNames = Object.keys(metaMap).sort();

    for (const name of iconNames) {
        const meta = metaMap[name] || {};
        const styles = selector(meta);
        if (!styles || styles.length === 0) {
            continue;
        }
        const allowed = new Set(styles);
        const slug = `fa-${name}`;
        for (const style of styleOrder) {
            if (!allowed.has(style)) {
                continue;
            }
            const prefix = stylePrefix[style];
            if (!prefix) {
                continue;
            }
            grouped.get(style).push(`${prefix} ${slug}`);
        }
    }

    for (const style of styleOrder) {
        const items = grouped.get(style) || [];
        for (const className of items) {
            if (!seen.has(className)) {
                seen.add(className);
                result.push(className);
            }
        }
    }

    return result;
}

function deriveIconsetKey(outputPath) {
    const base = path.basename(outputPath, '.js');
    const match = base.match(/^iconset-(.*?)-all$/);
    if (!match) {
        return null;
    }
    return match[1].replace(/-/g, '_');
}

function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function formatAllVersions(allVersions) {
    const json = JSON.stringify(allVersions, null, 4);
    const lines = json.split('\n');
    return lines.map((line, index) => (index === 0 ? line : `        ${line}`)).join('\n');
}

function renderFile({ banner, iconsetKey, versions, iconClass = '', iconClassFix = '' }) {
    const lines = [];
    if (banner) {
        lines.push(banner.trimEnd());
    }
    lines.push('\n;(function($){\n');
    lines.push('    var data = {');
    lines.push(`        iconClass: '${iconClass}',`);
    lines.push(`        iconClassFix: '${iconClassFix}',`);
    lines.push('        icons: [],');
    lines.push('        allVersions: ' + formatAllVersions(versions));
    lines.push('    };\n');
    lines.push('    data.icons = data.allVersions[0].icons;\n');
    lines.push(`    $.iconset_${iconsetKey} = data;\n`);
    lines.push('})(jQuery);\n');
    return lines.join('\n');
}

function main() {
    const options = parseArgs(process.argv);

    if (!options.metadata) {
        throw new Error('Missing required --metadata <path> argument.');
    }
    if (!options.out) {
        throw new Error('Missing required --out <path> argument.');
    }

    const metadata = readMetadata(options.metadata);
    const version = options.version || '7.0.1';
    const proVersion = options['pro-version'] || `${version}_pro`;
    const includeSharp = Boolean(options['include-sharp']);
    const checkOnly = Boolean(options.check);

    const iconsetKey = options['iconset-key'] || deriveIconsetKey(options.out);
    if (!iconsetKey) {
        throw new Error('Unable to derive iconset key. Provide --iconset-key explicitly.');
    }

    const freeSelector = meta => Array.isArray(meta.free) ? meta.free : [];
    const proSelector = meta => Array.isArray(meta.styles) ? meta.styles : [];

    const proStyleOrder = includeSharp ? PRO_STYLE_ORDER.concat(SHARP_STYLES) : PRO_STYLE_ORDER;
    const stylePrefix = includeSharp ? STYLE_PREFIX_BASE : Object.fromEntries(
        Object.entries(STYLE_PREFIX_BASE).filter(([style]) => !SHARP_STYLES.includes(style))
    );

    const freeIcons = buildIconList(metadata, FREE_STYLE_ORDER, freeSelector, stylePrefix);
    const proIcons = buildIconList(metadata, proStyleOrder, proSelector, stylePrefix);

    if (freeIcons.length <= 1) {
        throw new Error('Generated free icon list is empty. Check metadata or arguments.');
    }
    if (proIcons.length <= 1) {
        throw new Error('Generated pro icon list is empty. Check metadata or arguments.');
    }

    const versions = [
        { version, icons: freeIcons },
        { version: proVersion, icons: proIcons }
    ];

    const banner = options.banner || `/*!========================================================================\n * Iconset: Font Awesome\n * Versions: ${versions.map(v => v.version).join(', ')}\n * https://fontawesome.com/\n * CDN: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/[VERSION]/css/all.min.css\n * ======================================================================== */`;

    const fileContent = renderFile({
        banner,
        iconsetKey,
        versions,
        iconClass: options['icon-class'] || '',
        iconClassFix: options['icon-class-fix'] || ''
    });

    if (checkOnly) {
        if (!fs.existsSync(options.out)) {
            throw new Error(`Iconset file not found at ${options.out}. Run without --check to generate it.`);
        }
        const current = fs.readFileSync(options.out, 'utf8');
        if (current !== fileContent) {
            throw new Error(`Iconset file ${options.out} is outdated. Run without --check to regenerate.`);
        }
        console.log(`✔ ${options.out} is up to date.`);
        console.log(`Free icons: ${freeIcons.length}`);
        console.log(`Pro icons: ${proIcons.length}`);
        return;
    }

    ensureDir(options.out);
    fs.writeFileSync(options.out, fileContent, 'utf8');

    console.log(`Generated ${options.out}`);
    console.log(`Free icons: ${freeIcons.length}`);
    console.log(`Pro icons: ${proIcons.length}`);
}

if (require.main === module) {
    try {
        main();
    }
    catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
