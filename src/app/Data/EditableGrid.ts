import {
    boolDefaultAll, boolDefaultYes, boolEditDefaultAll, boolDefaultNo,
    numberTmpl, edtTextFieldTmpl, idTmpl, textFieldTmpl, currencyTmpl,
    edtableNoTmpl
} from '../../library/index';
import {
    searchDateTmpl, searchEditDateTimeTmpl,
    searchEditDateTmpl
} from '../../library/index';


export var EditableGrid = {
    sortname: "AggregatedOrderId",
    sortorder: "desc",
    //caption: "Agg_Ord_Overview",
    rowNum: 1000,
    colMenu: true,
    footerrow: true,
    userDataOnFooter: true,
    showFilterbar: false,
    refresh: false,
    //coloptions : {sorting:true, columns: true, filtering: true, seraching:true, grouping:false, freeze : true},
    coloptions: { sorting: true, columns: true, filtering: true, seraching: true, grouping: false },
    view: true,
    multiselect: true,
    //maxheight: 500,
    //showScrollOntop: false,
    //datatype:'local',
    height: 'auto',
    showScrollOntop: true,
    //Turn this on to show subgrid...
    subGrid: true,
    showEditbar: true,
    //showFilterbar: true,
    toppager: true,
    hideSelectAll: false,
    //Remove       
    cancelDefaultLoad: true, //Do not make default request, we want to trigger search for only orders.
    //Keep the name same as json map for original object mapping
    colModel: [
        { name: 'AggregatedOrderId', colmenu: true, label: 'agg_ord_id', jsonmap: 'AggregatedOrderId', template: idTmpl },

        { name: 'TransactionModeCode', label: 'TransactionModeCode', jsonmap: 'TransactionModeCode', template: textFieldTmpl },
        { name: 'OrderPlacementCode', label: 'OrderPlacementCode', jsonmap: 'OrderPlacementCode', template: textFieldTmpl, freeze: false },
        { name: 'PaymentChannel', label: 'PaymentChannel', jsonmap: 'PaymentChannel', template: textFieldTmpl },
        { name: 'ExternalOrderId', label: 'Ext_Ord_Id', jsonmap: 'ExternalOrderId', template: textFieldTmpl },
        { name: 'FundName', label: 'FundName', jsonmap: 'FundName', template: textFieldTmpl },
        { name: 'OrganizationName', label: 'Distributor', jsonmap: 'OrganizationName', template: textFieldTmpl },
        { name: 'OrderType', label: 'Order_type', jsonmap: 'OrderType', template: textFieldTmpl },
        { name: 'Isin', label: 'Isin', jsonmap: 'Fund.Isin', template: textFieldTmpl },
        //Extend a new object or else you risk changing original defination...
        { name: 'ErrorNo', label: 'Err_No', jsonmap: 'ErrorNo', template: $.extend(true, {}, edtableNoTmpl, { formatoptions: { decimalPlaces: 0 } }) },
        { name: 'StatusInformation', label: 'StatusInformation', jsonmap: 'StatusInformation', template: edtTextFieldTmpl },
        { name: 'TradeCurrencyId', label: 'Trade_currency', template: textFieldTmpl },
        //{ name: 'OrderGroupId', label: 'Order_grp_Id', template: idTmpl },
        { name: 'TradeDate', label: 'Trade_date', template: searchEditDateTmpl },
        { name: 'SettlementDate', label: 'settlement_date', template: searchEditDateTmpl },
        { name: 'CashSettlementDate', label: 'cash_settle_date', template: searchEditDateTmpl },
        { name: 'ExternalAccountNumber', label: 'External_Account_Number', jsonmap: 'ExternalAccountNumber', template: idTmpl },
        { name: 'ExternalAccountLabel', label: 'External_Account_Label', jsonmap: 'ExternalAccountLabel', template: textFieldTmpl },
        { name: 'OrderAmount', label: 'Order_amt', template: $.extend(true, {}, numberTmpl, { formatoptions: { decimalPlaces: 2 } }) },
        { name: 'Units', label: 'Units', template: edtableNoTmpl },
        { name: 'TradeAmount', label: 'Trade_amt', template: $.extend(true, {}, edtableNoTmpl, { formatoptions: { decimalPlaces: 2 } }) },
        { name: 'SettlementAmount', label: 'settle_amt', template: $.extend(true, {}, edtableNoTmpl, { formatoptions: { decimalPlaces: 2 } }) },
        { name: 'IsFinalised', label: 'isFinalized', template: boolDefaultNo },
        { name: 'FundPrice', label: 'Fund_price', template: edtableNoTmpl },
        { name: 'FundPriceTypeId', label: 'Fund_price_type', template: idTmpl },
        { name: 'CurrencyPrice', label: 'currency_price', template: edtableNoTmpl, hidden: true, hidedlg: true },
        { name: 'ExternalFeeAmount', label: 'ext_fee_amt', template: $.extend(true, {}, edtableNoTmpl, { formatoptions: { decimalPlaces: 2 } }), hidden: true, hidedlg: true },
        { name: 'IsPaid', label: 'isPaid', template: boolEditDefaultAll },
        { name: 'IsApprovedToSend', label: 'IsApprovedToSend', template: boolEditDefaultAll },
        { name: 'IsConfirmed', label: 'IsConfirmed', jsonmap: "IsConfirmed", template: boolEditDefaultAll },
        { name: 'IsForced', label: 'IsForced', jsonmap: "IsForced", template: boolEditDefaultAll },
        { name: 'ExternalSendDate', label: 'ExternalSendDate', template: searchEditDateTimeTmpl },
        { name: 'ExternalResponseDate', label: 'ExternalResponseDate', template: searchEditDateTimeTmpl },
        { name: 'PaymentSendDate', label: 'PaymentSendDate', template: searchEditDateTimeTmpl },
        { name: 'PaymentResponseDate', label: 'PaymentResponseDate', template: searchEditDateTimeTmpl },
        { name: 'AccountingSendDate', label: 'AccountingSendDate', template: searchEditDateTimeTmpl },
        { name: 'AccountingResponseDate', label: 'AccountingResponseDate', template: searchEditDateTimeTmpl },
        { name: 'ErrorNumber', template: textFieldTmpl, label: 'Err_No', sorttype: "int" },
        { name: 'ErrorText', label: 'ErrorText', template: textFieldTmpl, sorttype: "text" },
        { name: 'CreatedDate', label: 'CreatedDate', jsonmap: 'CreatedDate', template: searchDateTmpl },
        { name: 'ObjectVersion', hidden: true, hidedlg: true },
        { name: 'ExtPosReference', key: true, hidden: true, hidedlg: true }

    ],
    isEditable: function (rowId) {
        var IsFinalised = this.jqGrid('getRowData', rowId).IsFinalised;
        if (IsFinalised == 'true') return false;
        return true;
    },
    rowattr: function (rd) {
        if (rd.IsFinalised == true) { // verify that the testing is correct in your case
            return { "class": "disabledRow" };
        }
        if (rd.ErrorNumber && rd.ErrorNumber > 0) {
            return { "class": "errorRow" };
        }
    }
};
