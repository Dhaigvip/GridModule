
import {
    Component, EventEmitter, Directive, OnInit,
    OnChanges, OnDestroy, AfterViewInit, ElementRef, Input,
    Output, LOCALE_ID, Inject, HostListener
} from '@angular/core';
import { Observable, Subject, AsyncSubject } from 'rxjs/Rx';
import './tcmcore.jqgrid.edittoolbar';
import './tcmcore.jqgrid.rowbynumber';
import { JQGridUtilities } from './tcmcore.jqgrid.Utilities';
import { ReferenceDataType, ReferenceData, GridObject, ClientResponse, PostData, SearchRepository } from './tcmcore.jqgrid.objects';
import { ControlSettings } from 'tcm-base-module';

@Component({
    selector: 'jqGrid',
    exportAs: "jqGrid",
    template: `
        <div></div>`
})
export class jqGrid implements OnChanges, OnInit, OnDestroy, AfterViewInit {

    /*
        JQGrid standard options 
    */
    @Input() dtOptions: any = null;

    /*
        Grid state persisted in external store.
    */
    @Input() gridPersistence: any = null;

    /*
      Sub-Grid state persisted in external store.
    */
    @Input() subGridPersistence: any = null;

    /*
      Unique id for grid. If there are multiple grids on the same page
        make sure each has a unique id.
    */
    @Input() id: string;

    @Input() filterOptions: any = {
        searchOnEnter: true,
        autosearch: true,
        stringResult: true,
        searchOperators: true
    };
    @Input() subGridOptions: any = {};

    //Call a function on parent and get the returned data.
    @Input() getData: (postdata: SearchRepository) => Observable<ClientResponse>;

    @Input() getSubData: (postdata: SearchRepository) => Observable<ClientResponse>;

    @Output() saveData: EventEmitter<any> = new EventEmitter();
    @Output() add: EventEmitter<any> = new EventEmitter();
    @Output() remove: EventEmitter<any> = new EventEmitter();
    @Output() updatePersistence: EventEmitter<ControlSettings> = new EventEmitter();
    @Output() exportData: EventEmitter<any> = new EventEmitter();
    @Output() exportsubData: EventEmitter<any> = new EventEmitter();

    @Input() getReferenceData: (ref: ReferenceData) => any;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        //console.log("grid");
        //console.log(event);
        var outerwidth = $('#container' + this.id).width();
        //console.log("outerwidth - " + outerwidth);

        var perm = this.grid.jqGrid('getGridParam', 'width');
        //console.log("Grid width - " + perm);

