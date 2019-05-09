import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { SearchRepository, PostData, Options, Filter, GeneralCriterion } from './tcmcore.jqgrid.objects';
import { Observable, Subject, AsyncSubject } from 'rxjs/Rx';

import moment from "moment";


@Injectable()
export class JQGridUtilities {

    constructor( @Inject(LOCALE_ID) private locale) {

    }

    public GetCurrentDateFormat = () => {
        return this.locale == 'sv-SE' ? 'YYYY-MM-DD' : 'MM/DD/YYYY';
    }


    /**
     * 
     * @param postdata
     * @param criteriaType
     */
    public PopulateSearchCriteria = (postdata: PostData, criteriaType: string): SearchRepository => {
        var repository = new SearchRepository();
        repository.CriteriaType = criteriaType;
        repository.Options = <Options>{};

        repository.Options.page = postdata.page;
        repository.Options.rows = postdata.rows;
        //calculate browse from and to
        var browsefrom = (postdata.page - 1) * postdata.rows;
        var browseTo = browsefrom + Number(postdata.rows);

        repository.Options.BrowseFrom = browsefrom + 1;
        repository.Options.BrowseTo = browseTo;

        if (postdata.hasOwnProperty("CaseSensitive"))
            repository.Options.CaseSensitive = postdata.CaseSensitive;
        else
            repository.Options.CaseSensitive = false;

        if (postdata.hasOwnProperty("ShowActive"))
            repository.Options.ShowActive = postdata.ShowActive
        else
            repository.Options.ShowActive = true;

        if (postdata.hasOwnProperty("ShowInactive"))
            repository.Options.ShowInactive = postdata.ShowInactive
        else
            repository.Options.ShowInactive = true;

        if (postdata.sidx.indexOf(' ') == -1)
            repository.Options.SortField = postdata.sidx
        else
            repository.Options.SortField = postdata.sidx.substr(0, postdata.sidx.indexOf(' '));

        repository.Options.SortOrder = this.SortOrder(postdata.sord);

        repository.SearchCriteria = [];


        if (postdata._search) {
            var options = this.GetSearchOptions(postdata.filters);
            repository.SearchCriteria = options.concat(repository.SearchCriteria);
        }

        return repository
    }
    public SortOrder = (jqSort: string): string => {
        var sort = "A";

        switch (jqSort) {
            case "asc":
                sort = "A";
                break;
            case "desc":
                sort = "D";
                break;
        }
        return sort;
    }

    public AddToCriteria = (value, groupOperator, criteria) => {
        if (value.data !== 'SelectAll') {
            var generalCriteria = <GeneralCriterion>{};
            generalCriteria.SearchFieldId = value.field;
            generalCriteria.SearchOperatorId = this.GetTCMSearchOperator(value.op);

            var data = value.data;
            var separators = [' ', ','];
            var tempFormatdate = data.split(new RegExp(separators.join('|'), 'g'));


            

            //TO DO
            //dirty hack
            if (moment(tempFormatdate[0], this.GetCurrentDateFormat(), true).isValid()) {
                var tempDate;
                var isoDate = moment(tempFormatdate[0]).format("YYYY-MM-DD");
                tempDate = isoDate;

                if (tempFormatdate.length > 1) {
                    tempDate = isoDate + "T" + tempFormatdate[1];
                }
                else if (tempFormatdate.length == 1 && value.op == "eq") {
                    var maxDate = new Date(isoDate.toString());
                    maxDate.setDate(maxDate.getDate() + 1);
                    value.data = moment(maxDate.toString()).format("YYYY-MM-DD");
                    value.op = "lt";
                    this.AddToCriteria(value, groupOperator, criteria);

                    generalCriteria.SearchOperatorId = this.GetTCMSearchOperator("ge");
                }
                data = tempDate;
            } else if (tempFormatdate.length > 1) {
                if (!isNaN(tempFormatdate[0]) && !isNaN(tempFormatdate[1])) { data = data.replace(",", "."); }
            }

            generalCriteria.SearchValue = data;
            generalCriteria.SearchConcatenatorId = groupOperator;
            criteria.push(generalCriteria);
            return criteria;
        }
    }


