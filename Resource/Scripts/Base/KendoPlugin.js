
(function ($, undefined) {

    var SearchBox = kendo.ui.Widget.extend({
        isFunction: kendo.isFunction,
        init: function (element, options) {
            var that = this;

            //that.ns = '.kendoSearchBox';

            kendo.ui.Widget.fn.init.call(that, element, options);
            this._wrapper();
            this._input();

        },
        events: [
            'click',
            'valueChange',
            'textChange'
        ],
        options: {
            name: "SearchBox",
            enabled: true,
            dataTextField: "",
            dataValueField: "",
            dataText: '',
            dataValue: '',
            height: 200,
            width: '100%',
            icon: ""
        },
        oldvalue: {
            text: '',
            value: null,
        },
        newValue: {
            text: '',
            value: null
        },
        value: function (value) {
            if (value) {
                this.input.val(value[this.options.dataTextField]);

                eventData = { sender: this };

                this.trigger('valueChange', eventData);
            }
            else {
                return this.newValue;
            }
        },
        _wrapper: function () {
            var that = this,
                element = that.element,
                wrapper = element.parent();

            if (!wrapper.is("span.k-widget")) {
                wrapper = element.wrap("<span />").parent();
                wrapper[0].style.cssText = element[0].style.cssText;
            }

            that.wrapper = wrapper.addClass("k-widget k-combobox k-header")
                                  .addClass(element[0].className)
                                  .css("display", "");
        },
        _input: function () {
            var that = this,
                element = that.element[0],
                accessKey = element.accessKey,
                wrapper = that.wrapper,
                SELECTOR = "input.k-input.formSearchBox",
                //name = element.name || "",
                input;

            //if (name) {
            //    name = 'name="' + name + '_input" ';
            //}

            input = wrapper.find(SELECTOR);

            if (!input[0]) {
                that.element.addClass('k-input').addClass("formSearchBox");//.addClass("formSearchBox");
                if (!this.options.icon)
                    this.options.icon = "k-i-search";
                var span = $('<span tabindex="-1" unselectable="on" class="k-dropdown-wrap k-state-default"></span>')
                span.append(that.element).append('<span tabindex="-1" unselectable="on" class="k-select"><span unselectable="on" class="k-font-icon k-icon ' + this.options.icon + '">select</span></span>')
                wrapper.append(span)
            }


            var text = this.options.dataValue[this.options.dataTextField];

            input.addClass(element.className)
                 .val(text)
                 .css({
                     width: "100%",
                     height: element.style.height
                 })
                 .attr({
                     "role": "searchBox",
                     "aria-expanded": false
                 })
                 .show();

            input.bind('input', function () {

                that.trigger('textChange', input.val());
            });
            input.bind('change', function () {
                that.trigger('textChange', input.val());
            });

            if (accessKey) {
                element.accessKey = "";
                input[0].accessKey = accessKey;
            }

            that._focused = that.input = input;
            //that._inputWrapper = $(wrapper[0].firstChild);

            var btn = wrapper.find('.k-icon');

            that._arrow = btn.attr({
                "role": "button",
                "tabIndex": -1
            });

            btn.bind('click', function () {

                eventData = { sender: that };

                that.trigger('click', eventData);
            })

            wrapper.css('width', this.options.width);
        }

    });

    kendo.ui.plugin(SearchBox);
})(window.kendo.jQuery);