        this.grid.setGridWidth(outerwidth);
    }


    x_locale;


    constructor(
        private element: ElementRef,
        private utility: JQGridUtilities,
        @Inject(LOCALE_ID) private locale) {
        //jqGrid needs only first part of the culture.
        this.x_locale = locale.toString().split("-")[0];

        this.CurrentDateTimeFormatMS = this.utility.GetCurrentDateFormat() + " HH:mm";
        this.CurrentDateFormatPHP = this.FormatToPHPDate(this.utility.GetCurrentDateFormat());
        this.CurrentDateTimePHP = this.CurrentDateFormatPHP + " H:i";
        //$(window).resize(this.ResizeGrid);

    }
    private ResizeGrid = () => {

        this.pager = $("<div id='" + this.pagerId + "'></div>");
        var outerwidth = $('#container' + this.id).width();
        this.grid.setGridWidth(outerwidth);
    }


    private CurrentDateTimeFormatMS;
    private CurrentDateFormatPHP;
    private CurrentDateTimePHP;


    private grid: any = null;//TcmJqGrid.JqGrid;
    private subGrid = null;
    private currentSel = null;
    private pagerId = null;
    private pager = null;
    private firstLoad = false;
    private options: any = {};
    private tt: any = {};
    private addCounter: number = -1;

    private dataTable;
    private footerTable;
    private headerTable;

    ngOnInit() {
    }
    ngOnChanges() {
    }
    ngOnDestroy() {
        //Clear subscriptions
    }

    ngAfterViewInit() {

        this.pagerId = this.id + "_pager";
        this.pager = $("<div id='" + this.pagerId + "'></div>");
        //Global to this class...
        this.grid = $("<table id='" + this.id + "'></table>");
        //If we have subgrid..
        this.subGrid = null;
        this.firstLoad = true;

        var container = $("<div id='container" + this.id + "'></div>");
        container.append(this.grid);
        container.append(this.pager);

        $(this.element.nativeElement).replaceWith(container);



        this.tt = $.extend(true, {}, {
            //frozenColumns: true,
            //altClass: 'myAltRowClass',
            //altRows: true,
            hideSelectAll: true,
            pager: this.id + "_pager",
            loadui: 'block',
            styleUI: 'jQueryUI',
            //styleUI: 'Bootstrap',
            view: false,//Row row details                      
            //showEditbar: true, -  Just turn this on for bulk updates
            // altRows: true, - Turns this on for alternate rows colors
            altclass: 'myAltRowClass',
            /*Nav buttons default*/
            showSearch: true,
            showAdd: false,//Show add button
            addNew: false,//Allows addition of new object
            showRemove: false,
            removeFromGrid: false,
            showColchooser: true,
            exportToExcel: true,
            showRowSelectable: false,
            showSave: true,
            dirty: false,
            cancelDefaultLoad: false,
            showFilterbar: true,
            refresh: true,
            mtype: 'POST',
            autowidth: true,
            height: 'auto',
            pgbox: true,
            persistSelection: false, //Remembers selected rows,       
            //only page navigation should remember the selection
            rowNum: 100,
            rownumbers: true,
            rowList: [10, 100, 200, 500, 1000],
            datatype: 'local',
            jsonReader: {
                root: 'rows',//'aaData',
                page: (obj) => { return typeof obj !== 'undefined' && typeof obj.rows !== 'undefined' && obj.rows.length > 0 ? obj.page : '0'; },
                total: (obj) => { return typeof obj !== 'undefined' && typeof obj.rows !== 'undefined' && obj.rows.length > 0 ? obj.total : '0' },  //'iTotalRecords',
                records: 'records' //'iTotalDisplayRecords'
            },
            multiSelect: true,
            regional: this.x_locale,
            viewrecords: true,
            gridview: true,
            autoencode: true,
            sortable: true,
            shrinkToFit: false,
            toppager: true,
            showScrollOntop: true,
            locale: this.x_locale,
            currentDateTimeFormatMS: this.CurrentDateTimeFormatMS,
            currentDateFormatPHP: this.CurrentDateFormatPHP,
            currentDateTimePHP: this.CurrentDateTimePHP
        });


        //Get the grid data and populate in grid..
        $.extend(this.tt, {
            subGridOptions: {
                "plusicon": "ui-icon-triangle-1-e",
                "minusicon": "ui-icon-triangle-1-s",
                "openicon": "ui-icon-arrowreturn-1-e"
            }
        })
        $.extend(this.tt, {
            datatype: (postdata) => {
                //Raise event for data.
                var searchInput = this.utility.PopulateSearchCriteria(postdata, 'BySearch');

                return this.getData(searchInput).subscribe(
                    (result: ClientResponse) => {
                        var gridInputData = this.PrepareInput(result, this.grid);
                        this.grid[0].addJSONData(gridInputData)
                        this.RefreshSerchingToolbar(this.grid, 'cn')
                    }
                );
            },
        });
        $.extend(this.tt, {
            onBulkEdit: (val, colname, e) => {
                var allrows = this.grid.jqGrid('getGridParam', 'selarrrow');
                $.each(allrows, (idx, value) => {
                    //Check if row is editable...
                    if (this.options.isEditable.call(this.grid, value) == true) {
                        this.grid.jqGrid("setCell", value, colname, val);
                    }
                })
                this.options.SaveRowWrapper(this.currentSel);
            }
        });
        $.extend(this.tt, {
            onSelectRow: (id, isSelected, e) => {
                /*
                 * Grid is editable if isEditable function is defined on the grid.
                 **/
                if (this.options.isEditable) {
                    this.options.dirty = true;
                    if (id && id != this.currentSel) {
                        this.options.saveRowWithValidation(this.currentSel);
                        this.currentSel = id;
                    }

                    var selByChkBox = this.grid.jqGrid('getGridParam', 'selByChkBox');

                    if (this.options.isEditable.call(this.grid, id) == true) {

                        if (!isSelected && !selByChkBox) {
                            this.grid.jqGrid('setSelection', id, false);
                        }
                        if (isSelected || (!isSelected && !selByChkBox)) {
                            this.grid.jqGrid('editRow', this.currentSel, true, () => {
                                if (e != null) {
                                    var selCol = e.target.cellIndex;
                                    //try to get its parent and see if it is a cell?
                                    if (!selCol) {
                                        var x: any = $(e.target).parent()[0];
                                        selCol = x.cellIndex
                                    }

                                    if (selCol) {
                                        var tmpcol = this.grid.jqGrid("getGridParam", 'colModel');
                                        var nm = tmpcol[selCol].name;
                                        var edt = tmpcol[selCol].editable
                                        if (nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn' && edt === true) {
                                            var chkBox: any = $(e.target).children()[0];
                                            if (chkBox.type == "checkbox") {
                                                $(chkBox).prop("checked", !$(chkBox).prop("checked"));
                                            }
                                        }
                                    }
                                }
                            }, null, 'clientArray', e);
                        }
                        else { this.grid.restoreRow(this.currentSel); }
                    }
                    //Is this needed?
                    else
                        this.grid.restoreRow(this.currentSel);
                }

                if (this.options.onSelectRowcallback) {
                    var data = this.grid.getRowData(id);
                    this.options.onSelectRowcallback(data);
                }
            },
        });
        $.extend(this.tt, {
            onCellSelect: (rowid, col, content, e) => {
                if (this.options.onSelectCellcallback) {
                    var data = this.grid.getRowData(rowid);

                    var cm = this.grid.jqGrid('getGridParam', 'colModel');
                    var colModel = cm[col];
                    this.options.onSelectCellcallback(data, colModel);
                }
            },
        });
        $.extend(this.tt, {
            subGridRowExpanded: (subgrid_id, row_id) => {
                this.ShowSubGrid(subgrid_id, row_id);
            }
        });
        $.extend(this.tt, {
            resizeStop: (width, index) => {
                var perm = this.grid.jqGrid('getGridParam', 'columnPermutation');
                this.UpdatePersistence(perm, this.grid, this.grid[0].id);//
            }
        });
        $.extend(this.tt, {
            onSortCol: (index, columnIndex, sortOrder) => {
                var perm = this.grid.jqGrid('getGridParam', 'columnPermutation');
                this.UpdatePersistence(perm, this.grid, this.grid[0].id);
                if (this.options.showFilterbar) {
                    this.grid[0].triggerToolbar()
                    return 'stop';
                }
            }
        });
        $.extend(this.tt, {
            getColumnData: (domain, searchString) => {

                switch (domain) {
                    case "Fund":
                    //TO DO :
                    //return ExtFundHelperService.GetFundsByNameOrShortName(searchString).then(
                    //    (data) => {
                    //        var result = transform(data, domain);
                    //        return $q.when(result);
                    //    });
                    case "Account":
                        break;
                }
                function transform(data, domain) {
                    var r = $.map(data, (value, key) => {
                        var domainid = domain + "Id";
                        var domainname = domain + "Name";
                        return {
                            label: value.Identity[domainname],
                            value: value.Identity[domainid]
                        }
                    });
                    return r;
                }
            }
        });
        $.extend(this.tt, {
            saveRowWithValidation: (id) => {
                var valid = true;
                if (id != null) {
                    var data = this.grid.getRowData(id);
                    if (this.options.validate) {
                        var result = this.options.validate(data);
                        if (result[0] != true) {
                            var message = '';
                            for (var i = 1; i < result.length; i++) {
                                message = message + "\n" + result[i];
                            }
                            alert(message);
                            valid = false;
                        }
                    }
                    this.options.SaveRowWrapper(id);
                }
                return valid;
            }
        });
        $.extend(this.tt, {
            SaveRowWrapper: (rowid) => {
                if ($(this.grid.jqGrid("getInd", rowid, true)).attr("editable") === "1") {
                    this.grid.saveRow(rowid, false, 'clientArray');
                }
            }
        });


        if (this.x_locale === 'sv') {
            $.extend(true, $.jgrid.regional["sv"].defaults, {
                pgfirst: "Första sidan",
                pglast: "Sista sidan",
                pgnext: "Nästa sida",
                pgprev: "Föregående sida",
                pgrecs: "Rader per sida",
            });

            $.extend(true, $.jgrid.regional["sv"].search, {
                operandTitle: "Klicka för sökvärde",
                resetTitle: "Återställ sökvärde",
                addrule: "Lägg till sökvärde",
                delrule: "Ta bort sökvärde"
            });

            if ($.ui.multiselect)
                $.extend($.ui.multiselect, {
                    locale: {
                        addAll: 'Lägg till alla',
                        removeAll: 'Ta bort alla',
                        itemsCount: 'kolumner valda'
                    }
                });

        }

        if (this.subGridOptions) {
            var t1 = $.extend(true, {}, this.tt);
            this.subGridOptions = $.extend(true, {}, t1, this.subGridOptions);
            this.subGridOptions.refresh = this.subGridOptions.showFilterbar;
            this.ApplyPersistence(this.subGridOptions.colModel, this.subGridPersistence);
        }


        if (this.dtOptions) {
            //Apply persistence...
            //Deep copy for new object..
            this.options = $.extend(true, {}, this.tt, this.dtOptions);
            this.options.refresh = this.options.showFilterbar;
            this.options.pgbox ? this.options.rowList = this.options.rowList : this.options.rowList = [];
            this.ApplyPersistence(this.options.colModel, this.gridPersistence);
        }


        this.options.caption = this.getReferenceData({ Key: this.options.caption, DataType: ReferenceDataType.Translate });

        //this.utility.GetLabel(this.options.caption);

        if (this.options.sortable == true) {
            this.options.sortable = (perm) => {
                //save new sort state...
                var columnOrder = this.grid.jqGrid("getGridParam", "remapColumns");
                this.UpdatePersistence(columnOrder, this.grid, this.grid[0].id);
            }
        }

        this.SaveOnTab();

        this.grid.bind("jqGridBeforeRequest", (e) => {
            //Vipul:- Fix for default values in filtertoolbar 
            var $temp = $(this);
            if (this.options.showFilterbar && $temp.data('areFiltersDefaulted') !== true) {
                // Flip the status so this part never runs again
                $temp.data('areFiltersDefaulted', true);
                // After a short timeout (after this function returns false!), now
                // you can trigger the search
                setTimeout(() => {
                    this.grid[0].triggerToolbar();
                }, 50);
                // Abort the first request
                return false;
            }

            if (this.options.isEditable && this.options.dirty) {
                var result = confirm("You have unsaved changes, Do you want to continue? \n If you press OK, changes will be discarded.");
                if (result) {
                    this.options.dirty = false;
                    if (this.options.onBeforeRequestCallback) {
                        return this.options.onBeforeRequestCallback(true);
                    }
                    return true;
                }
                else
                    return false;
            }
            return true;
        });

        this.grid.jqGrid(this.options);
        var a = this.grid.getGridParam('width');

        this.dataTable = $(this.grid[0].grid.bDiv);
        this.footerTable = $(this.grid[0].grid.sDiv);
        this.headerTable = $(this.grid[0].grid.hDiv);

        this.grid.parents('div.ui-jqgrid-bdiv').css("max-height", this.options['maxheight']);

        //This is how we can add filter - 
        if (this.options.showFilterbar)
            this.AddFilterToolbar(this.filterOptions);

        //Bulk edit toolbar
        if (this.options.showEditbar)
            this.AddEditToolbar({});


        this.grid.jqGrid('navGrid', '#' + this.pagerId, { addfunc: this.Add, delfunc: this.Remove, cloneToTop: true, multipleSearch: true, view: this.options.view, edit: false, refresh: !this.options.refresh, add: this.options.showAdd, del: this.options.showRemove, search: false }, {}/*Edit*/, {}/*Add*/, {}/*Delete*/, {}/*search*/, { closeOnEscape: false, width: 600, dataheight: 500, navkeys: [true, 38, 40] }/*View*/)

        if (this.options.groupHeaders)
            this.grid.jqGrid('setGroupHeaders', this.options.groupHeaders);

        //Apply persistence...

        this.UpdateColOrdersPersistence(this.gridPersistence, this.grid);


        if (this.options.refresh) {

            this.NavButtonAdd(
                {
                    title: this.convertCharCodes(this.getReferenceData({ Key: 'refreshGrid', DataType: ReferenceDataType.Translate })),
                    caption: "",
                    buttonicon: "ui-icon-refresh",
                    onClickButton: () => {
                        this.grid[0].triggerToolbar();
                    }
                }, this.grid, this.pagerId, false)
        };


        if (this.options.exportToExcel) {
            this.NavButtonAdd(
                {
                    title: this.getReferenceData({ Key: 'exportToExcel', DataType: ReferenceDataType.Translate }),
                    caption: "",
                    buttonicon: "ui-icon-arrowthickstop-1-s",
                    onClickButton: () => {
                        this.exportData.emit({ format: "Excel" });
                    }
                }, this.grid, this.pagerId, false)
        };
        if (this.options.showColchooser) {
            let colChooserTitle = this.convertCharCodes(this.getReferenceData({ Key: 'columnChooser', DataType: ReferenceDataType.Translate }));
            this.NavButtonAdd(
                {
                    title: colChooserTitle,
                    caption: "",
                    buttonicon: " ui-icon-shuffle",
                    onClickButton: () => {
                        this.onColumnChooser(500, 500, colChooserTitle, this.grid, this.grid[0].id);
                    },
                }, this.grid, this.pagerId, false)
        };
        if (this.options.showSearch) {
            this.NavButtonAdd({
                caption: "",
                title: this.convertCharCodes(this.getReferenceData({ Key: 'search', DataType: ReferenceDataType.Translate })),
                buttonicon: "ui-icon-search",
                onClickButton: () => {
                    this.grid.searchGrid({
                        //multipleGroup: true,
                        sopt: ['eq', 'ne', 'cn', 'bw', 'bn'],
                        searchhidden: true,
                        multipleSearch: true,
                        closeAfterSearch: true,
                        //recreateFilter: true,
                        showQuery: false,
                        closeOnEscape: true,
                        zIndex: 1200,
                    });
                }
                //position: "last"
            }, this.grid, this.pagerId, true)
        }
        if (this.options.showSave) {
            this.NavButtonAdd(
                {
                    caption: "",
                    title: this.getReferenceData({ Key: 'save', DataType: ReferenceDataType.Translate }),
                    buttonicon: "ui-icon-disk",
                    onClickButton: this.Save
                }, this.grid, this.pagerId, false)
        };


        if (this.options.hideSelectAll)
            $("#cb_" + this.grid[0].id).hide();

        if (this.options.showScrollOntop) {


            var $gview = this.grid.closest(".ui-jqgrid-view"),
                $bdiv = this.grid.closest(".ui-jqgrid-bdiv"),
                $topToolbar = $gview.find(">.ui-jqgrid-hdiv")



            var topele = $gview.find('.ui-jqgrid-toppager, .ui-jqgrid-hdiv');
            topele.wrapAll($("<div id='topX" + this.pagerId + "'>"));

            var combinedHeader = $gview.find('#topX' + this.pagerId);

            combinedHeader.css('z-index', '950');
            combinedHeader.css('background-color', '#fffffd');

            $topToolbar.css({
                overflowX: "scroll", overflowY: "hidden"
            })
                .append($("<div id='topScroll" + this.pagerId + "'>"));

            $topToolbar.scroll(function () {
                // synchronize the srollbar of the grid
                $bdiv.scrollLeft($(this).scrollLeft());
            });

            $bdiv.scroll(function () {
                // synchronize the srollbar of the toppbar
                $topToolbar.scrollLeft($(this).scrollLeft());
            });


            //this.setInitializeHeadersAndFootersPosition(combinedHeader);

            //v
            var t = this.dataTable.offset().top;
            //topPagerTop = topPagerTable.offset().top;
            var dataTableHeight = t + this.dataTable.outerHeight();
            var windowTop = $(window).scrollTop();
            var windowBottom = this.ScreenBottom();
            if (windowTop > t && windowTop < dataTableHeight) {
                combinedHeader.offset({ top: windowTop, left: combinedHeader.offset().left });
            }


            //var scrollTimer;
            var outer = $('#main-panel').scroll(() => {
                let dataTableTop = this.dataTable.offset().top;
                var dataTableHeight = dataTableTop + this.dataTable.outerHeight();
                var windowTop = $(window).scrollTop();
                var windowBottom = $(window).scrollTop() + $(window).height();

                if (windowTop > dataTableTop) {
                    combinedHeader.offset({ top: windowTop + 97, left: combinedHeader.offset().left });
                }
                //Re adjust of the movement is too fast
                if (windowTop < (dataTableTop - combinedHeader.height())
                    && dataTableTop < (combinedHeader.offset().top + combinedHeader.height())) {
                    combinedHeader.offset({
                        top: this.dataTable.offset().top - combinedHeader.height(), left: combinedHeader.offset().left
                    });
                }
            });
            //showScrollOntop();
        }
        else {
            var $gview = this.grid.closest(".ui-jqgrid-view");
            var $topToolbar = $gview.find(">.ui-jqgrid-hdiv");
            $topToolbar.css({
                overflowX: "hidden", overflowY: "hidden"
            })
        }
    }

    private StickHeaderstoTop = () => {

    }

    private FormatToPHPDate = (date) => {
        var newdate = '';

        var separators = ['/', '-'];
        var dateArray = date.split(new RegExp(separators.join('|'), 'g'));
        var dateSeparator = "/";

        if (date.indexOf("/") == -1) {
            dateSeparator = "-";
        }

        for (var i = 0; i < dateArray.length; i++) {
            var datePart = dateArray[i].trim().toLowerCase().slice(0, 1);
            if (datePart === 'y') datePart = 'Y';
            newdate = newdate + dateSeparator + datePart;
        }
        return newdate.slice(1);
    }


    private AddFilterToolbar = (options) => {
        this.grid.jqGrid('filterToolbar', options);
    }

    private AddEditToolbar = (options) => {
        this.grid.jqGrid('editToolbar', options);
    }

    private PopulateGrid = (data) => {
        this.grid[0].addJSONData(data);
    }

    /**
     * 
     * @param postdata
     * @param criteriaType
     */
    public GetRowsToSave = (): any[] => {
        this.options.dirty = false;
        return this.RowsTosave();
    }



    public GetAllRows = () => {
        return this.grid.jqGrid('getRowData');
    }

    public SaveAndGetAllRows = () => {
        var rows = [];
        var rowNums = this.grid.jqGrid('getDataIDs')
        for (let num of rowNums) {
            this.options.SaveRowWrapper(num);
            rows.push(this.grid.jqGrid('getRowData', num));
        }
        return rows;
    }

    public ReloadGrid = () => {
        this.grid.trigger("reloadGrid", [{ page: 1, current: true }]);
    }

    public GetColModelForExport = () => {
        return this.ColumnsForExport(this.grid);
    }

    public GetColModelForExportSubGrid() {
        return this.ColumnsForExport(this.subGrid);
    }

    public SetSelection(id: string, raiseEvent: boolean) {
        this.grid.jqGrid('setSelection', id, raiseEvent);
    }

    public ResetSelection() {
        this.grid.jqGrid('resetSelection');
    }


    public ColumnsForExport = (grd) => {
        var colModel = grd.jqGrid('getGridParam', 'colModel');
        var colNames = grd.jqGrid('getGridParam', 'colNames')

        var DisplayCols = [];
        for (var i = 0; i < colModel.length; i++) {
            var col = colModel[i];
            var colName = col.name.toLowerCase();

            if (colName === 'subgrid' || colName === 'rn' || colName == 'cb' || col.hidden === true) {
            }
            else {
                var isDate = false;
                if (col.hasOwnProperty("template")) {
                    if (col.template.hasOwnProperty("formatter")) {
                        if (col.template.formatter === "date")
                            isDate = true;
                    }
                }
                var propertyName;
                if (col.jsonmap)
                    propertyName = col.jsonmap;
                else
                    propertyName = col.name;
                DisplayCols.push({ HeaderText: this.convertCharCodes(colNames[i]), IsDate: isDate, PropertyName: propertyName });
            }
        }
        return DisplayCols;
    }

    public convertCharCodes = (stringToFormat) => {
        return stringToFormat.replace(/&#(\d+);/g, function (match, number) { return String.fromCharCode(number) })
    }
    public UpdateRows = (data, key, errorKey, updateCols) => {

        key = key || "ExtPosReference";
        errorKey = errorKey || "ErrorNumber";
        for (var i = 0; i < data.length; i++) {
            var rowId = data[i][key].trim();

            if (data[i].hasOwnProperty(errorKey) && data[i][errorKey] > 0) {
                var tr = this.grid.find('tr#' + rowId);
                tr.removeClass('ui-state-highlight');
                tr.addClass('errorRow');
            }
            if (updateCols != null) {
                for (var col = 0; col < updateCols.length; col++) {
                    var colname = updateCols[col].trim();
                    var colData = data[i][colname] == null ? null : String(data[i][colname]).trim();
                    this.grid.jqGrid('setCell', rowId, colname, colData);
                }
            }
        }
    }

    /*
    @ignore
    */
    private RefreshSerchingToolbar = ($grid, myDefaultSearch) => {

        var getColumnIndex = (grid, columnIndex) => {
            var cm = grid.jqGrid('getGridParam', 'colModel'), i = 0, l = cm.length;
            for (; i < l; i += 1) {
                if ((cm[i].index || cm[i].name) === columnIndex) {
                    return i; // return the colModel index
                }
            }
            return -1;
        }

        var postData = $grid.jqGrid('getGridParam', 'postData'), filters, i, l,
            rules, rule, iCol, cm = $grid.jqGrid('getGridParam', 'colModel'),
            cmi, control, tagName;

        for (i = 0, l = cm.length; i < l; i += 1) {
            //control = $("#gs_" + $.jgrid.jqID(cm[i].name));
            control = $("#gview_" + $grid.attr('id') + " #gs_" + $.jgrid.jqID(cm[i].name));
            if (control.length > 0) {
                tagName = control[0].tagName.toUpperCase();
                if (tagName === "SELECT") { // && cmi.stype === "select"
                    control.find("option[value='']")
                        .attr('selected', 'selected');
                } else if (tagName === "INPUT") {
                    control.val('');
                }
            }
        }

        if (typeof (postData.filters) === "string" && $grid.jqGrid('getGridParam', 'showFilterbar') === true) {

            filters = $.parseJSON(postData.filters);
            if (filters && filters.groupOp === "AND" && typeof (filters.groups) === "undefined") {
                // only in case of advance searching without grouping we import filters in the
                // searching toolbar
                rules = filters.rules;
                for (i = 0, l = rules.length; i < l; i += 1) {
                    rule = rules[i];
                    iCol = getColumnIndex($grid, rule.field);
                    cmi = cm[iCol];
                    control = $("#gview_" + $grid.attr('id') + " #gs_" + $.jgrid.jqID(cmi.name));

                    var searchOps = $(control).parents('td').siblings('.ui-search-oper').eq(0);
                    if (searchOps.length > 0) {
                        var d = $($grid).data('filterToolbar').operands[rule.op];
                        $(searchOps).find('a').attr('soper', rule.op).text(d);
                    }

                    if (iCol >= 0 && control.length > 0) {
                        tagName = control[0].tagName.toUpperCase();
                        if (cmi.search == true) {
                            if (tagName === "SELECT") { // && cmi.stype === "select"
                                control.find("option[value='" + $.jgrid.jqID(rule.data) + "']")
                                    .attr('selected', 'selected');
                            } else if (tagName === "INPUT") {
                                control.val(rule.data);
                            }
                        }
                    }
                }
            }
        }
    };

    private PrepareInput = (result, grd): GridObject => {
        var gridInputData = <GridObject>{}
        gridInputData.rows = [];

        if (result != null && result.Success == true && result.Data != null) {
            var postData = grd.jqGrid('getGridParam', 'postData');

            var keyNames = Object.keys(result.Data);

            for (var i in keyNames) {
                if (keyNames[i].toLowerCase().indexOf('list') !== -1) {
                    gridInputData.rows = result.Data[keyNames[i]];
                    break;
                }
            }
            gridInputData.records = result.Data.TotalRecords;
            gridInputData.total = Math.ceil(result.Data.TotalRecords / parseInt(postData.rows));
            gridInputData.page = postData.page;
            gridInputData.userdata = result.Data.UserData;

        }
        return gridInputData;
    }



    private NavButtonAdd = (criteria: any, grd, pgrId, seperator) => {
        if (seperator) {
            grd.jqGrid('navButtonAdd', '#' + pgrId, criteria).navSeparatorAdd('#' + pgrId);
            grd.jqGrid('navButtonAdd', '#' + grd[0].id + "_toppager", criteria).navSeparatorAdd('#' + grd[0].id + "_toppager");
        }
        else {
            grd.jqGrid('navButtonAdd', '#' + pgrId, criteria);
            grd.jqGrid('navButtonAdd', '#' + grd[0].id + "_toppager", criteria);
        }
    };

    private ApplyPersistence = (colModel, per) => {
        $.each(colModel, (index, val: any) => {
            var perstenceCol = null;
            //Apply persistence
            if (per) {
                $.each(per.colStates, (index, col: any) => {
                    if (val.name === col.cn) {
                        perstenceCol = col;
                        return false;
                    }
                });
            }
            if (perstenceCol) {
                if (val.hasOwnProperty("template")) {
                    val["template"]["width"] = perstenceCol.wd;
                    val["template"]["hidden"] = perstenceCol.hd;
                }
                else {
                    val.width = perstenceCol.wd;
                    val.hidden = perstenceCol.hd;
                }
            }

            //Update with localised headers
            if (val.hasOwnProperty("label")) {
                val.label = this.getReferenceData({ Key: val.label, DataType: ReferenceDataType.Translate })
            }
            //Get help text
            if (val.hasOwnProperty("help")) {
                //val.help = this.utility.GetLabel(val.help);
                //this.getReferenceData({ Key: val.help, DataType: ReferenceDataType.Translate }).subscribe((data)=>val.help = data);
                val.help = this.getReferenceData({ Key: val.help, DataType: ReferenceDataType.Translate });
            }
            //Get the drop down values for select
            if (val.hasOwnProperty("template") &&
                val["template"]["stype"] == "select"
                && val["template"]["svalue"] != null) {
                val.template.searchoptions.value = this.GetMasterSearchValues(val.template.svalue, true);

            }
            if (val.hasOwnProperty("template") &&
                val["template"]["stype"] == "select"
                && val["template"]["evalue"] != null) {
                val.template.editoptions.value = this.GetMasterSearchValues(val.template.svalue, false);//{value:"FE:FedEx;IN:InTime;TN:TNT;AR:ARAMEX"}
            }
        });
    }

    public GetMasterSearchValues = (key: string, includeAll: boolean) => {
        var list = this.getReferenceData({ Key: key.trim(), DataType: ReferenceDataType.CachedData });
        return (list != null) ? this.utility.prepareSelectList(list, includeAll) : '';
    }

    private ShowSubGrid = (subgrid_id, row_id) => {
        if (!this.options.customSubGridFuns) {
            var subgrid_table_id;
            subgrid_table_id = subgrid_id + "_t";
            //Move to higher level
            this.subGrid = $("<table id='" + subgrid_table_id + "' class='scroll'></table>");
            var tmpId = this.id + "_sub";

            var subPgrId = subgrid_table_id + "_p";
            var subpager = $("<div id='" + subPgrId + "_p'></div>");
            var container = $('<div></div>');
            container.append(this.subGrid);
            container.append(subpager);

            $("#" + subgrid_id).html(container);

            //Hard coding
            this.subGridOptions.height = 'auto';
            //subGridOptions.scroll = 1;//Virtual scrolling
            this.subGridOptions.width = 'auto';
            this.subGridOptions.rowNum = 10;
            //subGridOptions.shrinkToFit = true;
            this.subGridOptions.showScrollOntop = false;

            var rowData = this.grid.getRowData(row_id);

            if (this.subGridOptions.sortable == true) {
                this.subGridOptions.sortable = (perm) => {
                    //save new sort state...
                    var columnOrder = this.subGrid.jqGrid("getGridParam", "remapColumns");
                    this.UpdatePersistence(columnOrder, this.subGrid, tmpId);
                }
            }

            $.extend(this.subGridOptions, {
                resizeStop: (width, index) => {
                    var perm = this.subGrid.jqGrid('getGridParam', 'columnPermutation');
                    this.UpdatePersistence(perm, this.subGrid, tmpId);
                }
            });
            $.extend(this.subGridOptions, {
                onSortCol: (index, columnIndex, sortOrder) => {
                    var perm = this.subGrid.jqGrid('getGridParam', 'columnPermutation');
                    this.UpdatePersistence(perm, this.subGrid, tmpId);
                }
            });

            this.subGridOptions.datatype = (postdata) => {
                var searchInput = this.utility.PopulateSearchCriteria(postdata, 'BySearch');
                searchInput.rowData = rowData;
                //If you use a pager, it is useful to call your_grid.setGridParam({lastpage: your_number}) to specify the number of pages. 
                return this.getSubData(searchInput).subscribe(
                    (result) => {
                        var gridInputData = this.PrepareInput(result, this.subGrid);
                        this.subGrid[0].addJSONData(gridInputData)
                    }
                );
            }

            this.subGridOptions.pager = subgrid_table_id + "_p";
            this.subGrid.jqGrid(this.subGridOptions);

            this.subGrid.jqGrid('navGrid', '#' + subPgrId, { addfunc: null, delfunc: null, cloneToTop: true, multipleSearch: null, view: false, edit: false, add: false, del: false, search: false }, {}/*Edit*/, {}/*Add*/, {}/*Delete*/, {}/*search*/, {}/*View*/)

            this.UpdateColOrdersPersistence(this.subGridPersistence, this.subGrid);


            if (this.subGridOptions.exportToExcel) {
                this.NavButtonAdd(
                    {
                        title: this.getReferenceData({ Key: 'exportToExcel', DataType: ReferenceDataType.Translate }),
                        caption: "",
                        //buttonicon: "ui-icon-calculator",
                        buttonicon: "ui-icon-arrowthickstop-1-s",
                        onClickButton: () => {
                            this.exportsubData.emit({ format: "Excel", data: rowData });
                        }
                    }, this.subGrid, subPgrId, false);
            }
            if (this.subGridOptions.showColchooser) {
                let colChooserTitle = this.convertCharCodes(this.getReferenceData({ Key: 'columnChooser', DataType: ReferenceDataType.Translate }));
                this.NavButtonAdd(
                    {
                        title: colChooserTitle,
                        caption: "",
                        buttonicon: " ui-icon-shuffle",
                        onClickButton: () => {
                            this.onColumnChooser(500, 500, colChooserTitle, this.subGrid, tmpId);
                        },
                    }, this.subGrid, subPgrId, false)
            }
        }
        else {

            var data = this.grid.getRowData(row_id);
            this.options.customSubGridFuns(data);
        }
    }

    private SaveOnTab = () => {
        var editable = null;
        $.each(this.options['colModel'], (index, val) => {
            if (this.IsEditable(val) === true) {
                editable = index;
            }
        });
        //Add tab control to last column
        if (editable) {

            if (!this.options['colModel'][editable].hasOwnProperty('editoptions')) {
                this.options['colModel'][editable].editoptions = {};
            }

            //options['colModel'][editable].editoptions.dataInit = function (elem) {
            //}
            this.options['colModel'][editable].editoptions.dataEvents =
                [{
                    type: 'keydown',
                    fn: (e) => {
                        var key = e.charCode || e.keyCode;
                        if (key == 9)//tab
                        {
                            //grid.saveRow(currentSel, false, 'clientArray');
                            this.options.saveRowWithValidation(this.currentSel);
                            var index = this.grid.jqGrid('getInd', this.currentSel);
                            index++;
                            while (index <= this.grid.getDataIDs().length) {
                                var pt = this.grid.jqGrid('getGridRowByNumber', index);
                                if (this.options.isEditable.call(this.grid, pt.id) == true) {
                                    this.grid.jqGrid('setSelection', pt.id, true);
                                    break;
                                }
                                index++;
                            }//end while
                        }
                    }
                }];
        }
    }

    private GetFormatterValue = (obj) => {
        if (obj.hasOwnProperty('formatter')) {
            return obj.formatter;
        }
        if (obj.hasOwnProperty('template') && obj.template.hasOwnProperty('formatter')) {
            return obj.template.formatter;
        }
    }

    private IsEditable = (obj) => {

        if (obj.hasOwnProperty('editable')) {
            return obj.editable;
        }
        if (obj.hasOwnProperty('template') && obj.template.hasOwnProperty('editable')) {
            return obj.template.editable;
        }
        return false;
    }

    private onColumnChooser = (aWidth, aHeight, aTitle, grd, grdId) => {

        function gridColumnsWidth() {
            var sum = 0;
            var columnOrder = grd.jqGrid("getGridParam", "remapColumns");
            var colModels = grd.getGridParam('colModel');

            $.each(colModels, function (index, item) {
                var IsHidden = item.hidden;
                if (!IsHidden)
                    sum += item.width;
            });
            return sum + 5;
        }
        //var orgWidth = grd.getGridParam('width');
        var orgWidth = gridColumnsWidth();
        var SumOfColWidth = 0;

        grd.columnChooser({
            shrinkToFit: false,
            autowidth: false,
            msel_opts: {
                dividerLocation: 0.5
            },
            dialog_opts: {
                title: aTitle,
                width: aWidth,
                height: aHeight
            },
            done: (perm) => {
                if (perm) {
                    grd.jqGrid("remapColumns", perm, true, false);

                    var columnOrder = grd.jqGrid("getGridParam", "remapColumns");
                    grd.setGridParam({ tblwidth: orgWidth });
                    grd.css('width', orgWidth);
                    $('table.ui-jqgrid-htable').css('width', orgWidth);
                    this.UpdatePersistence(columnOrder, grd, grdId);
                }
            }
        });
        $('#colchooser_' + grd[0].p.id).dialog("option", "resize")();
    }

    private RowsTosave = () => {
        var rowsToSave = [];
        if (this.options.multiselect) {
            var rowNums = this.grid.jqGrid('getGridParam', 'selarrrow');
            $.each(rowNums, (key, value) => {
                this.options.SaveRowWrapper(value);
                rowsToSave.push(this.grid.jqGrid('getRowData', value));
            });
        }
        else {
            rowsToSave = this.grid.jqGrid('getRowData');
        }
        return rowsToSave;
    }

    private ScreenBottom = () => {
        return $(window).scrollTop() + $(window).height();
    }

    // private SetInitializeHeadersAndFootersPosition = (targetDiv) => {
    //     var dataTableTop = this.dataTable.offset().top;
    //     //topPagerTop = topPagerTable.offset().top;
    //     var dataTableHeight = dataTableTop + this.dataTable.outerHeight();
    //     var windowTop = $(window).scrollTop();
    //     var windowBottom = this.ScreenBottom();
    //     if (windowTop > dataTableTop && windowTop < dataTableHeight) {
    //         targetDiv.offset({ top: windowTop, left: targetDiv.offset().left });
    //     }
    // }
    private Save = () => {
        this.options.saveRowWithValidation(this.currentSel)
        var rowsTosave = this.RowsTosave();
        this.options.dirty = false;
        this.saveData.emit(rowsTosave);
    }
    private Add = () => {
        var newlyAdded = {};
        if (this.options.addNew) {
            var parameters = {
                rowID: this.addCounter,
                initdata: {},
                position: "first",
                useDefValues: true,
                useFormatter: true,
                addRowParams: { extraparam: {} }
            }
            this.grid.jqGrid('addRow', parameters);
            this.grid.jqGrid('setSelection', this.addCounter, true);
            newlyAdded = this.grid.getRowData(this.addCounter);
            this.addCounter--;
        }
        this.add.emit({ row: newlyAdded });
    }
    private Remove = () => {
        var rowNums = null;
        if (this.options.multiSelect) {
            rowNums = this.grid.jqGrid('getGridParam', 'selarrrow');
            if (this.options.removeFromGrid) {
                $.each(rowNums, () => {
                    this.grid.delRowData(this);
                });
            }
        } else {
            rowNums = this.grid.jqGrid('getGridParam', 'selrow');
            if (this.options.removeFromGrid) {
                this.grid.delRowData(rowNums);
            }
        }
        this.remove.emit({ data: rowNums });
    }

    private UpdatePersistence = (colOrders, grd, ctrlId) => {
        var d = this.GetPersistenceData(colOrders, grd, ctrlId);
        this.updatePersistence.emit({ ControlId: ctrlId, ControlData: d });
    }

    private UpdateColOrdersPersistence = (per, grd) => {
        if (per && per.permutation && per.permutation.length > 0) {
            var colModel = grd.jqGrid('getGridParam', 'colModel');
            if (per.permutation.length == colModel.length) {
                grd.jqGrid('setGridParam', { 'columnPermutation': per.permutation });
                grd.jqGrid("remapColumns", per.permutation, true, false);
            }
            else {
                per.permutation = null;
                this.UpdatePersistence(null, grd, this.grid[0].id);
            }
        }
    }

    private GetPersistenceData = (permutation, grd, grdId) => {

        var sortState = {
            sortname: grd.getGridParam('sortname'),
            sortorder: grd.getGridParam('sortorder')
        }
        grd.jqGrid('setGridParam', { 'columnPermutation': permutation });
        var colModel = grd.getGridParam('colModel');

        var columnsState = {
            id: grdId,//grd[0].id,//$scope.id,
            Type: "Grid",
            colStates: colModel
                .filter(function (c) { return ['rn', 'cb', 'subgrid'].indexOf(c.name) === -1 })
                .map(function (c) { return { cn: c.name, wd: c.width, hd: c.hidden }; }),
            permutation: permutation,
            sortState: sortState
        }
        return columnsState;
    };

    // private ShowScrollOntop = () => {

    //     var $gview = this.grid.closest(".ui-jqgrid-view"),
    //         $topToolbar = $gview.find(">.ui-jqgrid-hdiv"),

    //         $bdiv = this.grid.closest(".ui-jqgrid-bdiv"),
    //         resetTopToolbarHeight = function () {
    //         };
    //     $topToolbar.css({
    //         overflowX: "scroll", overflowY: "hidden"
    //     })
    //         .append($("<div id='topScroll" + this.pagerId + "'>"));
    //     resetTopToolbarHeight();
    //     $topToolbar.scroll(function () {
    //         $bdiv.scrollLeft($(this).scrollLeft());
    //     });
    //     // detect scrolling of the grid
    //     $bdiv.scroll(function () {
    //         // synchronize the srollbar of the toppbar
    //         $topToolbar.scrollLeft($(this).scrollLeft());
    //     });
    // }
}