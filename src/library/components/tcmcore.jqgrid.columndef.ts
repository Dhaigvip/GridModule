import { LOCALE_ID } from "@angular/core";

//Boolean
export var boolTmpl = {
    formatter: 'checkbox', sorttype: "text", align: 'center',
    width: 100, edittype: 'checkbox',
    searchoptions: {
        defaultValue: "All",
        searchOperMenu: true,
        value: 'SelectAll:All;1:Yes;0:No'
    },
    editoptions: { value: "true:false" }, stype: "select"
}

export var boolDefaultAll = $.extend(true, {}, boolTmpl, { searchoptions: { defaultValue: "All" } });
export var boolEditDefaultAll = $.extend(true, {}, boolTmpl, { editable: true, searchoptions: { defaultValue: "All" } });
export var boolEditDefaultNo = $.extend(true, {}, boolTmpl, { editable: true, searchoptions: { defaultValue: "No" } });
export var boolDefaultNo = $.extend(true, {}, boolTmpl, { searchoptions: { defaultValue: "No" } });
export var boolDefaultYes = $.extend(true, {}, boolTmpl, { searchoptions: { defaultValue: "Yes" } });

//Autocomplete
export var baseTmpl = {
    width: 150, sorttype: "text", search: true, stype: 'text',
    searchOperators: true,
    searchoptions: {
        searchOperMenu: true,
        sopt: ["bw", "eq", "cn"]
    }
}

export var edtbaseTmpl = $.extend(true, {}, baseTmpl, { editable: true, });



//Fund Auto Complete
export var autoCompleteFundTmpl = $.extend(true, {}, edtbaseTmpl, {
    //searchoptions: {
    editoptions: {
        //searchOperMenu: true,
        dataInit: function (element) {
            var self = $(this);
            $(element).autocomplete({
                source: function (request, response) {
                    var fn = self.jqGrid('getGridParam', 'getColumnData');
                    var data = fn("Fund", request.term).then(function (data) {
                        response(data);
                    })
                },
                select: function (event, ui) {
                    var rowId = self.jqGrid('getGridParam', 'selrow');
                    self.jqGrid('setCell', rowId, "FundId", ui.item.value);
                    self.jqGrid('setCell', rowId, "FundName", ui.item.label);
                }
            });
        }
    }
});


export var idTmpl = {
    width: 100, sorttype: "int",
    coloptions: { sorting: true, columns: true, filtering: true, seraching: true },
    searchoptions: {
        searchOperMenu: true,
        sopt: ['eq', 'gt', 'lt', 'ge', 'le', 'bt']
    }
}

//Number
function checkIfPOsitive(val, name) {
    var result = [];
    if (val && LOCALE_ID.toString() === 'sv-SE') {
        val = String(val).replace(",", ".");
    }
    if (val >= 0) {
        result.push(true);
    }
    else {
        result.push(false);
        result.push(name + " should be positive");
    }
    return result;
}

function numFormat(cellvalue, options, rowObject, _act) {
    if (cellvalue && cellvalue != null && this.p.locale === 'sv') {
        cellvalue = String(cellvalue).replace(",", ".");
    }
    var myVal = null;
    if (cellvalue != null && cellvalue !== "") { myVal = $.fn.fmatter.call(this, "number", cellvalue, options, rowObject, _act); }

    if (myVal === null || myVal == 'undefined' || myVal == "null") return '';
    return myVal;
}

function numUnformat(cellvalue, op, rowObject) {
    if (cellvalue) {
        this.p.locale === 'sv' ? cellvalue = String(cellvalue).replace(",", ".").replace(/ /g, "") : cellvalue = String(cellvalue).replace(",", "");
    }

    if (cellvalue == null) return '';
    return cellvalue;
}

export var numberTmpl = {
    width: 100, sorttype: "float", align: 'right',
    search: true, defaultvalue: null,
    //formatter: 'number',
    formatter: numFormat, unformat: numUnformat,
    formatoptions: { decimalPlaces: 6, defaultValue: '' }, searchOperators: true,
    coloptions: { sorting: true, columns: true, filtering: true, seraching: true },
    searchoptions: {
        searchOperMenu: true,
        sopt: ["eq", "lt", "le", "gt", "ge", "ne"]
    },
    cellattr: function (rowid, cellvalue) {
        if (cellvalue) {
            this.p.locale === 'sv' ? cellvalue = String(cellvalue).replace(",", ".").replace(/ /g, "") : cellvalue = String(cellvalue).replace(",", "");
        }
        var cls = '';
        isNaN(parseFloat(cellvalue)) ? cls = '' : cls = (parseFloat(cellvalue) >= 0 ? '' : ' style="color:red;font-weight:bold"');
        return cls;
    }
};

export var edtPosNoTmpl = $.extend(true, {}, numberTmpl, { editable: true, editrules: { custom: true, custom_func: checkIfPOsitive } });

//, formatter: numFormat, unformat: numUnformat,
export var edtableNoTmpl = $.extend(true, {}, numberTmpl, { editable: true });

//Selects
export var selectTmpl = {
    width: 100, sorttype: "text", search: true, stype: 'select',
    searchoptions: {
        searchOperMenu: true,
        sopt: ["eq", "ne"]
    }
}

export var currencyTmpl = $.extend(true, {}, selectTmpl, {
    editable: true,
    svalue: "CURRENCY", evalue: "CURRENCY", edittype: 'select',
    formatter: "select",
    editrules: { required: true },
    editoptions: { value: {} }
});

export var currencyTmplNoEdt = $.extend(true, {}, selectTmpl, {
    svalue: "CURRENCY", evalue: "CURRENCY", edittype: 'select',
    formatter: "select",
    editoptions: { value: {} }
});
export var fundPriceTypeTmpl = $.extend(true, {}, selectTmpl, {
    editable: true, svalue: "FUND_PRICE_TYPE", evalue: "FUND_PRICE_TYPE", edittype: 'select',
    formatter: "select",
    editrules: { required: true },
    editoptions: { value: {} }
});

export var payEntityTmpl = $.extend(true, {}, selectTmpl, {
    editable: true, svalue: "PAYMENT_ENTITY", evalue: "PAYMENT_ENTITY", edittype: 'select',
    formatter: "select",
    editrules: { required: true },
    editoptions: { value: {} }
});

//Text
export var textFieldTmpl = {
    width: 150, sorttype: "text", search: true, stype: 'text',
    searchOperators: true,
    searchoptions: {
        searchOperMenu: true,
        sopt: ["bw", "eq", "cn"]
    }
}

export var edtTextFieldTmpl = $.extend(true, {}, textFieldTmpl, { editable: true, });