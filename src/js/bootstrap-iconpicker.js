/*!========================================================================
 * File: bootstrap-iconpicker.js
 * ======================================================================== */

;(function($){ "use strict";

    // ICONPICKER PUBLIC CLASS DEFINITION
    // ==============================
    var Iconpicker = function (element, options) {

        Iconpicker.popover.ensure();

      this.$element = $(element);
      this.options  = $.extend({}, Iconpicker.DEFAULTS, this.$element.data());
      this.options  = $.extend({}, this.options, options);

    };

    // ICONPICKER VERSION
    // ==============================
    Iconpicker.VERSION = '1.13.3';

    // ICONPICKER ICONSET_EMPTY
    // ==============================
    Iconpicker.ICONSET_EMPTY = {
        iconClass: '',
        iconClassFix: '',
        icons: []
    };

    // ICONPICKER ICONSET
    // ==============================
    Iconpicker.ICONSET = {
        _custom: null,
        elusiveicon: $.iconset_elusiveicon || Iconpicker.ICONSET_EMPTY,
        flagicon: $.iconset_flagicon || Iconpicker.ICONSET_EMPTY,
        fontawesome4: $.iconset_fontawesome_4 || Iconpicker.ICONSET_EMPTY,
        fontawesome5: $.iconset_fontawesome_5 || Iconpicker.ICONSET_EMPTY,
        fontawesome6: $.iconset_fontawesome_6 || Iconpicker.ICONSET_EMPTY,
        fontawesome7: $.iconset_fontawesome_7 || Iconpicker.ICONSET_EMPTY,
        glyphicon: $.iconset_glyphicon || Iconpicker.ICONSET_EMPTY,
        ionicon: $.iconset_ionicon || Iconpicker.ICONSET_EMPTY,
        mapicon: $.iconset_mapicon || Iconpicker.ICONSET_EMPTY,
        materialdesign: $.iconset_materialdesign || Iconpicker.ICONSET_EMPTY,
        octicon: $.iconset_octicon || Iconpicker.ICONSET_EMPTY,
        typicon: $.iconset_typicon || Iconpicker.ICONSET_EMPTY,
        weathericon: $.iconset_weathericon || Iconpicker.ICONSET_EMPTY
    };

    Iconpicker.bootstrapNamespace = function() {
        var namespace = null;
        if (typeof window !== 'undefined' && window.bootstrap) {
            namespace = window.bootstrap;
        }
        else if (typeof bootstrap !== 'undefined') {
            namespace = bootstrap;
        }
        return namespace;
    };

    Iconpicker.detectBootstrapVersion = function() {
        if (typeof Iconpicker._detectedBootstrapVersion !== 'undefined' && Iconpicker._detectedBootstrapVersion !== null) {
            return Iconpicker._detectedBootstrapVersion;
        }
        var version = null;
        if (typeof $.fn.popover !== 'undefined' && $.fn.popover.Constructor && $.fn.popover.Constructor.VERSION) {
            version = $.fn.popover.Constructor.VERSION;
        }
        else {
            var namespace = Iconpicker.bootstrapNamespace();
            if (namespace && namespace.Popover && namespace.Popover.VERSION) {
                version = namespace.Popover.VERSION;
            }
            else if (namespace && namespace.Tooltip && namespace.Tooltip.VERSION) {
                version = namespace.Tooltip.VERSION;
            }
        }
        if (version) {
            Iconpicker._detectedBootstrapVersion = version;
        }
        return version;
    };

    Iconpicker.bootstrapMajorVersion = function() {
        var version = Iconpicker.detectBootstrapVersion();
        if (!version) {
            return null;
        }
        var parts = version.split('.');
        return parts.length > 0 ? parts[0] : null;
    };

    Iconpicker.isBootstrap3 = function() {
        return Iconpicker.bootstrapMajorVersion() === '3';
    };

    Iconpicker.popover = {
        hasJquery: function() {
            return (typeof $.fn.popover === 'function') && !!($.fn.popover.Constructor);
        },
        hasNative: function() {
            var namespace = Iconpicker.bootstrapNamespace();
            return !!(namespace && typeof namespace.Popover === 'function');
        },
        ensure: function() {
            if (this.hasJquery() || this.hasNative()) {
                return true;
            }
            throw new TypeError('Bootstrap iconpicker require Bootstrap popover');
        },
        create: function($element, config) {
            this.ensure();
            if (this.hasJquery()) {
                $element.popover(config);
                return $element.data('bs.popover');
            }
            var namespace = Iconpicker.bootstrapNamespace();
            if (!namespace || typeof namespace.Popover !== 'function') {
                return null;
            }
            var options = $.extend({}, config);
            var content = config && config.content;
            if (content && content.jquery) {
                content = content[0];
            }
            if (options && typeof options.container === 'string' && typeof document !== 'undefined') {
                var containerCandidate = document.querySelector(options.container);
                if (containerCandidate) {
                    options.container = containerCandidate;
                }
                else if (options.container === 'body') {
                    options.container = document.body;
                }
            }
            if (typeof options.content !== 'function') {
                options.content = function() {
                    return content;
                };
            }
            if (typeof options.html === 'undefined') {
                options.html = true;
            }
            if (typeof options.sanitize === 'undefined') {
                options.sanitize = false;
            }
            if (typeof options.trigger === 'undefined') {
                options.trigger = 'manual';
            }
            var existing = (typeof namespace.Popover.getInstance === 'function') ? namespace.Popover.getInstance($element[0]) : null;
            if (existing && typeof existing.dispose === 'function') {
                existing.dispose();
            }
            return new namespace.Popover($element[0], options);
        },
        show: function($element) {
            if (this.hasJquery()) {
                $element.popover('show');
                return;
            }
            var namespace = Iconpicker.bootstrapNamespace();
            if (!namespace || typeof namespace.Popover !== 'function') {
                return;
            }
            var instance = (typeof namespace.Popover.getInstance === 'function') ? namespace.Popover.getInstance($element[0]) : null;
            if (instance && typeof instance.show === 'function') {
                instance.show();
                if (typeof instance.update === 'function') {
                    instance.update();
                }
            }
        },
        dispose: function($element) {
            if (this.hasJquery()) {
                var method = Iconpicker.isBootstrap3() ? 'destroy' : 'dispose';
                $element.popover(method);
                return;
            }
            var namespace = Iconpicker.bootstrapNamespace();
            if (!namespace || typeof namespace.Popover !== 'function') {
                return;
            }
            var instance = (typeof namespace.Popover.getInstance === 'function') ? namespace.Popover.getInstance($element[0]) : null;
            if (instance && typeof instance.dispose === 'function') {
                instance.dispose();
            }
        },
        getInstance: function($element) {
            if (this.hasJquery()) {
                return $element.data('bs.popover');
            }
            var namespace = Iconpicker.bootstrapNamespace();
            if (namespace && typeof namespace.Popover === 'function' && typeof namespace.Popover.getInstance === 'function') {
                return namespace.Popover.getInstance($element[0]);
            }
            return null;
        },
        getTipElement: function($element) {
            var instance = this.getInstance($element);
            if (!instance) {
                return $();
            }
            if (typeof instance.getTipElement === 'function') {
                return $(instance.getTipElement());
            }
            if (typeof instance.tip === 'function') {
                return $(instance.tip());
            }
            if (instance.tip) {
                return $(instance.tip);
            }
            return $();
        }
    };

    Iconpicker.PRO_ICON_SENTINELS = {
        fontawesome5: 'fal fa-tombstone',
        fontawesome6: 'fat fa-tombstone',
        fontawesome7: 'fat fa-tombstone'
    };

    $.each(Iconpicker.PRO_ICON_SENTINELS, function(name, sentinel) {
        if (Iconpicker.ICONSET[name] && typeof Iconpicker.ICONSET[name].proSentinel === 'undefined') {
            Iconpicker.ICONSET[name].proSentinel = sentinel;
        }
    });

    Iconpicker.versionTier = function(entry) {
        if (!entry || !entry.version) {
            return 'free';
        }
        return (entry.version.indexOf('_pro') !== -1 || entry.version.indexOf('-pro') !== -1) ? 'pro' : 'free';
    };

    Iconpicker.versionSortKey = function(version) {
        if (!version) {
            return '';
        }
        var core = version.replace(/[_-](pro|free)$/i, '');
        var padded = core.split('.').map(function(segment) {
            return ('000000' + segment).slice(-6);
        }).join('.');
        var tier = (version.indexOf('_pro') !== -1 || version.indexOf('-pro') !== -1) ? '1' : '0';
        return padded + '~' + tier;
    };

    Iconpicker.pickLatest = function(entries, tier) {
        if (!$.isArray(entries) || entries.length === 0) {
            return null;
        }
        var filtered = entries.filter(function(entry) {
            return tier ? Iconpicker.versionTier(entry) === tier : true;
        });
        if (filtered.length === 0) {
            return null;
        }
        filtered.sort(function(a, b) {
            var keyA = Iconpicker.versionSortKey(a.version);
            var keyB = Iconpicker.versionSortKey(b.version);
            if (keyA === keyB) {
                return 0;
            }
            return (keyA > keyB) ? -1 : 1;
        });
        return filtered[0];
    };

    // ICONPICKER DEFAULTS
    // ==============================
    Iconpicker.DEFAULTS = {
        align: 'center',
        arrowClass: 'btn-primary',
        arrowNextIconClass: 'fas fa-arrow-right',
        arrowPrevIconClass: 'fas fa-arrow-left',
        cols: 4,
    icon: '',
    iconset: 'fontawesome6',
    iconsetVersion: 'auto',
        header: true,
        labelHeader: '{0} / {1}',
        footer: true,
        labelFooter: '{0} - {1} of {2}',
        placement: 'bottom',
        rows: 4,
        search: true,
        searchText: 'Search icon',
        selectedClass: 'btn-warning',
        unselectedClass: 'btn-secondary'
    };

    // ICONPICKER PRIVATE METHODS
    // ==============================
    Iconpicker.prototype.bindEvents = function () {
        var op = this.options;
        var el = this;
        op.table.find('.btn-previous, .btn-next').off('click').on('click', function(e) {
            e.preventDefault();
            if(!$(this).hasClass('disabled')){
                var inc = parseInt($(this).val(), 10);
                el.changeList(op.page + inc);
            }
        });
        op.table.find('.btn-icon').off('click').on('click', function(e) {
            e.preventDefault();
            el.select($(this).val());
            if(op.inline === false){
                Iconpicker.popover.dispose(el.$element);
            }
            else{
                op.table.find("i[class$='" + $(this).val() + "']").parent().addClass(op.selectedClass);
            }
        });
        op.table.find('.search-control').off('keyup').on('keyup', function() {
            el.changeList(1);
        });
    };

    Iconpicker.prototype.changeList = function (page) {
        this.filterIcons();
        this.updateLabels(page);
        this.updateIcons(page);
        this.options.page = page;
        this.bindEvents();
    };

    Iconpicker.prototype.getIconsetVersion = function(iconset, requested, iconsetName) {
        var versionRequest = requested || 'auto';
        if (!iconset || !$.isArray(iconset.allVersions) || iconset.allVersions.length === 0) {
            if (versionRequest === 'auto') {
                return 'latest';
            }
            return (versionRequest === 'latest') ? 'latest' : versionRequest;
        }

        if (versionRequest && versionRequest !== 'auto' && versionRequest !== 'latest') {
            var directMatch = null;
            $.each(iconset.allVersions, function(_, entry) {
                if (entry.version === versionRequest) {
                    directMatch = entry;
                    return false;
                }
            });
            if (directMatch) {
                return directMatch.version;
            }
            var fallbackAny = Iconpicker.pickLatest(iconset.allVersions);
            return fallbackAny ? fallbackAny.version : versionRequest;
        }

        if (versionRequest === 'latest') {
            var latestAny = Iconpicker.pickLatest(iconset.allVersions);
            return latestAny ? latestAny.version : 'latest';
        }

        if (this.iconsetHasPro(iconset, iconsetName)) {
            var latestPro = Iconpicker.pickLatest(iconset.allVersions, 'pro');
            if (latestPro) {
                return latestPro.version;
            }
        }

        var latestFree = Iconpicker.pickLatest(iconset.allVersions, 'free') || Iconpicker.pickLatest(iconset.allVersions);
        return latestFree ? latestFree.version : 'latest';
    };

    Iconpicker.prototype.iconsetHasPro = function(iconset, iconsetName) {
        if (!iconset) {
            return false;
        }
        if (typeof iconset._hasProCache !== 'undefined') {
            return iconset._hasProCache;
        }
        var sentinel = iconset.proSentinel;
        if (!sentinel && iconsetName && Iconpicker.PRO_ICON_SENTINELS[iconsetName]) {
            sentinel = Iconpicker.PRO_ICON_SENTINELS[iconsetName];
        }
        if (!sentinel || typeof document === 'undefined' || !document.body) {
            iconset._hasProCache = false;
            return iconset._hasProCache;
        }
        var probe = document.createElement('i');
        probe.className = sentinel;
        probe.setAttribute('aria-hidden', 'true');
        probe.style.position = 'absolute';
        probe.style.opacity = '0';
        probe.style.pointerEvents = 'none';
        probe.style.fontSize = '1px';
        document.body.appendChild(probe);
        var hasGlyph = false;
        try {
            var pseudo = window.getComputedStyle(probe, '::before');
            if (pseudo && pseudo.content && pseudo.content !== 'none' && pseudo.content !== 'normal') {
                hasGlyph = true;
            }
            else {
                hasGlyph = (probe.offsetWidth > 0 || probe.offsetHeight > 0);
            }
        }
        catch (err) {
            hasGlyph = false;
        }
        if (probe.parentNode) {
            probe.parentNode.removeChild(probe);
        }
        iconset._hasProCache = hasGlyph;
        return iconset._hasProCache;
    };

    Iconpicker.prototype.getIconsForVersion = function(iconset, version) {
        if (!iconset) {
            return [];
        }
        if (!version || version === 'latest' || !$.isArray(iconset.allVersions) || iconset.allVersions.length === 0) {
            return iconset.icons || [];
        }
        var result = null;
        $.each(iconset.allVersions, function(_, entry) {
            if (entry.version === version) {
                result = entry.icons;
                return false;
            }
        });
        return result || iconset.icons || [];
    };

    Iconpicker.prototype.filterIcons = function () {
        var op = this.options;
        var search = op.table.find('.search-control').val();
    var iconsetData = Iconpicker.ICONSET[op.iconset] || Iconpicker.ICONSET_EMPTY;
    op.iconsetVersionResolved = this.getIconsetVersion(iconsetData, op.iconsetVersion, op.iconset);
    op.iconsetHasPro = this.iconsetHasPro(iconsetData, op.iconset);
        var icons = this.getIconsForVersion(iconsetData, op.iconsetVersionResolved);

        if (search === "") {
            op.icons = icons;
        }
        else {
            var result = [];
            $.each(icons, function(i, v) {
               if (v.toLowerCase().indexOf(search) > -1) {
                   result.push(v);
               }
            });
            op.icons = result;
        }
    };

    Iconpicker.prototype.removeAddClass = function (target, remove, add) {
        this.options.table.find(target).removeClass(remove).addClass(add);
        return add;
    };

    Iconpicker.prototype.reset = function () {
        this.updatePicker();
        this.changeList(1);
    };

    Iconpicker.prototype.select = function (icon) {
        var op = this.options;
        var el = this.$element;
        op.selected = $.inArray(icon.replace(op.iconClassFix, ''), op.icons);
        if (op.selected === -1) {
            op.selected = 0;
            icon = op.iconClassFix + op.icons[op.selected];
        }
        if (icon !== '' && op.selected >= 0) {
            op.icon = icon;
            if(op.inline === false){
                el.find('input').val(icon);
                el.find('i').attr('class', '').addClass(op.iconClass).addClass(icon);
            }
            if(icon === op.iconClassFix){
                el.trigger({ type: "change", icon: 'empty' });
            }
            else {
                el.trigger({ type: "change", icon: icon });
                el.find('input').val(icon);
            }
            op.table.find('button.' + op.selectedClass).removeClass(op.selectedClass);
        }
    };

    Iconpicker.prototype.switchPage = function (icon) {
        var op = this.options;
        op.selected = $.inArray(icon.replace(op.iconClassFix, ''), op.icons);

        if(op.selected >= 0) {
            var page = Math.ceil((op.selected + 1) / this.totalIconsPerPage());
            this.changeList(page);
        }
        if(icon === ''){
            //if(op.iconClassFix !== '')
                op.table.find('i.' + op.iconClassFix).parent().addClass(op.selectedClass);
            //else
        }
        else{
            op.table.find('i.' + icon).parent().addClass(op.selectedClass);
        }
    };

    Iconpicker.prototype.totalPages = function () {
        return Math.ceil(this.totalIcons() / this.totalIconsPerPage());
    };

    Iconpicker.prototype.totalIcons = function () {
        return this.options.icons.length;
    };

    Iconpicker.prototype.totalIconsPerPage = function () {
        if(this.options.rows === 0){
            return this.options.icons.length;
        }
        else{
            return this.options.cols * this.options.rows;
        }
    };

    Iconpicker.prototype.updateArrows = function (page) {
        var op = this.options;
        var total_pages = this.totalPages();
        if (page === 1) {
            op.table.find('.btn-previous').addClass('disabled');
        }
        else {
            op.table.find('.btn-previous').removeClass('disabled');
        }
        if (page === total_pages || total_pages === 0) {
            op.table.find('.btn-next').addClass('disabled');
        }
        else {
            op.table.find('.btn-next').removeClass('disabled');
        }
    };

    Iconpicker.prototype.updateIcons = function (page) {
        var op = this.options;
        var tbody = op.table.find('tbody').empty();
        var offset = (page - 1) * this.totalIconsPerPage();
        var length = op.rows;
        if(op.rows === 0){
            length = op.icons.length;
        }
        for (var i = 0; i < length; i++) {
            var tr = $('<tr></tr>');
            for (var j = 0; j < op.cols; j++) {
                var pos = offset + (i * op.cols) + j;
                var btn = $('<button class="btn ' + op.unselectedClass + ' btn-icon"></button>').hide();
                if (pos < op.icons.length) {
                    var v = op.iconClassFix + op.icons[pos];
                    btn.val(v).attr('title', v).append('<i class="' + op.iconClass + ' ' + v + '"></i>').show();
                    if (op.icon === v) {
                        btn.addClass(op.selectedClass).addClass('btn-icon-selected');
                    }
                }
                tr.append($('<td></td>').append(btn));
            }
            tbody.append(tr);
        }
    };

    Iconpicker.prototype.updateIconsCount = function () {
        var op = this.options;
        if(op.footer === true){
            var icons_count = [
                '<tr>',
                '   <td colspan="' + op.cols + '" class="text-center">',
                '       <span class="icons-count"></span>',
                '   </td>',
                '</tr>'
            ];
            op.table.find('tfoot').empty().append(icons_count.join(''));
        }
    };

    Iconpicker.prototype.updateLabels = function (page) {
        var op = this.options;
        var total_icons = this.totalIcons();
        var total_pages = this.totalPages();
        op.table.find('.page-count').html(op.labelHeader.replace('{0}', (total_pages === 0 ) ? 0 : page).replace('{1}', total_pages));
        var offset = (page - 1) * this.totalIconsPerPage();
        var total = page * this.totalIconsPerPage();
        op.table.find('.icons-count').html(op.labelFooter.replace('{0}', total_icons ? offset + 1 : 0).replace('{1}', (total < total_icons) ? total: total_icons).replace('{2}', total_icons));
        this.updateArrows(page);
    };

    Iconpicker.prototype.updatePagesCount = function () {
        var op = this.options;
        if(op.header === true){
            var tr = $('<tr></tr>');
            for (var i = 0; i < op.cols; i++) {
                var td = $('<td class="text-center"></td>');
                if (i === 0 || i === op.cols - 1) {
                    var arrow = [
                        '<button class="btn btn-arrow ' + ((i === 0) ? 'btn-previous' : 'btn-next') + ' ' + op.arrowClass + '" value="' + ((i === 0) ? -1 : 1) + '">',
                            '<span class="' + ((i === 0) ? op.arrowPrevIconClass : op.arrowNextIconClass) + '"></span>',
                        '</button>'
                    ];
                    td.append(arrow.join(''));
                    tr.append(td);
                }
                else if (tr.find('.page-count').length === 0) {
                    td.attr('colspan', op.cols - 2).append('<span class="page-count"></span>');
                    tr.append(td);
                }
            }
            op.table.find('thead').empty().append(tr);
        }
    };

    Iconpicker.prototype.updatePicker = function () {
        var op = this.options;
        if (op.cols < 4) {
            throw 'Iconpicker => The number of columns must be greater than or equal to 4. [option.cols = ' + op.cols + ']';
        }
        else if (op.rows < 0) {
            throw 'Iconpicker => The number of rows must be greater than or equal to 0. [option.rows = ' + op.rows + ']';
        }
        else {
            this.updatePagesCount();
            this.updateSearch();
            this.updateIconsCount();
        }
    };

    Iconpicker.prototype.updateSearch = function () {
        var op = this.options;
        var search = [
            '<tr>',
            '   <td colspan="' + op.cols + '">',
            '       <input type="text" class="form-control search-control" style="width: ' + op.cols * (Iconpicker.isBootstrap3() ? 39 : 41) + 'px;" placeholder="' + op.searchText + '">',
            '   </td>',
            '</tr>'
        ];
        search = $(search.join(''));
        if (op.search === true) {
            search.show();
        }
        else {
            search.hide();
        }
        op.table.find('thead').append(search);
    };

    // ICONPICKER PUBLIC METHODS
    // ==============================
    Iconpicker.prototype.setAlign = function (value) {
        this.$element.removeClass(this.options.align).addClass(value);
        this.options.align = value;
    };

    Iconpicker.prototype.setArrowClass = function (value) {
        this.options.arrowClass = this.removeAddClass('.btn-arrow', this.options.arrowClass, value);
    };

    Iconpicker.prototype.setArrowNextIconClass = function (value) {
        this.options.arrowNextIconClass = this.removeAddClass('.btn-next > span', this.options.arrowNextIconClass, value);
    };

    Iconpicker.prototype.setArrowPrevIconClass = function (value) {
        this.options.arrowPrevIconClass = this.removeAddClass('.btn-previous > span', this.options.arrowPrevIconClass, value);
    };

    Iconpicker.prototype.setCols = function (value) {
        this.options.cols = value;
        this.reset();
    };

    Iconpicker.prototype.setFooter = function (value) {
        var footer = this.options.table.find('tfoot');
        if (value === true) {
            footer.show();
        }
        else {
            footer.hide();
        }
        this.options.footer = value;
    };

    Iconpicker.prototype.setHeader = function (value) {
        var header = this.options.table.find('thead');
        if (value === true) {
            header.show();
        }
        else {
            header.hide();
        }
        this.options.header = value;
    };

    Iconpicker.prototype.setIcon = function (value) {
        this.select(value);
    };

    Iconpicker.prototype.setIconset = function (value) {
        var op = this.options;
        if ($.isPlainObject(value)) {
            Iconpicker.ICONSET._custom = $.extend(Iconpicker.ICONSET_EMPTY, value);
            op.iconset = '_custom';
        }
        else if (!Iconpicker.ICONSET.hasOwnProperty(value)) {
            op.iconset = Iconpicker.DEFAULTS.iconset;
        }
        else {
            op.iconset = value;
        }
        var iconsetData = Iconpicker.ICONSET[op.iconset];
        op = $.extend(op, iconsetData);
        op.iconsetVersionResolved = this.getIconsetVersion(iconsetData, op.iconsetVersion, op.iconset);
        this.reset();
        this.select(op.icon);
    };

    Iconpicker.prototype.setLabelHeader = function (value) {
        this.options.labelHeader = value;
        this.updateLabels(this.options.page);
    };

    Iconpicker.prototype.setLabelFooter = function (value) {
        this.options.labelFooter = value;
        this.updateLabels(this.options.page);
    };

    Iconpicker.prototype.setPlacement = function (value) {
        this.options.placement = value;
    };

    Iconpicker.prototype.setRows = function (value) {
        this.options.rows = value;
        this.reset();
    };

    Iconpicker.prototype.setSearch = function (value) {
        var search = this.options.table.find('.search-control');
        if (value === true) {
            search.show();
        }
        else {
            search.hide();
        }
        search.val('');
        this.changeList(1);
        this.options.search = value;
    };

    Iconpicker.prototype.setSearchText = function (value) {
        this.options.table.find('.search-control').attr('placeholder', value);
        this.options.searchText = value;
    };

    Iconpicker.prototype.setSelectedClass = function (value) {
        this.options.selectedClass = this.removeAddClass('.btn-icon-selected', this.options.selectedClass, value);
    };

    Iconpicker.prototype.setUnselectedClass = function (value) {
        this.options.unselectedClass = this.removeAddClass('.btn-icon', this.options.unselectedClass, value);
    };

    // ICONPICKER PLUGIN DEFINITION
    // ========================
    var old = $.fn.iconpicker;
    $.fn.iconpicker = function (option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.iconpicker');
            var options = typeof option === 'object' && option;
            if (!data) {
                $this.data('bs.iconpicker', (data = new Iconpicker(this, options)));
            }
            if (typeof option === 'string') {
                if (typeof data[option] === 'undefined') {
                    throw 'Iconpicker => The "' + option + '" method does not exists.';
                }
                else {
                    data[option](params);
                }
            }
            else{
                var op = data.options;
                op = $.extend(op, {
                    inline: false,
                    page: 1,
                    selected: -1,
                    table: $('<table class="table-icons"><thead></thead><tbody></tbody><tfoot></tfoot></table>')
                });
                var name = (typeof $this.attr('name') !== 'undefined') ? 'name="' + $this.attr('name') + '"' : '';

                if($this.prop('tagName') === 'BUTTON'){
                    $this.empty()
                        .append('<i></i>')
                        .append('<input type="hidden" ' + name + '></input>')
                        .append('<span class="caret"></span>')
                        .addClass('iconpicker ' + (Iconpicker.isBootstrap3() ? '' : 'dropdown-toggle'));
                    data.setIconset(op.iconset);
                    $this.on('click', function(e) {
                        e.preventDefault();
                        var popoverConfig = {
                            animation: false,
                            trigger: 'manual',
                            html: true,
                            content: op.table,
                            container: 'body',
                            placement: op.placement
                        };
                        Iconpicker.popover.dispose($this);
                        Iconpicker.popover.create($this, popoverConfig);
                        $this.off('inserted.bs.popover.iconpicker')
                            .on('inserted.bs.popover.iconpicker', function () {
                                var tip = Iconpicker.popover.getTipElement($this);
                                if (tip && tip.length) {
                                    tip.addClass('iconpicker-popover');
                                }
                            });
                        $this.off('shown.bs.popover.iconpicker')
                            .on('shown.bs.popover.iconpicker', function () {
                                data.switchPage(op.icon);
                                data.bindEvents();
                            });
                        //console.log($.fn.bsVersion());
                        Iconpicker.popover.show($this);
                    });
                }
                else{
                    op.inline = true;
                    data.setIconset(op.iconset);
                    $this.empty()
                        .append('<input type="hidden" ' + name + '></input>')
                        .append(op.table)
                        .addClass('iconpicker')
                        .addClass(op.align);
                    data.switchPage(op.icon);
                    data.bindEvents();
                }

            }
        });
    };

    $.fn.iconpicker.Constructor = Iconpicker;

    // ICONPICKER NO CONFLICT
    // ==================
    $.fn.iconpicker.noConflict = function () {
        $.fn.iconpicker = old;
        return this;
    };

    $.fn.bsVersion = function() {
        var major = Iconpicker.bootstrapMajorVersion();
        return major ? major + '.x' : 'unknown';
    };

    // ICONPICKER DATA-API
    // ===============
    $(document).on('click', 'body', function (e) {
        $('.iconpicker').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                Iconpicker.popover.dispose($(this));
            }
        });
    });

    $('button[role="iconpicker"],div[role="iconpicker"]').iconpicker();

})(jQuery);
