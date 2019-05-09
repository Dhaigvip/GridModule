//import $ from 'jquery/dist/jquery';

//declare var $: any;

$.jgrid.extend({
    editToolbar: function (p) {
        p = { autosearch: true, searchOnEnter: true }
        return this.each(function () {
            var $t = this;
            if ($t.p.editToolbar) { return; }
            if (!$($t).data('editToolbar')) {
                $($t).data('editToolbar', p);
            }
            var classes = $.jgrid.styleUI[($t.p.styleUI || 'jQueryUI')].filter,
                common = $.jgrid.styleUI[($t.p.styleUI || 'jQueryUI')].common,
                base = $.jgrid.styleUI[($t.p.styleUI || 'jQueryUI')].base,

                toggleEditbar = function () {
                    var trow = $("tr.ui-edit-toolbar", $t.grid.hDiv),
                        trow2 = $t.p.frozenColumns === true ? $("tr.ui-edit-toolbar", $t.grid.fhDiv) : false;
                    if (trow.css("display") === 'none') {
                        trow.show();
                        if (trow2) {
                            trow2.show();
                        }
                    } else {
                        trow.hide();
                        if (trow2) {
                            trow2.hide();
                        }
                    }
                },
                triggerEditbar = function (val, colname) {
                    if ($t.p.onBulkEdit) {
                        $t.p.onBulkEdit.call($t, val, colname);
                    }
                }
            // create the row
            var rcount = 0;
            var tr = $("<tr class='ui-edit-toolbar' role='row'></tr>"),
                timeoutHnd, rules, filterobj;
            $.each($t.p.colModel, function (ci) {
                var cm = this, soptions, select = "", sot = "=", so, i, st, csv, df, elem,
                    th = $("<th role='columnheader' class='" + base.headerBox + " ui-th-" + $t.p.direction + "' id='esh_" + $t.p.id + "_" + cm.name + "' ></th>"),
                    thd = $("<div></div>"),
                    etbl = $("<table class='ui-edit-table' cellspacing='0'><tr><td class='ui-edit-oper' headers=''><span class='ui-icon ui-icon-pencil'></span></td><td class='ui-edit-input' headers=''></td><td class='ui-edit-clear' headers=''></td></tr></table>");
                if (this.hidden === true) { $(th).css("display", "none"); }

                this.search = this.search === false ? false : true;
                if (this.stype === undefined) { this.stype = 'text'; }
                soptions = $.extend({}, this.searchoptions || {}, { name: cm.index || cm.name, id: "es_" + $t.p.idPrefix + cm.name, oper: 'edit' });
                if (this.editable) {
                    rcount++;
                    $("td:eq(0)", etbl).attr("colindex", ci).append(select);
                    df = "";
                    elem = $.jgrid.createEl.call($t, this.stype, soptions, df, false, $.extend({}, $.jgrid.ajaxOptions, $t.p.ajaxSelectOptions || {}));
                    $(elem).addClass(classes.srInput);
                    $("td:eq(1)", etbl).append(elem);
                    $(thd).append(etbl);
                    if (soptions.dataEvents == null) {
                        soptions.dataEvents = [];
                    }
                    switch (this.stype) {
                        case "select":
                            if (p.autosearch === true) {
                                soptions.dataEvents.push({
                                    type: "change",
                                    fn: function () {
                                        triggerEditbar($(this).val(), this.name);
                                        return false;
                                    }
                                });
                            }
                            break;

                        case "text":
                            if (p.autosearch === true) {
                                if (p.searchOnEnter) {
                                    soptions.dataEvents.push({
                                        type: "keypress",
                                        fn: function (e) {
                                            var key = e.charCode || e.keyCode || 0;
                                            if (key === 13) {
                                                triggerEditbar($(this).val(), this.name);
                                                return false;
                                            }
                                            return this;
                                        }
                                    });
                                } else {
                                    soptions.dataEvents.push({
                                        type: "keydown",
                                        fn: function (e) {
                                            var key = e.which;
                                            switch (key) {
                                                case 13:
                                                    return false;
                                                case 9:
                                                case 16:
                                                case 37:
                                                case 38:
                                                case 39:
                                                case 40:
                                                case 27:
                                                    break;
                                                default:
                                                    if (timeoutHnd) { clearTimeout(timeoutHnd); }
                                                    timeoutHnd = setTimeout(function () { triggerEditbar($(this).val(), this.name); }, p.autosearchDelay);
                                            }
                                        }
                                    });
                                }
                            }
                            break;
                    }
                    $.jgrid.bindEv.call($t, elem, soptions);
                }
                $(th).append(thd);
                $(tr).append(th);
            });

            if (rcount > 0) { $("table thead", $t.grid.hDiv).append(tr) };
            this.p.editToolbar = true;
            this.toggleEditbar = toggleEditbar;
            this.triggerEditbar = triggerEditbar;
        });
    }
});