//Calendar
(function ($, undefined) {
    var kendo = window.kendo,
        support = kendo.support,
        ui = kendo.ui,
        Widget = ui.Widget,
        keys = kendo.keys,
        parse = kendo.parseDate,
        adjustDST = kendo.date.adjustDST,
        extractFormat = kendo._extractFormat,
        template = kendo.template,
        getCulture = kendo.getCulture,
        transitions = kendo.support.transitions,
        transitionOrigin = transitions ? transitions.css + "transform-origin" : "",
        cellTemplate = template('<td#=data.cssClass# role="gridcell"><a tabindex="-1" class="k-link" href="\\#" data-#=data.ns#value="#=data.dateString#">#=data.value#</a></td>', { useWithBlock: false }),
        emptyCellTemplate = template('<td role="gridcell">&nbsp;</td>', { useWithBlock: false }),
        browser = kendo.support.browser,
        isIE8 = browser.msie && browser.version < 9,
        ns = ".kendoCalendarEx",
        CLICK = "click" + ns,
        KEYDOWN_NS = "keydown" + ns,
        ID = "id",
        MIN = "min",
        LEFT = "left",
        SLIDE = "slideIn",
        MONTH = "month",
        CENTURY = "century",
        CHANGE = "change",
        NAVIGATE = "navigate",
        VALUE = "value",
        HOVER = "k-state-hover",
        DISABLED = "k-state-disabled",
        FOCUSED = "k-state-focused",
        OTHERMONTH = "k-other-month",
        OTHERMONTHCLASS = ' class="' + OTHERMONTH + '"',
        TODAY = "k-nav-today",
        CELLSELECTOR = "td:has(.k-link)",
        BLUR = "blur" + ns,
        FOCUS = "focus",
        FOCUS_WITH_NS = FOCUS + ns,
        MOUSEENTER = support.touch ? "touchstart" : "mouseenter",
        MOUSEENTER_WITH_NS = support.touch ? "touchstart" + ns : "mouseenter" + ns,
        MOUSELEAVE = support.touch ? "touchend" + ns + " touchmove" + ns : "mouseleave" + ns,
        MS_PER_MINUTE = 60000,
        MS_PER_DAY = 86400000,
        PREVARROW = "_prevArrow",
        NEXTARROW = "_nextArrow",
        ARIA_DISABLED = "aria-disabled",
        ARIA_SELECTED = "aria-selected",
        proxy = $.proxy,
        extend = $.extend,
        DATE = Date,
        views = {
            month: 0,
            year: 1,
            decade: 2,
            century: 3
        };

    var CalendarEx = Widget.extend({
        init: function (element, options) {
            var that = this, value, id;

            Widget.fn.init.call(that, element, options);
            that.options.weekCountTitle = options.weekCountTitle;
            element = that.wrapper = that.element;
            options = that.options;

            options.url = window.unescape(options.url);

            that._templates();

            that._header();

            that._footer(that.footer);

            id = element
                    .addClass("k-widget k-calendar")
                    .on(MOUSEENTER_WITH_NS + " " + MOUSELEAVE, CELLSELECTOR, mousetoggle)
                    .on(KEYDOWN_NS, "table.k-content", proxy(that._move, that))
                    .on(CLICK, CELLSELECTOR, function (e) {
                        var link = e.currentTarget.firstChild;

                        if (link.href.indexOf("#") != -1) {
                            e.preventDefault();
                        }

                        that._click($(link));
                    })
                    .on("mouseup" + ns, "table.k-content, .k-footer", function () {
                        that._focusView(that.options.focusOnNav !== false);
                    })
                    .attr(ID);

            if (id) {
                that._cellID = id + "_cell_selected";
            }

            normalize(options);
            value = parse(options.value, options.format, options.culture);

            that._index = views[options.start];
            that._current = new DATE(+restrictValue(value, options.min, options.max));

            that._addClassProxy = function () {
                that._active = true;
                that._cell.addClass(FOCUSED);
            };

            that._removeClassProxy = function () {
                that._active = false;
                that._cell.removeClass(FOCUSED);
            };

            that.value(value);

            kendo.notify(that);
        },

        options: {
            name: "CalendarEx",
            value: null,
            min: new DATE(1900, 0, 1),
            max: new DATE(2099, 11, 31),
            dates: [],
            url: "",
            culture: "",
            footer: "",
            format: "",
            month: {},
            start: MONTH,
            depth: MONTH,
            weekCountTitle: "",
            animation: {
                horizontal: {
                    effects: SLIDE,
                    reverse: true,
                    duration: 500,
                    divisor: 2
                },
                vertical: {
                    effects: "zoomIn",
                    duration: 400
                }
            }
        },

        events: [
            CHANGE,
            NAVIGATE
        ],

        setOptions: function (options) {
            var that = this;

            normalize(options);

            if (!options.dates[0]) {
                options.dates = that.options.dates;
            }

            Widget.fn.setOptions.call(that, options);

            that._templates();

            that._footer(that.footer);
            that._index = views[that.options.start];

            that.navigate();
        },

        destroy: function () {
            var that = this,
                today = that._today;

            that.element.off(ns);
            that._title.off(ns);
            that[PREVARROW].off(ns);
            that[NEXTARROW].off(ns);

            kendo.destroy(that._table);

            if (today) {
                kendo.destroy(today.off(ns));
            }

            Widget.fn.destroy.call(that);
        },

        current: function () {
            return this._current;
        },

        view: function () {
            return this._view;
        },

        focus: function (table) {
            table = table || this._table;
            this._bindTable(table);
            table.focus();
        },

        min: function (value) {
            return this._option(MIN, value);
        },

        max: function (value) {
            return this._option("max", value);
        },

        navigateToPast: function () {
            this._navigate(PREVARROW, -1);
        },

        navigateToFuture: function () {
            this._navigate(NEXTARROW, 1);
        },

        navigateUp: function () {
            var that = this,
                index = that._index;

            if (that._title.hasClass(DISABLED)) {
                return;
            }

            that.navigate(that._current, ++index);
        },

        navigateDown: function (value) {
            var that = this,
            index = that._index,
            depth = that.options.depth;

            if (!value) {
                return;
            }

            if (index === views[depth]) {
                if (+that._value != +value) {
                    that.value(value);
                    that.trigger(CHANGE);
                }
                return;
            }

            that.navigate(value, --index);
        },

        navigate: function (value, view) {
            view = isNaN(view) ? views[view] : view;

            var that = this,
                options = that.options,
                culture = options.culture,
                min = options.min,
                max = options.max,
                title = that._title,
                from = that._table,
                old = that._oldTable,
                selectedValue = that._value,
                currentValue = that._current,
                future = value && +value > +currentValue,
                vertical = view !== undefined && view !== that._index,
                to, currentView, compare,
                disabled;

            if (!value) {
                value = currentValue;
            }

            that._current = value = new DATE(+restrictValue(value, min, max));

            if (view === undefined) {
                view = that._index;
            } else {
                that._index = view;
            }

            that._view = currentView = calendar.views[view];
            compare = currentView.compare;

            disabled = view === views[CENTURY];
            title.toggleClass(DISABLED, disabled).attr(ARIA_DISABLED, disabled);

            disabled = compare(value, min) < 1;
            that[PREVARROW].toggleClass(DISABLED, disabled).attr(ARIA_DISABLED, disabled);

            disabled = compare(value, max) > -1;
            that[NEXTARROW].toggleClass(DISABLED, disabled).attr(ARIA_DISABLED, disabled);

            if (from && old && old.data("animating")) {
                old.kendoStop(true, true);
                from.kendoStop(true, true);
            }

            that._oldTable = from;

            if (!from || that._changeView) {
                title.html(currentView.title(value, min, max, culture));

                that._table = to = $(currentView.content(extend({
                    min: min,
                    max: max,
                    date: value,
                    url: options.url,
                    dates: options.dates,
                    format: options.format,
                    culture: culture,
                    weekCountTitle: that.options.weekCountTitle
                }, that[currentView.name])));

                makeUnselectable(to);

                that._animate({
                    from: from,
                    to: to,
                    vertical: vertical,
                    future: future
                });

                that._focus(value);
                that.trigger(NAVIGATE);
            }

            if (view === views[options.depth] && selectedValue) {
                that._class("k-state-selected", currentView.toDateString(selectedValue));
            }

            that._class(FOCUSED, currentView.toDateString(value));

            if (!from && that._cell) {
                that._cell.removeClass(FOCUSED);
            }

            that._changeView = true;
        },

        value: function (value) {
            var that = this,
            view = that._view,
            options = that.options,
            old = that._view,
            min = options.min,
            max = options.max;

            if (value === undefined) {
                return that._value;
            }

            value = parse(value, options.format, options.culture);

            if (value !== null) {
                value = new DATE(+value);

                if (!isInRange(value, min, max)) {
                    value = null;
                }
            }

            that._value = value;

            if (old && value === null && that._cell) {
                that._cell.removeClass("k-state-selected");
            } else {
                that._changeView = !value || view && view.compare(value, that._current) !== 0;
                that.navigate(value);
            }
        },

        _move: function (e) {
            var that = this,
                options = that.options,
                key = e.keyCode,
                view = that._view,
                index = that._index,
                currentValue = new DATE(+that._current),
                isRtl = kendo.support.isRtl(that.wrapper),
                value, prevent, method, temp;

            if (e.target === that._table[0]) {
                that._active = true;
            }

            if (e.ctrlKey) {
                if (key == keys.RIGHT && !isRtl || key == keys.LEFT && isRtl) {
                    that.navigateToFuture();
                    prevent = true;
                } else if (key == keys.LEFT && !isRtl || key == keys.RIGHT && isRtl) {
                    that.navigateToPast();
                    prevent = true;
                } else if (key == keys.UP) {
                    that.navigateUp();
                    prevent = true;
                } else if (key == keys.DOWN) {
                    that._click($(that._cell[0].firstChild));
                    prevent = true;
                }
            } else {
                if (key == keys.RIGHT && !isRtl || key == keys.LEFT && isRtl) {
                    value = 1;
                    prevent = true;
                } else if (key == keys.LEFT && !isRtl || key == keys.RIGHT && isRtl) {
                    value = -1;
                    prevent = true;
                } else if (key == keys.UP) {
                    value = index === 0 ? -7 : -4;
                    prevent = true;
                } else if (key == keys.DOWN) {
                    value = index === 0 ? 7 : 4;
                    prevent = true;
                } else if (key == keys.ENTER) {
                    that._click($(that._cell[0].firstChild));
                    prevent = true;
                } else if (key == keys.HOME || key == keys.END) {
                    method = key == keys.HOME ? "first" : "last";
                    temp = view[method](currentValue);
                    currentValue = new DATE(temp.getFullYear(), temp.getMonth(), temp.getDate(), currentValue.getHours(), currentValue.getMinutes(), currentValue.getSeconds(), currentValue.getMilliseconds());
                    prevent = true;
                } else if (key == keys.PAGEUP) {
                    prevent = true;
                    that.navigateToPast();
                } else if (key == keys.PAGEDOWN) {
                    prevent = true;
                    that.navigateToFuture();
                }

                if (value || method) {
                    if (!method) {
                        view.setDate(currentValue, value);
                    }

                    that._focus(restrictValue(currentValue, options.min, options.max));
                }
            }

            if (prevent) {
                e.preventDefault();
            }

            return that._current;
        },

        _animate: function (options) {
            var that = this,
                from = options.from,
                to = options.to,
                active = that._active;

            if (!from) {
                to.insertAfter(that.element[0].firstChild);
                that._bindTable(to);
            } else if (from.parent().data("animating")) {
                from.off(ns);
                from.parent().kendoStop(true, true).remove();
                from.remove();

                to.insertAfter(that.element[0].firstChild);
                that._focusView(active);
            } else if (!from.is(":visible") || that.options.animation === false) {
                to.insertAfter(from);
                from.off(ns).remove();

                that._focusView(active);
            } else {
                that[options.vertical ? "_vertical" : "_horizontal"](from, to, options.future);
            }
        },

        _horizontal: function (from, to, future) {
            var that = this,
                active = that._active,
                horizontal = that.options.animation.horizontal,
                effects = horizontal.effects,
                viewWidth = from.outerWidth();

            if (effects && effects.indexOf(SLIDE) != -1) {
                from.add(to).css({ width: viewWidth });

                from.wrap("<div/>");

                that._focusView(active, from);

                from.parent()
                    .css({
                        position: "relative",
                        width: viewWidth * 2,
                        "float": LEFT,
                        "margin-left": future ? 0 : -viewWidth
                    });

                to[future ? "insertAfter" : "insertBefore"](from);

                extend(horizontal, {
                    effects: SLIDE + ":" + (future ? "right" : LEFT),
                    complete: function () {
                        from.off(ns).remove();
                        that._oldTable = null;

                        to.unwrap();

                        that._focusView(active);

                    }
                });

                from.parent().kendoStop(true, true).kendoAnimate(horizontal);
            }
        },

        _vertical: function (from, to) {
            var that = this,
                vertical = that.options.animation.vertical,
                effects = vertical.effects,
                active = that._active, //active state before from's blur
                cell, position;

            if (effects && effects.indexOf("zoom") != -1) {
                to.css({
                    position: "absolute",
                    top: from.prev().outerHeight(),
                    left: 0
                }).insertBefore(from);

                if (transitionOrigin) {
                    cell = that._cellByDate(that._view.toDateString(that._current));
                    position = cell.position();
                    position = (position.left + parseInt(cell.width() / 2, 10)) + "px" + " " + (position.top + parseInt(cell.height() / 2, 10) + "px");
                    to.css(transitionOrigin, position);
                }

                from.kendoStop(true, true).kendoAnimate({
                    effects: "fadeOut",
                    duration: 600,
                    complete: function () {
                        from.off(ns).remove();
                        that._oldTable = null;

                        to.css({
                            position: "static",
                            top: 0,
                            left: 0
                        });

                        that._focusView(active);
                    }
                });

                to.kendoStop(true, true).kendoAnimate(vertical);
            }
        },

        _cellByDate: function (value) {
            return this._table.find("td:not(." + OTHERMONTH + ")")
                       .filter(function () {
                           return $(this.firstChild).attr(kendo.attr(VALUE)) === value;
                       });
        },

        _class: function (className, value) {
            var that = this,
                id = that._cellID,
                cell = that._cell;

            if (cell) {
                cell.removeAttr(ARIA_SELECTED)
                    .removeAttr("aria-label")
                    .removeAttr(ID);
            }

            cell = that._table
                       .find("td:not(." + OTHERMONTH + ")")
                       .removeClass(className)
                       .filter(function () {
                           return $(this.firstChild).attr(kendo.attr(VALUE)) === value;
                       })
                       .attr(ARIA_SELECTED, true);

            if (className === FOCUSED && !that._active && that.options.focusOnNav !== false) {
                className = "";
            }

            cell.addClass(className);

            if (cell[0]) {
                that._cell = cell;
            }

            if (id) {
                cell.attr(ID, id);
                that._table.removeAttr("aria-activedescendant").attr("aria-activedescendant", id);
            }
        },

        _bindTable: function (table) {
            table
                .on(FOCUS_WITH_NS, this._addClassProxy)
                .on(BLUR, this._removeClassProxy);
        },

        _click: function (link) {
            var that = this,
                options = that.options,
                currentValue = new Date(+that._current),
                value = link.attr(kendo.attr(VALUE)).split("/");

            //Safari cannot create correctly date from "1/1/2090"
            value = new DATE(value[0], value[1], value[2]);
            adjustDST(value, 0);

            that._view.setDate(currentValue, value);

            that.navigateDown(restrictValue(currentValue, options.min, options.max));
        },

        _focus: function (value) {
            var that = this,
                view = that._view;

            if (view.compare(value, that._current) !== 0) {
                that.navigate(value);
            } else {
                that._current = value;
                that._class(FOCUSED, view.toDateString(value));
            }
        },

        _focusView: function (active, table) {
            if (active) {
                this.focus(table);
            }
        },

        _footer: function (template) {
            var that = this,
                today = getToday(),
                element = that.element,
                footer = element.find(".k-footer");

            if (!template) {
                that._toggle(false);
                footer.hide();
                return;
            }

            if (!footer[0]) {
                footer = $('<div class="k-footer"><a href="#" class="k-link k-nav-today"></a></div>').appendTo(element);
            }

            that._today = footer.show()
                                .find(".k-link")
                                .html(template(today))
                                .attr("title", kendo.toString(today, "D", that.options.culture));

            that._toggle();
        },

        _header: function () {
            var that = this,
            element = that.element,
            links;

            if (!element.find(".k-header")[0]) {
                element.html('<div class="k-header">' +
                             '<a href="#" role="button" class="k-link k-nav-prev"><span class="k-icon k-i-arrow-w"></span></a>' +
                             '<a href="#" role="button" aria-live="assertive" aria-atomic="true" class="k-link k-nav-fast"></a>' +
                             '<a href="#" role="button" class="k-link k-nav-next"><span class="k-icon k-i-arrow-e"></span></a>' +
                             '</div>');
            }

            links = element.find(".k-link")
                           .on(MOUSEENTER_WITH_NS + " " + MOUSELEAVE + " " + FOCUS_WITH_NS + " " + BLUR, mousetoggle)
                           .click(false);

            that._title = links.eq(1).on(CLICK, function () { that._active = that.options.focusOnNav !== false; that.navigateUp(); });
            that[PREVARROW] = links.eq(0).on(CLICK, function () { that._active = that.options.focusOnNav !== false; that.navigateToPast(); });
            that[NEXTARROW] = links.eq(2).on(CLICK, function () { that._active = that.options.focusOnNav !== false; that.navigateToFuture(); });
        },

        _navigate: function (arrow, modifier) {
            var that = this,
                index = that._index + 1,
                currentValue = new DATE(+that._current);

            arrow = that[arrow];

            if (!arrow.hasClass(DISABLED)) {
                if (index > 3) {
                    currentValue.setFullYear(currentValue.getFullYear() + 100 * modifier);
                } else {
                    calendar.views[index].setDate(currentValue, modifier);
                }

                that.navigate(currentValue);
            }
        },

        _option: function (option, value) {
            var that = this,
                options = that.options,
                currentValue = that._value || that._current,
                isBigger;

            if (value === undefined) {
                return options[option];
            }

            value = parse(value, options.format, options.culture);

            if (!value) {
                return;
            }

            options[option] = new DATE(+value);

            if (option === MIN) {
                isBigger = value > currentValue;
            } else {
                isBigger = currentValue > value;
            }

            if (isBigger || isEqualMonth(currentValue, value)) {
                if (isBigger) {
                    that._value = null;
                }
                that._changeView = true;
            }

            if (!that._changeView) {
                that._changeView = !!(options.month.content || options.month.empty);
            }

            that.navigate(that._value);

            that._toggle();
        },

        _toggle: function (toggle) {
            var that = this,
                options = that.options,
                link = that._today;

            if (toggle === undefined) {
                toggle = isInRange(getToday(), options.min, options.max);
            }

            if (link) {
                link.off(CLICK);

                if (toggle) {
                    link.addClass(TODAY)
                        .removeClass(DISABLED)
                        .on(CLICK, proxy(that._todayClick, that));
                } else {
                    link.removeClass(TODAY)
                        .addClass(DISABLED)
                        .on(CLICK, prevent);
                }
            }
        },

        _todayClick: function (e) {
            var that = this,
                depth = views[that.options.depth],
                today = getToday();

            e.preventDefault();

            if (that._view.compare(that._current, today) === 0 && that._index == depth) {
                that._changeView = false;
            }

            that._value = today;
            that.navigate(today, depth);

            that.trigger(CHANGE);
        },

        _templates: function () {
            var that = this,
                options = that.options,
                footer = options.footer,
                month = options.month,
                content = month.content,
                empty = month.empty;

            that.month = {
                content: template('<td#=data.cssClass# role="gridcell"><a tabindex="-1" class="k-link#=data.linkClass#" href="#=data.url#" ' + kendo.attr("value") + '="#=data.dateString#" title="#=data.title#">' + (content || "#=data.value#") + '</a></td>', { useWithBlock: !!content }),
                empty: template('<td role="gridcell">' + (empty || "&nbsp;") + "</td>", { useWithBlock: !!empty })
            };

            that.footer = footer !== false ? template(footer || '#= kendo.toString(data,"D","' + options.culture + '") #', { useWithBlock: false }) : null;
        }
    });

    ui.plugin(CalendarEx);

    var calendar = {
        firstDayOfMonth: function (date) {
            return new DATE(
                date.getFullYear(),
                date.getMonth(),
                1
            );
        },

        firstVisibleDay: function (date, calendarInfo) {
            calendarInfo = calendarInfo || kendo.culture().calendar;

            var firstDay = calendarInfo.firstDay,
            firstVisibleDay = new DATE(date.getFullYear(), date.getMonth(), 0, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

            while (firstVisibleDay.getDay() != firstDay) {
                calendar.setTime(firstVisibleDay, -1 * MS_PER_DAY);
            }

            return firstVisibleDay;
        },

        setTime: function (date, time) {
            var tzOffsetBefore = date.getTimezoneOffset(),
            resultDATE = new DATE(date.getTime() + time),
            tzOffsetDiff = resultDATE.getTimezoneOffset() - tzOffsetBefore;

            date.setTime(resultDATE.getTime() + tzOffsetDiff * MS_PER_MINUTE);
        },
        views:
            [{
                name: MONTH,
                title: function (date, min, max, culture) {
                    return getCalendarInfo(culture).months.names[date.getMonth()] + " " + date.getFullYear();
                },
                content: function (options) {
                    var that = this,
                    idx = 0,
                    min = options.min,
                    max = options.max,
                    date = options.date,
                    dates = options.dates,
                    format = options.format,
                    culture = options.culture,
                    navigateUrl = options.url,
                    hasUrl = navigateUrl && dates[0],
                    currentCalendar = getCalendarInfo(culture),
                    firstDayIdx = currentCalendar.firstDay,
                    days = currentCalendar.days,
                    names = shiftArray(days.names, firstDayIdx),
                    shortNames = shiftArray(days.namesShort, firstDayIdx),
                    start = calendar.firstVisibleDay(date, currentCalendar),
                    firstDayOfMonth = that.first(date),
                    lastDayOfMonth = that.last(date),
                    toDateString = that.toDateString,
                    today = new DATE(),
                    html = '<table tabindex="0" role="grid" class="k-content" cellspacing="0"><thead><tr role="row">';

                    html += '<th style="width:30px;">' + options.weekCountTitle + '</th>';

                    for (; idx < 7; idx++) {
                        html += '<th scope="col" title="' + names[idx] + '">' + shortNames[idx] + '</th>';
                    }

                    today = new DATE(today.getFullYear(), today.getMonth(), today.getDate());
                    adjustDST(today, 0);
                    today = +today;

                    return view({
                        cells: 42,
                        perRow: 7,
                        html: html += '</tr></thead><tbody><tr role="row">',
                        start: start,
                        min: new DATE(min.getFullYear(), min.getMonth(), min.getDate()),
                        max: new DATE(max.getFullYear(), max.getMonth(), max.getDate()),
                        content: options.content,
                        empty: options.empty,
                        setter: that.setDate,
                        build: function (date) {

                            var cssClass = [],
                                day = date.getDay(),
                                linkClass = "",
                                url = "#";

                            if (date < firstDayOfMonth || date > lastDayOfMonth) {
                                cssClass.push(OTHERMONTH);
                            }

                            if (+date === today) {
                                cssClass.push("k-today");
                            }

                            if (day === 0 || day === 6) {
                                cssClass.push("k-weekend");
                            }

                            if (hasUrl && inArray(+date, dates)) {
                                url = navigateUrl.replace("{0}", kendo.toString(date, format, culture));
                                linkClass = " k-action-link";
                            }

                            return {
                                date: date,
                                dates: dates,
                                ns: kendo.ns,
                                title: kendo.toString(date, "D", culture),
                                value: date.getDate(),
                                dateString: toDateString(date),
                                cssClass: cssClass[0] ? ' class="' + cssClass.join(" ") + '"' : "",
                                linkClass: linkClass,
                                url: url
                            };
                        }
                    });
                },
                first: function (date) {
                    return calendar.firstDayOfMonth(date);
                },
                last: function (date) {
                    var last = new DATE(date.getFullYear(), date.getMonth() + 1, 0),
                        first = calendar.firstDayOfMonth(date),
                        timeOffset = Math.abs(last.getTimezoneOffset() - first.getTimezoneOffset());

                    if (timeOffset) {
                        last.setHours(first.getHours() + (timeOffset / 60));
                    }

                    return last;
                },
                compare: function (date1, date2) {
                    var result,
                    month1 = date1.getMonth(),
                    year1 = date1.getFullYear(),
                    month2 = date2.getMonth(),
                    year2 = date2.getFullYear();

                    if (year1 > year2) {
                        result = 1;
                    } else if (year1 < year2) {
                        result = -1;
                    } else {
                        result = month1 == month2 ? 0 : month1 > month2 ? 1 : -1;
                    }

                    return result;
                },
                setDate: function (date, value) {
                    var hours = date.getHours();
                    if (value instanceof DATE) {
                        date.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
                    } else {
                        calendar.setTime(date, value * MS_PER_DAY);
                    }
                    adjustDST(date, hours);
                },
                toDateString: function (date) {
                    return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
                }
            },
        {
            name: "year",
            title: function (date) {
                return date.getFullYear();
            },
            content: function (options) {
                var namesAbbr = getCalendarInfo(options.culture).months.namesAbbr,
                toDateString = this.toDateString,
                min = options.min,
                max = options.max;

                return view({
                    min: new DATE(min.getFullYear(), min.getMonth(), 1),
                    max: new DATE(max.getFullYear(), max.getMonth(), 1),
                    start: new DATE(options.date.getFullYear(), 0, 1),
                    setter: this.setDate,
                    build: function (date) {
                        return {
                            value: namesAbbr[date.getMonth()],
                            ns: kendo.ns,
                            dateString: toDateString(date),
                            cssClass: ""
                        };
                    }
                });
            },
            first: function (date) {
                return new DATE(date.getFullYear(), 0, date.getDate());
            },
            last: function (date) {
                return new DATE(date.getFullYear(), 11, date.getDate());
            },
            compare: function (date1, date2) {
                return compare(date1, date2);
            },
            setDate: function (date, value) {
                var month,
                    hours = date.getHours();

                if (value instanceof DATE) {
                    month = value.getMonth();

                    date.setFullYear(value.getFullYear(), month, date.getDate());

                    if (month !== date.getMonth()) {
                        date.setDate(0);
                    }
                } else {
                    month = date.getMonth() + value;

                    date.setMonth(month);

                    if (month > 11) {
                        month -= 12;
                    }

                    if (month > 0 && date.getMonth() != month) {
                        date.setDate(0);
                    }
                }

                adjustDST(date, hours);
            },
            toDateString: function (date) {
                return date.getFullYear() + "/" + date.getMonth() + "/1";
            }
        },
        {
            name: "decade",
            title: function (date, min, max) {
                return title(date, min, max, 10);
            },
            content: function (options) {
                var year = options.date.getFullYear(),
                toDateString = this.toDateString;

                return view({
                    start: new DATE(year - year % 10 - 1, 0, 1),
                    min: new DATE(options.min.getFullYear(), 0, 1),
                    max: new DATE(options.max.getFullYear(), 0, 1),
                    setter: this.setDate,
                    build: function (date, idx) {
                        return {
                            value: date.getFullYear(),
                            ns: kendo.ns,
                            dateString: toDateString(date),
                            cssClass: idx === 0 || idx == 11 ? OTHERMONTHCLASS : ""
                        };
                    }
                });
            },
            first: function (date) {
                var year = date.getFullYear();
                return new DATE(year - year % 10, date.getMonth(), date.getDate());
            },
            last: function (date) {
                var year = date.getFullYear();
                return new DATE(year - year % 10 + 9, date.getMonth(), date.getDate());
            },
            compare: function (date1, date2) {
                return compare(date1, date2, 10);
            },
            setDate: function (date, value) {
                setDate(date, value, 1);
            },
            toDateString: function (date) {
                return date.getFullYear() + "/0/1";
            }
        },
        {
            name: CENTURY,
            title: function (date, min, max) {
                return title(date, min, max, 100);
            },
            content: function (options) {
                var year = options.date.getFullYear(),
                min = options.min.getFullYear(),
                max = options.max.getFullYear(),
                toDateString = this.toDateString,
                minYear = min,
                maxYear = max;

                minYear = minYear - minYear % 10;
                maxYear = maxYear - maxYear % 10;

                if (maxYear - minYear < 10) {
                    maxYear = minYear + 9;
                }

                return view({
                    start: new DATE(year - year % 100 - 10, 0, 1),
                    min: new DATE(minYear, 0, 1),
                    max: new DATE(maxYear, 0, 1),
                    setter: this.setDate,
                    build: function (date, idx) {
                        var start = date.getFullYear(),
                            end = start + 9;

                        if (start < min) {
                            start = min;
                        }

                        if (end > max) {
                            end = max;
                        }

                        return {
                            ns: kendo.ns,
                            value: start + " - " + end,
                            dateString: toDateString(date),
                            cssClass: idx === 0 || idx == 11 ? OTHERMONTHCLASS : ""
                        };
                    }
                });
            },
            first: function (date) {
                var year = date.getFullYear();
                return new DATE(year - year % 100, date.getMonth(), date.getDate());
            },
            last: function (date) {
                var year = date.getFullYear();
                return new DATE(year - year % 100 + 99, date.getMonth(), date.getDate());
            },
            compare: function (date1, date2) {
                return compare(date1, date2, 100);
            },
            setDate: function (date, value) {
                setDate(date, value, 10);
            },
            toDateString: function (date) {
                var year = date.getFullYear();
                return (year - year % 10) + "/0/1";
            }
        }]
    };

    function title(date, min, max, modular) {
        var start = date.getFullYear(),
            minYear = min.getFullYear(),
            maxYear = max.getFullYear(),
            end;

        start = start - start % modular;
        end = start + (modular - 1);

        if (start < minYear) {
            start = minYear;
        }
        if (end > maxYear) {
            end = maxYear;
        }

        return start + "-" + end;
    }

    function view(options) {
        var idx = 0,
            data,
            min = options.min,
            max = options.max,
            start = options.start,
            setter = options.setter,
            build = options.build,
            length = options.cells || 12,
            cellsPerRow = options.perRow || 4,
            content = options.content || cellTemplate,
            empty = options.empty || emptyCellTemplate,
            html = options.html || '<table tabindex="0" role="grid" class="k-content k-meta-view" cellspacing="0"><tbody><tr role="row">';
        var index = 0;
        var currentMonth = false;
        for (; idx < length; idx++) {
            start = new DATE(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
            adjustDST(start, 0);

            data = build(start, idx);
            function getWeekCount(temp) {
                var date = new Date(temp);
                var Year = date.getYear();
                var Month = date.getMonth();
                var Day = date.getDate();

                var d1 = new Date(Year, Month, Day);
                var d2 = new Date(Year, 0, 1);
                var d = Math.round((d1 - d2) / 86400000);
                var day = d2.getDay(); if (day == 0) day = 7;
                var week = Math.ceil((d + day) / 7);
                return week;
            }
            if (idx % cellsPerRow === 0) {

                if (idx > 0)
                    html += '</tr><tr role="row">';
                if (cellsPerRow == 7 && length == 42) {

                    if (!currentMonth) {
                        var validDate;
                        if (data.cssClass.indexOf(OTHERMONTH) >= 0 && data.value > 15) {
                            var month = data.date.getMonth();
                            var year = data.date.getYear();
                            if (month = 11)
                                year++;
                            var date = new Date(year, (month + 1) % 12, 1);
                            if ((date - data.date) <= 86400000 * 6) {
                                currentMonth = true;
                                validDate = date
                            }
                            else {
                                validDate = data.date;
                            }
                        } else {
                            validDate = data.date;
                        }
                        index = getWeekCount(validDate);

                    }


                    html += '<td style="text-align: center;">' + index + '</td>';
                    index++;
                }
            }

            html += isInRange(start, min, max) ? content(data) : empty(data);

            setter(start, 1);
        }

        return html + "</tr></tbody></table>";
    }

    function compare(date1, date2, modifier) {
        var year1 = date1.getFullYear(),
            start = date2.getFullYear(),
            end = start,
            result = 0;

        if (modifier) {
            start = start - start % modifier;
            end = start - start % modifier + modifier - 1;
        }

        if (year1 > end) {
            result = 1;
        } else if (year1 < start) {
            result = -1;
        }

        return result;
    }

    function getToday() {
        var today = new DATE();
        return new DATE(today.getFullYear(), today.getMonth(), today.getDate());
    }

    function restrictValue(value, min, max) {
        var today = getToday();

        if (value) {
            today = new DATE(+value);
        }

        if (min > today) {
            today = new DATE(+min);
        } else if (max < today) {
            today = new DATE(+max);
        }
        return today;
    }

    function isInRange(date, min, max) {
        return +date >= +min && +date <= +max;
    }

    function shiftArray(array, idx) {
        return array.slice(idx).concat(array.slice(0, idx));
    }

    function setDate(date, value, multiplier) {
        value = value instanceof DATE ? value.getFullYear() : date.getFullYear() + multiplier * value;
        date.setFullYear(value);
    }

    function mousetoggle(e) {
        $(this).toggleClass(HOVER, MOUSEENTER.indexOf(e.type) > -1 || e.type == FOCUS);
    }

    function prevent(e) {
        e.preventDefault();
    }

    function getCalendarInfo(culture) {
        return getCulture(culture).calendars.standard;
    }

    function normalize(options) {
        var start = views[options.start],
            depth = views[options.depth],
            culture = getCulture(options.culture);

        options.format = extractFormat(options.format || culture.calendars.standard.patterns.d);

        if (isNaN(start)) {
            start = 0;
            options.start = MONTH;
        }

        if (depth === undefined || depth > start) {
            options.depth = MONTH;
        }

        if (!options.dates) {
            options.dates = [];
        }
    }

    function makeUnselectable(element) {
        if (isIE8) {
            element.find("*").attr("unselectable", "on");
        }
    }

    function inArray(date, dates) {
        for (var i = 0, length = dates.length; i < length; i++) {
            if (date === +dates[i]) {
                return true;
            }
        }
        return false;
    }

    function isEqualDatePart(value1, value2) {
        if (value1) {
            return value1.getFullYear() === value2.getFullYear() &&
                   value1.getMonth() === value2.getMonth() &&
                   value1.getDate() === value2.getDate();
        }

        return false;
    }

    function isEqualMonth(value1, value2) {
        if (value1) {
            return value1.getFullYear() === value2.getFullYear() &&
                   value1.getMonth() === value2.getMonth();
        }

        return false;
    }

    calendar.isEqualDatePart = isEqualDatePart;
    calendar.makeUnselectable = makeUnselectable;
    calendar.restrictValue = restrictValue;
    calendar.isInRange = isInRange;
    calendar.normalize = normalize;
    calendar.viewsEnum = views;

    kendo.calendarEx = calendar;
})(window.kendo.jQuery);

//DatePicker
(function ($, undefined) {
    var kendo = window.kendo,
    ui = kendo.ui,
    Widget = ui.Widget,
    parse = kendo.parseDate,
    keys = kendo.keys,
    template = kendo.template,
    activeElement = kendo._activeElement,
    DIV = "<div />",
    SPAN = "<span />",
    ns = ".kendoDatePickerEx",
    CLICK = "click" + ns,
    OPEN = "open",
    CLOSE = "close",
    CHANGE = "change",
    DISABLED = "disabled",
    READONLY = "readonly",
    DEFAULT = "k-state-default",
    FOCUSED = "k-state-focused",
    SELECTED = "k-state-selected",
    STATEDISABLED = "k-state-disabled",
    HOVER = "k-state-hover",
    HOVEREVENTS = "mouseenter" + ns + " mouseleave" + ns,
    MOUSEDOWN = "mousedown" + ns,
    ID = "id",
    MIN = "min",
    MAX = "max",
    MONTH = "month",
    ARIA_DISABLED = "aria-disabled",
    ARIA_EXPANDED = "aria-expanded",
    ARIA_HIDDEN = "aria-hidden",
    ARIA_READONLY = "aria-readonly",
    calendar = kendo.calendarEx,
    isInRange = calendar.isInRange,
    restrictValue = calendar.restrictValue,
    isEqualDatePart = calendar.isEqualDatePart,
    extend = $.extend,
    proxy = $.proxy,
    DATE = Date;

    function normalize(options) {
        var parseFormats = options.parseFormats,
            format = options.format;

        calendar.normalize(options);


        parseFormats = $.isArray(parseFormats) ? parseFormats : [parseFormats];

        if (!parseFormats.length) {
            parseFormats.push("yyyy-MM-dd");
        }

        if ($.inArray(format, parseFormats) === -1) {
            parseFormats.splice(0, 0, options.format);
        }

        options.parseFormats = parseFormats;
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    var DateView = function (options) {
        var that = this, id,
            body = document.body,
            div = $(DIV).attr(ARIA_HIDDEN, "true")
                        .addClass("k-calendar-container")
                        .appendTo(body);

        that.options = options = options || {};
        id = options.id;

        if (id) {
            id += "_dateview";

            div.attr(ID, id);
            that._dateViewID = id;
        }

        that.popup = new ui.Popup(div, extend(options.popup, options, { name: "Popup", isRtl: kendo.support.isRtl(options.anchor) }));
        that.div = div;

        that.value(options.value);
    };

    DateView.prototype = {
        _calendar: function () {
            var that = this;
            var calendar = that.calendar;
            var options = that.options;
            var div;

            if (!calendar) {
                div = $(DIV).attr(ID, kendo.guid())
                            .appendTo(that.popup.element)
                            .on(MOUSEDOWN, preventDefault)
                            .on(CLICK, "td:has(.k-link)", proxy(that._click, that));

                that.calendar = calendar = new ui.CalendarEx(div, that.options);
                that._setOptions(options);

                kendo.calendarEx.makeUnselectable(calendar.element);

                calendar.navigate(that._value || that._current, options.start);

                that.value(that._value);
            }
        },

        _setOptions: function (options) {
            this.calendar.setOptions({
                focusOnNav: false,
                change: options.change,
                culture: options.culture,
                dates: options.dates,
                depth: options.depth,
                footer: options.footer,
                format: options.format,
                max: options.max,
                min: options.min,
                month: options.month,
                start: options.start
            });
        },

        setOptions: function (options) {
            var old = this.options;

            this.options = extend(old, options, {
                change: old.change,
                close: old.close,
                open: old.open
            });

            if (this.calendar) {
                this._setOptions(this.options);
            }
        },

        destroy: function () {
            this.popup.destroy();
        },

        open: function () {
            var that = this;

            that._calendar();
            that.popup.open();
        },

        close: function () {
            this.popup.close();
        },

        min: function (value) {
            this._option(MIN, value);
        },

        max: function (value) {
            this._option(MAX, value);
        },

        toggle: function () {
            var that = this;

            that[that.popup.visible() ? CLOSE : OPEN]();
        },

        move: function (e) {
            var that = this,
                key = e.keyCode,
                calendar = that.calendar,
                selectIsClicked = e.ctrlKey && key == keys.DOWN || key == keys.ENTER,
                handled = false;

            if (e.altKey) {
                if (key == keys.DOWN) {
                    that.open();
                    e.preventDefault();
                    handled = true;
                } else if (key == keys.UP) {
                    that.close();
                    e.preventDefault();
                    handled = true;
                }

            } else if (that.popup.visible()) {

                if (key == keys.ESC || (selectIsClicked && calendar._cell.hasClass(SELECTED))) {
                    that.close();
                    e.preventDefault();
                    return true;
                }

                that._current = calendar._move(e);
                handled = true;
            }

            return handled;
        },

        current: function (date) {
            this._current = date;
            this.calendar._focus(date);
        },

        value: function (value) {
            var that = this,
                calendar = that.calendar,
                options = that.options;

            that._value = value;
            that._current = new DATE(+restrictValue(value, options.min, options.max));

            if (calendar) {
                calendar.value(value);
            }
        },

        _click: function (e) {
            if (e.currentTarget.className.indexOf(SELECTED) !== -1) {
                this.close();
            }
        },

        _option: function (option, value) {
            var that = this;
            var calendar = that.calendar;

            that.options[option] = value;

            if (calendar) {
                calendar[option](value);
            }
        }
    };

    DateView.normalize = normalize;

    kendo.DateViewEx = DateView;

    var DatePickerEx = Widget.extend({
        init: function (element, options) {
            var that = this,
                disabled,
                div;

            Widget.fn.init.call(that, element, options);
            element = that.element;
            options = that.options;

            options.min = parse(element.attr("min")) || parse(options.min);
            options.max = parse(element.attr("max")) || parse(options.max);

            normalize(options);

            that._initialOptions = extend({}, options);

            that._wrapper();

            that.dateView = new DateView(extend({}, options, {
                id: element.attr(ID),
                anchor: that.wrapper,
                change: function () {
                    // calendar is the current scope
                    that._change(this.value());
                    that.close();
                },
                close: function (e) {
                    if (that.trigger(CLOSE)) {
                        e.preventDefault();
                    } else {
                        element.attr(ARIA_EXPANDED, false);
                        div.attr(ARIA_HIDDEN, true);
                    }
                },
                open: function (e) {
                    var options = that.options,
                        date;

                    if (that.trigger(OPEN)) {
                        e.preventDefault();
                    } else {
                        if (that.element.val() !== that._oldText) {
                            date = parse(element.val(), options.parseFormats, options.culture);

                            that.dateView[date ? "current" : "value"](date);
                        }

                        element.attr(ARIA_EXPANDED, true);
                        div.attr(ARIA_HIDDEN, false);

                        that._updateARIA(date);

                    }
                }
            }));
            div = that.dateView.div;

            that._icon();

            try {
                element[0].setAttribute("type", "text");
            } catch (e) {
                element[0].type = "text";
            }

            element
                .addClass("k-input")
                .attr({
                    role: "combobox",
                    "aria-expanded": false,
                    "aria-owns": that.dateView._dateViewID
                });

            that._reset();
            that._template();

            disabled = element.is("[disabled]") || $(that.element).parents("fieldset").is(':disabled');
            if (disabled) {
                that.enable(false);
            } else {
                that.readonly(element.is("[readonly]"));
            }

            that._old = that._update(options.value || that.element.val());
            that._oldText = element.val();

            kendo.notify(that);
        },
        events: [
        OPEN,
        CLOSE,
        CHANGE],
        options: {
            name: "DatePickerEx",
            value: null,
            footer: "",
            format: "",
            culture: "",
            parseFormats: [],
            min: new Date(1900, 0, 1),
            max: new Date(2099, 11, 31),
            start: MONTH,
            depth: MONTH,
            animation: {},
            month: {},
            dates: [],
            ARIATemplate: 'Current focused date is #=kendo.toString(data.current, "D")#'
        },

        setOptions: function (options) {
            var that = this;
            var value = that._value;

            Widget.fn.setOptions.call(that, options);

            options = that.options;

            options.min = parse(options.min);
            options.max = parse(options.max);

            normalize(options);

            that.dateView.setOptions(options);

            if (value) {
                that.element.val(kendo.toString(value, options.format, options.culture));
                that._updateARIA(value);
            }
        },

        _editable: function (options) {
            var that = this,
                icon = that._dateIcon.off(ns),
                element = that.element.off(ns),
                wrapper = that._inputWrapper.off(ns),
                readonly = options.readonly,
                disable = options.disable;

            if (!readonly && !disable) {
                wrapper
                    .addClass(DEFAULT)
                    .removeClass(STATEDISABLED)
                    .on(HOVEREVENTS, that._toggleHover);

                element.removeAttr(DISABLED)
                       .removeAttr(READONLY)
                       .attr(ARIA_DISABLED, false)
                       .attr(ARIA_READONLY, false)
                       .on("keydown" + ns, proxy(that._keydown, that))
                       .on("focusout" + ns, proxy(that._blur, that))
                       .on("focus" + ns, function () {
                           that._inputWrapper.addClass(FOCUSED);
                       });

                icon.on(CLICK, proxy(that._click, that))
                    .on(MOUSEDOWN, preventDefault);
            } else {
                wrapper
                    .addClass(disable ? STATEDISABLED : DEFAULT)
                    .removeClass(disable ? DEFAULT : STATEDISABLED);

                element.attr(DISABLED, disable)
                       .attr(READONLY, readonly)
                       .attr(ARIA_DISABLED, disable)
                       .attr(ARIA_READONLY, readonly);
            }
        },

        readonly: function (readonly) {
            this._editable({
                readonly: readonly === undefined ? true : readonly,
                disable: false
            });
        },

        enable: function (enable) {
            this._editable({
                readonly: false,
                disable: !(enable = enable === undefined ? true : enable)
            });
        },

        destroy: function () {
            var that = this;

            Widget.fn.destroy.call(that);

            that.dateView.destroy();

            that.element.off(ns);
            that._dateIcon.off(ns);
            that._inputWrapper.off(ns);

            if (that._form) {
                that._form.off("reset", that._resetHandler);
            }
        },

        open: function () {
            this.dateView.open();
        },

        close: function () {
            this.dateView.close();
        },

        min: function (value) {
            return this._option(MIN, value);
        },

        max: function (value) {
            return this._option(MAX, value);
        },

        value: function (value) {
            var that = this;

            if (value === undefined) {
                return that._value;
            }

            that._old = that._update(value);

            if (that._old === null) {
                that.element.val("");
            }

            that._oldText = that.element.val();
        },

        _toggleHover: function (e) {
            $(e.currentTarget).toggleClass(HOVER, e.type === "mouseenter");
        },

        _blur: function () {
            var that = this,
                value = that.element.val();

            that.close();
            if (value !== that._oldText) {
                that._change(value);
            }

            that._inputWrapper.removeClass(FOCUSED);
        },

        _click: function () {
            var that = this,
                element = that.element;

            that.dateView.toggle();

            if (!kendo.support.touch && element[0] !== activeElement()) {
                element.focus();
            }
        },

        _change: function (value) {
            var that = this;

            value = that._update(value);

            if (+that._old != +value) {
                that._old = value;
                that._oldText = that.element.val();

                if (!that._typing) {
                    // trigger the DOM change event so any subscriber gets notified
                    that.element.trigger(CHANGE);
                }

                that.trigger(CHANGE);
            }

            that._typing = false;
        },

        _keydown: function (e) {
            var that = this,
                dateView = that.dateView,
                value = that.element.val(),
                handled = false;

            if (!dateView.popup.visible() && e.keyCode == keys.ENTER && value !== that._oldText) {
                that._change(value);
            } else {
                handled = dateView.move(e);
                that._updateARIA(dateView._current);

                if (!handled) {
                    that._typing = true;
                }
            }
        },

        _icon: function () {
            var that = this,
                element = that.element,
                icon;

            icon = element.next("span.k-select");

            if (!icon[0]) {
                icon = $('<span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-i-calendar">select</span></span>').insertAfter(element);
            }

            that._dateIcon = icon.attr({
                "role": "button",
                "aria-controls": that.dateView._dateViewID
            });
        },

        _option: function (option, value) {
            var that = this,
                options = that.options;

            if (value === undefined) {
                return options[option];
            }

            value = parse(value, options.parseFormats, options.culture);

            if (!value) {
                return;
            }

            options[option] = new DATE(+value);
            that.dateView[option](value);
        },

        _update: function (value) {
            var that = this,
                options = that.options,
                min = options.min,
                max = options.max,
                current = that._value,
                date = parse(value, options.parseFormats, options.culture),
                isSameType = (date === null && current === null) || (date instanceof Date && current instanceof Date),
                formattedValue;

            if (+date === +current && isSameType) {
                formattedValue = kendo.toString(date, options.format, options.culture);

                if (formattedValue !== value) {
                    that.element.val(date === null ? value : formattedValue);
                }

                return date;
            }

            if (date !== null && isEqualDatePart(date, min)) {
                date = restrictValue(date, min, max);
            } else if (!isInRange(date, min, max)) {
                date = null;
            }

            that._value = date;
            that.dateView.value(date);
            that.element.val(date ? kendo.toString(date, options.format, options.culture) : value);
            that._updateARIA(date);

            return date;
        },

        _wrapper: function () {
            var that = this,
                element = that.element,
                wrapper;

            wrapper = element.parents(".k-datepicker");

            if (!wrapper[0]) {
                wrapper = element.wrap(SPAN).parent().addClass("k-picker-wrap k-state-default");
                wrapper = wrapper.wrap(SPAN).parent();
            }

            wrapper[0].style.cssText = element[0].style.cssText;
            element.css({
                width: "100%",
                height: element[0].style.height
            });

            that.wrapper = wrapper.addClass("k-widget k-datepicker k-header")
                                  .addClass(element[0].className);

            that._inputWrapper = $(wrapper[0].firstChild);
        },

        _reset: function () {
            var that = this,
                element = that.element,
                formId = element.attr("form"),
                form = formId ? $("#" + formId) : element.closest("form");

            if (form[0]) {
                that._resetHandler = function () {
                    that.value(element[0].defaultValue);
                    that.max(that._initialOptions.max);
                    that.min(that._initialOptions.min);
                };

                that._form = form.on("reset", that._resetHandler);
            }
        },

        _template: function () {
            this._ariaTemplate = template(this.options.ARIATemplate);
        },

        _updateARIA: function (date) {
            var cell;
            var that = this;
            var calendar = that.dateView.calendar;

            that.element.removeAttr("aria-activedescendant");

            if (calendar) {
                cell = calendar._cell;
                cell.attr("aria-label", that._ariaTemplate({ current: date || calendar.current() }));

                that.element.attr("aria-activedescendant", cell.attr("id"));
            }
        }
    });

    ui.plugin(DatePickerEx);

})(window.kendo.jQuery);

//datetimepicker
(function ($, undefined) {

    var kendo = window.kendo,
        TimeView = kendo.TimeView,
        parse = kendo.parseDate,
        activeElement = kendo._activeElement,
        extractFormat = kendo._extractFormat,
        calendar = kendo.calendarEx,
        isInRange = calendar.isInRange,
        restrictValue = calendar.restrictValue,
        isEqualDatePart = calendar.isEqualDatePart,
        getMilliseconds = TimeView.getMilliseconds,
        ui = kendo.ui,
        Widget = ui.Widget,
        OPEN = "open",
        CLOSE = "close",
        CHANGE = "change",
        ns = ".kendoDateTimePickerEx",
        CLICK = "click" + ns,
        DISABLED = "disabled",
        READONLY = "readonly",
        DEFAULT = "k-state-default",
        FOCUSED = "k-state-focused",
        HOVER = "k-state-hover",
        STATEDISABLED = "k-state-disabled",
        HOVEREVENTS = "mouseenter" + ns + " mouseleave" + ns,
        MOUSEDOWN = "mousedown" + ns,
        MONTH = "month",
        SPAN = "<span/>",
        ARIA_ACTIVEDESCENDANT = "aria-activedescendant",
        ARIA_EXPANDED = "aria-expanded",
        ARIA_HIDDEN = "aria-hidden",
        ARIA_OWNS = "aria-owns",
        ARIA_DISABLED = "aria-disabled",
        ARIA_READONLY = "aria-readonly",
        DATE = Date,
        MIN = new DATE(1800, 0, 1),
        MAX = new DATE(2099, 11, 31),
        dateViewParams = { view: "date" },
        timeViewParams = { view: "time" },
        extend = $.extend;

    var DateTimePickerEx = Widget.extend({
        init: function (element, options) {
            var that = this, disabled;

            Widget.fn.init.call(that, element, options);

            element = that.element;
            options = that.options;

            options.min = parse(element.attr("min")) || parse(options.min);
            options.max = parse(element.attr("max")) || parse(options.max);

            normalize(options);

            that._initialOptions = extend({}, options);

            that._wrapper();

            that._views();

            that._icons();

            that._reset();
            that._template();

            try {
                element[0].setAttribute("type", "text");
            } catch (e) {
                element[0].type = "text";
            }

            element.addClass("k-input")
                   .attr({
                       "role": "combobox",
                       "aria-expanded": false
                   });


            that._midnight = that._calculateMidnight(options.min, options.max);

            disabled = element.is("[disabled]") || $(that.element).parents("fieldset").is(':disabled');
            if (disabled) {
                that.enable(false);
            } else {
                that.readonly(element.is("[readonly]"));
            }

            that._old = that._update(options.value || that.element.val());
            that._oldText = element.val();

            kendo.notify(that);
        },

        options: {
            name: "DateTimePickerEx",
            value: null,
            format: "",
            timeFormat: "",
            culture: "",
            parseFormats: [],
            dates: [],
            min: new DATE(MIN),
            max: new DATE(MAX),
            interval: 30,
            height: 200,
            footer: "",
            start: MONTH,
            depth: MONTH,
            animation: {},
            month: {},
            ARIATemplate: 'Current focused date is #=kendo.toString(data.current, "d")#'
        },

        events: [
            OPEN,
            CLOSE,
            CHANGE
        ],

        setOptions: function (options) {
            var that = this,
                value = that._value,
                min, max, currentValue;

            Widget.fn.setOptions.call(that, options);

            options = that.options;

            options.min = min = parse(options.min);
            options.max = max = parse(options.max);

            normalize(options);

            that._midnight = that._calculateMidnight(options.min, options.max);

            currentValue = options.value || that._value || that.dateView._current;

            if (min && !isEqualDatePart(min, currentValue)) {
                min = new DATE(MIN);
            }

            if (max && !isEqualDatePart(max, currentValue)) {
                max = new DATE(MAX);
            }

            that.dateView.setOptions(options);

            that.timeView.setOptions(extend({}, options, {
                format: options.timeFormat,
                min: min,
                max: max
            }));

            if (value) {
                that.element.val(kendo.toString(value, options.format, options.culture));
                that._updateARIA(value);
            }
        },

        _editable: function (options) {
            var that = this,
                element = that.element.off(ns),
                dateIcon = that._dateIcon.off(ns),
                timeIcon = that._timeIcon.off(ns),
                wrapper = that._inputWrapper.off(ns),
                readonly = options.readonly,
                disable = options.disable;

            if (!readonly && !disable) {
                wrapper
                    .addClass(DEFAULT)
                    .removeClass(STATEDISABLED)
                    .on(HOVEREVENTS, that._toggleHover);

                element.removeAttr(DISABLED)
                       .removeAttr(READONLY)
                       .attr(ARIA_DISABLED, false)
                       .attr(ARIA_READONLY, false)
                       .on("keydown" + ns, $.proxy(that._keydown, that))
                       .on("focus" + ns, function () {
                           that._inputWrapper.addClass(FOCUSED);
                       })
                       .on("focusout" + ns, function () {
                           that._inputWrapper.removeClass(FOCUSED);
                           if (element.val() !== that._oldText) {
                               that._change(element.val());
                           }
                           that.close("date");
                           that.close("time");
                       });

                dateIcon.on(MOUSEDOWN, preventDefault)
                         .on(CLICK, function () {
                             that.toggle("date");

                             if (!kendo.support.touch && element[0] !== activeElement()) {
                                 element.focus();
                             }
                         });


                timeIcon.on(MOUSEDOWN, preventDefault)
                         .on(CLICK, function () {
                             that.toggle("time");

                             if (!kendo.support.touch && element[0] !== activeElement()) {
                                 element.focus();
                             }
                         });

            } else {
                wrapper
                    .addClass(disable ? STATEDISABLED : DEFAULT)
                    .removeClass(disable ? DEFAULT : STATEDISABLED);

                element.attr(DISABLED, disable)
                       .attr(READONLY, readonly)
                       .attr(ARIA_DISABLED, disable)
                       .attr(ARIA_READONLY, readonly);
            }
        },

        readonly: function (readonly) {
            this._editable({
                readonly: readonly === undefined ? true : readonly,
                disable: false
            });
        },

        enable: function (enable) {
            this._editable({
                readonly: false,
                disable: !(enable = enable === undefined ? true : enable)
            });
        },

        destroy: function () {
            var that = this;

            Widget.fn.destroy.call(that);
            that.dateView.destroy();
            that.timeView.destroy();

            that.element.off(ns);
            that._dateIcon.off(ns);
            that._timeIcon.off(ns);
            that._inputWrapper.off(ns);

            if (that._form) {
                that._form.off("reset", that._resetHandler);
            }
        },

        close: function (view) {
            if (view !== "time") {
                view = "date";
            }

            this[view + "View"].close();
        },

        open: function (view) {
            if (view !== "time") {
                view = "date";
            }

            this[view + "View"].open();
        },

        min: function (value) {
            return this._option("min", value);
        },

        max: function (value) {
            return this._option("max", value);
        },

        toggle: function (view) {
            var secondView = "timeView";

            if (view !== "time") {
                view = "date";
            } else {
                secondView = "dateView";
            }

            this[view + "View"].toggle();
            this[secondView].close();
        },

        value: function (value) {
            var that = this;

            if (value === undefined) {
                return that._value;
            }

            that._old = that._update(value);
            if (that._old === null) {
                that.element.val("");
            }

            that._oldText = that.element.val();
        },

        _change: function (value) {
            var that = this;

            value = that._update(value);

            if (+that._old != +value) {
                that._old = value;
                that._oldText = that.element.val();

                that.trigger(CHANGE);

                if (!that._typing) {
                    // trigger the DOM change event so any subscriber gets notified
                    that.element.trigger(CHANGE);
                }
            }
        },

        _option: function (option, value) {
            var that = this;
            var options = that.options;
            var timeView = that.timeView;
            var timeViewOptions = timeView.options;
            var current = that._value || that._old;
            var minDateEqual;
            var maxDateEqual;

            if (value === undefined) {
                return options[option];
            }

            value = parse(value, options.parseFormats, options.culture);

            if (!value) {
                return;
            }

            if (options.min.getTime() === options.max.getTime()) {
                timeViewOptions.dates = [];
            }

            options[option] = new DATE(value.getTime());
            that.dateView[option](value);

            that._midnight = that._calculateMidnight(options.min, options.max);

            if (current) {
                minDateEqual = isEqualDatePart(options.min, current);
                maxDateEqual = isEqualDatePart(options.max, current);
            }

            if (minDateEqual || maxDateEqual) {
                timeViewOptions[option] = value;

                if (minDateEqual && !maxDateEqual) {
                    timeViewOptions.max = lastTimeOption(options.interval);
                }

                if (maxDateEqual) {
                    if (that._midnight) {
                        timeView.dataBind([MAX]);
                        return;
                    } else if (!minDateEqual) {
                        timeViewOptions.min = MIN;
                    }
                }
            } else {
                timeViewOptions.max = MAX;
                timeViewOptions.min = MIN;
            }

            timeView.bind();
        },

        _toggleHover: function (e) {
            $(e.currentTarget).toggleClass(HOVER, e.type === "mouseenter");
        },

        _update: function (value) {
            var that = this,
                options = that.options,
                min = options.min,
                max = options.max,
                dates = options.dates,
                timeView = that.timeView,
                current = that._value,
                date = parse(value, options.parseFormats, options.culture),
                isSameType = (date === null && current === null) || (date instanceof Date && current instanceof Date),
                rebind, timeViewOptions, old, skip, formattedValue;

            if (+date === +current && isSameType) {
                formattedValue = kendo.toString(date, options.format, options.culture);

                if (formattedValue !== value) {
                    that.element.val(date === null ? value : formattedValue);
                    that.element.trigger(CHANGE);
                }

                return date;
            }

            if (date !== null && isEqualDatePart(date, min)) {
                date = restrictValue(date, min, max);
            } else if (!isInRange(date, min, max)) {
                date = null;
            }

            that._value = date;
            timeView.value(date);
            that.dateView.value(date);

            if (date) {
                old = that._old;
                timeViewOptions = timeView.options;

                if (dates[0]) {
                    dates = $.grep(dates, function (d) { return isEqualDatePart(date, d); });

                    if (dates[0]) {
                        timeView.dataBind(dates);
                        skip = true;
                    }
                }

                if (!skip) {
                    if (isEqualDatePart(date, min)) {
                        timeViewOptions.min = min;
                        timeViewOptions.max = lastTimeOption(options.interval);
                        rebind = true;
                    }

                    if (isEqualDatePart(date, max)) {
                        if (that._midnight) {
                            timeView.dataBind([MAX]);
                            skip = true;
                        } else {
                            timeViewOptions.max = max;
                            if (!rebind) {
                                timeViewOptions.min = MIN;
                            }
                            rebind = true;
                        }
                    }
                }

                if (!skip && ((!old && rebind) || (old && !isEqualDatePart(old, date)))) {
                    if (!rebind) {
                        timeViewOptions.max = MAX;
                        timeViewOptions.min = MIN;
                    }

                    timeView.bind();
                }
            }

            that.element.val(date ? kendo.toString(date, options.format, options.culture) : value);
            that._updateARIA(date);

            return date;
        },

        _keydown: function (e) {
            var that = this,
                dateView = that.dateView,
                timeView = that.timeView,
                value = that.element.val(),
                isDateViewVisible = dateView.popup.visible();

            if (e.altKey && e.keyCode === kendo.keys.DOWN) {
                that.toggle(isDateViewVisible ? "time" : "date");
            } else if (isDateViewVisible) {
                dateView.move(e);
                that._updateARIA(dateView._current);
            } else if (timeView.popup.visible()) {
                timeView.move(e);
            } else if (e.keyCode === kendo.keys.ENTER && value !== that._oldText) {
                that._change(value);
            } else {
                that._typing = true;
            }
        },

        _views: function () {
            var that = this,
                element = that.element,
                options = that.options,
                id = element.attr("id"),
                dateView, timeView,
                div, ul, msMin,
                date;

            that.dateView = dateView = new kendo.DateViewEx(extend({}, options, {
                id: id,
                anchor: that.wrapper,
                change: function () {
                    var value = dateView.calendar.value(),
                        msValue = +value,
                        msMin = +options.min,
                        msMax = +options.max,
                        current;

                    if (msValue === msMin || msValue === msMax) {
                        current = new DATE(+that._value);
                        current.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());

                        if (isInRange(current, msMin, msMax)) {
                            value = current;
                        }
                    }

                    that._change(value);
                    that.close("date");
                },
                close: function (e) {
                    if (that.trigger(CLOSE, dateViewParams)) {
                        e.preventDefault();
                    } else {
                        element.attr(ARIA_EXPANDED, false);
                        div.attr(ARIA_HIDDEN, true);

                        if (!timeView.popup.visible()) {
                            element.removeAttr(ARIA_OWNS);
                        }
                    }
                },
                open: function (e) {
                    if (that.trigger(OPEN, dateViewParams)) {
                        e.preventDefault();
                    } else {

                        if (element.val() !== that._oldText) {
                            date = parse(element.val(), options.parseFormats, options.culture);

                            that.dateView[date ? "current" : "value"](date);
                        }

                        div.attr(ARIA_HIDDEN, false);
                        element.attr(ARIA_EXPANDED, true)
                               .attr(ARIA_OWNS, dateView._dateViewID);

                        that._updateARIA(date);
                    }
                }
            }));
            div = dateView.div;

            msMin = options.min.getTime();
            that.timeView = timeView = new TimeView({
                id: id,
                value: options.value,
                anchor: that.wrapper,
                animation: options.animation,
                format: options.timeFormat,
                culture: options.culture,
                height: options.height,
                interval: options.interval,
                min: new DATE(MIN),
                max: new DATE(MAX),
                dates: msMin === options.max.getTime() ? [new Date(msMin)] : [],
                parseFormats: options.parseFormats,
                change: function (value, trigger) {
                    value = timeView._parse(value);

                    if (value < options.min) {
                        value = new DATE(+options.min);
                        timeView.options.min = value;
                    } else if (value > options.max) {
                        value = new DATE(+options.max);
                        timeView.options.max = value;
                    }

                    if (trigger) {
                        that._timeSelected = true;
                        that._change(value);
                    } else {
                        element.val(kendo.toString(value, options.format, options.culture));
                        dateView.value(value);
                        that._updateARIA(value);
                    }
                },
                close: function (e) {
                    if (that.trigger(CLOSE, timeViewParams)) {
                        e.preventDefault();
                    } else {
                        ul.attr(ARIA_HIDDEN, true);
                        element.attr(ARIA_EXPANDED, false);

                        if (!dateView.popup.visible()) {
                            element.removeAttr(ARIA_OWNS);
                        }
                    }
                },
                open: function (e) {
                    timeView._adjustListWidth();
                    if (that.trigger(OPEN, timeViewParams)) {
                        e.preventDefault();
                    } else {
                        if (element.val() !== that._oldText) {
                            date = parse(element.val(), options.parseFormats, options.culture);

                            that.timeView.value(date);
                        }

                        ul.attr(ARIA_HIDDEN, false);
                        element.attr(ARIA_EXPANDED, true)
                               .attr(ARIA_OWNS, timeView._timeViewID);

                        timeView.options.active(timeView.current());
                    }
                },
                active: function (current) {
                    element.removeAttr(ARIA_ACTIVEDESCENDANT);
                    if (current) {
                        element.attr(ARIA_ACTIVEDESCENDANT, timeView._optionID);
                    }
                }
            });
            ul = timeView.ul;
        },

        _icons: function () {
            var that = this,
                element = that.element,
                icons;

            icons = element.next("span.k-select");

            if (!icons[0]) {
                icons = $('<span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-i-calendar">select</span><span unselectable="on" class="k-icon k-i-clock">select</span></span>').insertAfter(element);
            }

            icons = icons.children();
            that._dateIcon = icons.eq(0).attr({
                "role": "button",
                "aria-controls": that.dateView._dateViewID
            });

            that._timeIcon = icons.eq(1).attr({
                "role": "button",
                "aria-controls": that.timeView._timeViewID
            });
        },

        _wrapper: function () {
            var that = this,
            element = that.element,
            wrapper;

            wrapper = element.parents(".k-datetimepicker");

            if (!wrapper[0]) {
                wrapper = element.wrap(SPAN).parent().addClass("k-picker-wrap k-state-default");
                wrapper = wrapper.wrap(SPAN).parent();
            }

            wrapper[0].style.cssText = element[0].style.cssText;
            element.css({
                width: "100%",
                height: element[0].style.height
            });

            that.wrapper = wrapper.addClass("k-widget k-datetimepicker k-header")
                                  .addClass(element[0].className);

            that._inputWrapper = $(wrapper[0].firstChild);
        },

        _reset: function () {
            var that = this,
                element = that.element,
                formId = element.attr("form"),
                form = formId ? $("#" + formId) : element.closest("form");

            if (form[0]) {
                that._resetHandler = function () {
                    that.value(element[0].defaultValue);
                    that.max(that._initialOptions.max);
                    that.min(that._initialOptions.min);
                };

                that._form = form.on("reset", that._resetHandler);
            }
        },

        _template: function () {
            this._ariaTemplate = kendo.template(this.options.ARIATemplate);
        },

        _calculateMidnight: function (min, max) {
            return getMilliseconds(min) + getMilliseconds(max) === 0;
        },

        _updateARIA: function (date) {
            var cell;
            var that = this;
            var calendar = that.dateView.calendar;

            that.element.removeAttr(ARIA_ACTIVEDESCENDANT);

            if (calendar) {
                cell = calendar._cell;
                cell.attr("aria-label", that._ariaTemplate({ current: date || calendar.current() }));

                that.element.attr(ARIA_ACTIVEDESCENDANT, cell.attr("id"));
            }
        }
    });

    function lastTimeOption(interval) {
        var date = new Date(2100, 0, 1);
        date.setMinutes(-interval);
        return date;
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    function normalize(options) {
        var patterns = kendo.getCulture(options.culture).calendars.standard.patterns,
            parseFormats = !options.parseFormats.length,
            timeFormat;

        options.format = extractFormat(options.format || patterns.g);
        options.timeFormat = timeFormat = extractFormat(options.timeFormat || patterns.t);
        kendo.DateViewEx.normalize(options);

        if (parseFormats) {
            options.parseFormats.unshift("yyyy-MM-ddTHH:mm:ss");
        }

        if ($.inArray(timeFormat, options.parseFormats) === -1) {
            options.parseFormats.splice(1, 0, timeFormat);
        }
    }

    ui.plugin(DateTimePickerEx);

})(window.kendo.jQuery);