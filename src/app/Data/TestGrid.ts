import { boolDefaultAll, boolDefaultYes, boolEditDefaultAll, boolDefaultNo, 
    numberTmpl, edtTextFieldTmpl, idTmpl, textFieldTmpl, currencyTmpl, 
    edtableNoTmpl } from '../../library/index';
import { searchDateTmpl, searchEditDateTimeTmpl, 
    searchEditDateTmpl } from '../../library/index';


export var TestGrid = {
    sortname: "DistributorName",
    sortorder: "asc",
    caption: "Funds_Overview",
    rowNum: 1000,
   
    //maxheight: 500,    
    height: 'auto',
    showScrollOntop: true,
    view: true,
    showSave: false,
    toppager: true,
    
    colModel: [

        { name: 'FundId', label: 'FundId', key: true, jsonmap: 'Identity.FundId', template: $.extend(true, {}, idTmpl, { hidden: true, hidedlg: false, searchoptions: { searchhidden: true } }) },
        { name: 'FundName', label: 'Name', jsonmap: 'Identity.FundName', template: textFieldTmpl, NavigateTo: "app.fundInfo", classes: 'pointer' },
        { name: 'ShareClassId', label: 'ShareClass', jsonmap: 'Identity.ShareClassId', template: textFieldTmpl, NavigateTo: "app.fundInfo", classes: 'pointer' },
        { name: 'ISIN', label: 'Isin', jsonmap: 'Identity.Isin', template: textFieldTmpl, NavigateTo: "app.fundInfo", classes: 'pointer' },
        { name: 'BaseCurrencyId', label: 'BaseCurrency', jsonmap: 'Identity.BaseCurrencyId', template: $.extend(true, {}, currencyTmpl, { editable: false }) },
        { name: 'SubscriptionCutOffTime', label: 'SubscriptionCutOffTime', jsonmap: 'SubscriptionCutOffTime', template: textFieldTmpl },
        { name: 'RedemptionCutOffTime', label: 'RedemptionCutOffTime', jsonmap: 'RedemptionCutOffTime', template: textFieldTmpl },
        { name: 'IsPrepaid', label: 'IsPrepaid', jsonmap: 'IsPrepaid', template: boolDefaultAll },
        { name: 'LatestNav', label: 'NAV', jsonmap: 'LatestNav', template: numberTmpl, NavigateTo: "app.NAVOverview", classes: 'pointer' },
        { name: 'LatestNavDate', label: 'NAV_Date', jsonmap: 'LatestNavDate', template: searchDateTmpl },
        { name: 'DistributorName', label: 'Distributor', jsonmap: 'Distributor.OrganizationName', template: textFieldTmpl, NavigateTo: "app.distributorInfo", classes: 'pointer' },
        { name: 'OrganizationId', label: 'DistributorId', jsonmap: 'Distributor.OrganizationId', template: $.extend(true, {}, idTmpl, { hidden: true, hidedlg: false, searchoptions: { searchhidden: true } }) },
        { name: 'IsActive', label: 'Active', jsonmap: 'IsActive', template: boolDefaultYes },
        { name: 'ObjectVersion', hidden: true, hidedlg: true },
        { name: 'ExtPosReference', hidden: true, hidedlg: true }
    ]
};




