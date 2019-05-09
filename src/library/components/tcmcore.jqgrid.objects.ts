export class PostData {
    constructor() {
    }
    _search: string;
    page: number;
    rows: number;
    sidx: string; // Sort Fields
    sord: string; //Sort Order
    filters: Filter;
    ShowActive: boolean;
    ShowInactive: boolean;
    CaseSensitive: boolean;
}
export enum ReferenceDataType {
    Translate,
    CachedData
}

export class ReferenceData {
    constructor() {
    }
    Key: string;
    DataType: ReferenceDataType;
}
export class ClientResponse {
    constructor() {
    }
    TotalRecords: number;
    Success: boolean;
    Data: any;
    ErrorList: Array<Error>
}
export interface Error {
    ErrorMessage: string;
    ErrorCode: string;
    ExtErrorPosReference: string;
    SystemErrorMessage: string;
}
export interface GridObject {
    records: number;
    total: number;
    sEcho: string;
    rows: any;
    page?: number;
    userdata?: any;
}

export class Rule {
    field: string;
    op: string;
    data: string;
}
export class Filter {
    constructor() {
        this.rules = new Array<Rule>();
    }
    rules: Array<Rule>;
    groupOp: string;
}
export interface GeneralCriterion {
    SearchConcatenatorId: string;
    SearchFieldId: string;
    SearchOperatorId: string;
    SearchValue: string;
    ExtPosReference: string;

}
export interface Options {
    page: number;
    rows: number;
    ShowActive?: boolean;
    ShowInactive?: boolean;
    BrowseFrom?: number;
    BrowseTo?: number;
    SortField: string;
    SortOrder: string;
    CaseSensitive?: boolean;
}
export interface SimpleCriterion {
    SearchFieldId: string;
    SearchValue: string;
    ExtPosReference: string;
}
export class SearchRepository {
    constructor() {
        this.SearchCriteria = new Array<GeneralCriterion>();
        this.ListCriteria = new Array<SimpleCriterion>();
        this.Options = <Options>{};
    }
    Options: Options;
    rowData: any;
    SearchCriteria: Array<GeneralCriterion>;
    ListCriteria: Array<SimpleCriterion>;
    CriteriaType: string;
    TotalRecords: number;
}