    public GetTCMSearchOperator = (gridOperator) => {
        var tcmOperator = "=";

        switch (gridOperator) {
            case "eq":
                tcmOperator = "=";
                break;
            case "ne":
                tcmOperator = "<>";
                break;
            case "lt":
                tcmOperator = "<";
                break;
            case "le":
                tcmOperator = "<=";
                break;
            case "le":
                tcmOperator = "<=";
                break;
            case "gt":
                tcmOperator = ">";
                break;
            case "ge":
                tcmOperator = ">=";
                break;
            case "bw":
                tcmOperator = "BEGINS";
                break;
            case "bn":
                //does not begin with
                tcmOperator = "?";
                break;
            case "in":
                tcmOperator = "CONTAINS";
                break;
            case "ni":
                //is not in
                tcmOperator = "?";
                break;
            case "ew":
                //Ends with
                tcmOperator = "?";
                break;
            case "en":
                //does not end with
                tcmOperator = "?";
                break;
            case "cn":
                tcmOperator = "CONTAINS";
                break;
            case "nc":
                //Does not contain.
                tcmOperator = "?";
                break;
            default:
                tcmOperator = "=";
        }
        return tcmOperator;
    }


    public GetSearchOptions = (filters) => {

        var criteria = new Array<GeneralCriterion>();
        if (filters) {
            filters = JSON.parse(filters);

            if (filters.rules && filters.rules.length > 0) {
                var groupOperator = filters.groupOp;
                for (let rule of filters.rules) {
                    this.AddToCriteria(rule, groupOperator, criteria);
                }
            }

            if (filters.groups && filters.groups.length > 0) {
                for (let group of filters.groups) {
                    var groupOperator = group.groupOp;

                    for (let rule of group.rules) {
                        this.AddToCriteria(rule, groupOperator, criteria);
                    }
                }
            }
        }

        return criteria;
    }
    public prepareSelectList = (Items: any, includeAll: boolean) => {
        var list: string = "";

        for (let item of Items) {
            list = list + item.Code + ":" + item.Text + ";";
        }
        includeAll ? list = "SelectAll:All;" + list : list;
        list = list.slice(0, list.lastIndexOf(";"));
        return list;
    }
    /**
     * Method Description here...
     * @param key - Gets the list of cached objects matched by the key. 
     * @param includeAll - Include "All" text in the list dropdown.
     */
    //public GetMasterSearchValues = (key: string, includeAll: boolean) => {

    /**
     * 
     * @param key
     */
    public GetLabel = (key: string): string => {

        return key;
        //TO DO :
        //return self.filter("translate")(key);
    }

    private GetSearchOperator = (gridOperator) => {
        var tcmOperator = "=";

        switch (gridOperator) {
            case "eq":
                tcmOperator = "=";
                break;
            case "ne":
                tcmOperator = "<>";
                break;
            case "lt":
                tcmOperator = "<";
                break;
            case "le":
                tcmOperator = "<=";
                break;
            case "le":
                tcmOperator = "<=";
                break;
            case "gt":
                tcmOperator = ">";
                break;
            case "ge":
                tcmOperator = ">=";
                break;
            case "bw":
                tcmOperator = "BEGINS";
                break;
            case "bn":
                //does not begin with
                tcmOperator = "?";
                break;
            case "in":
                tcmOperator = "CONTAINS";
                break;
            case "ni":
                //is not in
                tcmOperator = "?";
                break;
            case "ew":
                //Ends with
                tcmOperator = "?";
                break;
            case "en":
                //does not end with
                tcmOperator = "?";
                break;
            case "cn":
                tcmOperator = "CONTAINS";
                break;
            case "nc":
                //Does not contain.
                tcmOperator = "?";
                break;
            default:
                tcmOperator = "=";
        }
        return tcmOperator;
    }

    private MapObjects = (original, newObj) => {
        var aProps = Object.getOwnPropertyNames(original);

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            var arr = propName.split(".");
            if (arr && arr.length > 1) {
                newObj[arr[0]][arr[1]] = original[propName];
            } else
                newObj[propName] = original[propName];
        }

        return newObj
    }
}
