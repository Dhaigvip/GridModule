import {
    Component, QueryList, ViewChild, ViewChildren,
    ContentChild, Directive, ContentChildren, OnInit, Inject, LOCALE_ID, ReflectiveInjector
} from '@angular/core';
import { jqGrid, SearchRepository, ClientResponse, ReferenceData, ReferenceDataType } from '../library/index';
import { TestGrid } from './Data/TestGrid';
import { EditableGrid } from './Data/EditableGrid';
import { persistence } from './Data/EditableGridPersistence';

import { Fund, FundIdentity, FundDistributor } from './Data/Fund';
import { Observable, Subject, AsyncSubject } from 'rxjs/Rx';
import { MockService } from './Data/app.mockservice';
import { TranslateService } from "ng2-translate";
import { IStaticDataService } from "tcm-base-module";




@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    filterOptions: any;
    orderOptions: any = {};
    aggOrderOptions: any = {};
    aggOrderPersistence = persistence;
    public rowData: any[];
    public columnDefs: any[];


    private GetRowData() {

    }


    aggOrdersubOptions: any = {};
    table_id = 'grdAggregatedOrders';
    subgrid_table_id = this.table_id + '_sub';



    //Gets Access to multiple grids in the templete.
    //@ViewChildren(JQGrid)
    //private jqGridList: QueryList<JQGrid>;
    //var grd = this.jqGridList.filter((el) => el.id === "grdAggregatedOrders");
    //var x = grd[0].GetColModelForExport();


    //Get access to single named element
    @ViewChild('aggOrder') aggGrid: jqGrid

    constructor(private mockService: MockService,
        private translate: TranslateService,
        @Inject(LOCALE_ID) private locale,
        @Inject('IStaticDataService') private staticData: IStaticDataService) {
        
    }


    private createRowData() {
        //var postdata: SearchRepository;
        //return this.mockService.GetAggOrderData(postdata);
        var searchCriteria = {
            Options: { BrowseFrom: 1, BrowseTo: 10000, page: 1, rows: 10000, SortField: "AggregatedOrderId", SortOrder: "D" },
            CriteriaType: "BySearch",
            SearchCriteria: [],
            rowData: [],
            ListCriteria: [],
            TotalRecords: 10000

        }
        var values = this.GetAggOrderData(searchCriteria).subscribe((result: ClientResponse) => {
            this.rowData = result.Data.SomeList;
            console.log(this.rowData);
        }
        );
        console.log(values);
        //  return this.countries;
    }


    public getData(searchCriteria) {
        var values = this.GetAggOrderData(searchCriteria).subscribe((result: ClientResponse) => {
            this.rowData = result.Data.SomeList;
            console.log(this.rowData);
        }
        );
    }

    ngOnInit() {

        this.aggOrdersubOptions = $.extend(true, {}, { rowNum: 10, exportToExcel: true, showColchooser: true, sortable: true });

        this.filterOptions = {
            searchOnEnter: true,
            autosearch: true,
            stringResult: true,
            searchOperators: true
        }
        this.aggOrderOptions = $.extend(true, {}, EditableGrid);
        this.orderOptions = $.extend(true, {}, TestGrid);
        this.aggOrdersubOptions = $.extend(true, {}, this.orderOptions, TestGrid);
    }


    Save = (data: any) => {
        if (data != null && data.data != null && data.data.length > 0) {
            data.data[0].ErrorNumber = 50;
            data.data[0].ErrorText = "Text To Update";
            this.aggGrid.UpdateRows(data.data, null, null, ["ErrorNumber", "ErrorText", "ObjectVersion"]);
        }
    }

    ExportAggOrder = (data: any) => {
        this.aggGrid.GetColModelForExport();
    }
    GetReferenceData = (data: ReferenceData): any => {
        var x = 0;
        if (data.Key != null && data.DataType == ReferenceDataType.Translate) {
            return this.translate.instant(data.Key);
        }
        if (data.Key != null && data.DataType == ReferenceDataType.CachedData) {
            return this.staticData.GetStaticDataItems(data.Key);
        }
        return "Vipul"
    }

    ExportSub = (data: any) => {

    }

    UpdatePersistence = (data) => {
        var x = 0;
    }
    GetOrderData = (postdata: SearchRepository): Observable<any> => {

        return this.mockService.GetOrderData(postdata);
    }
    GetAggOrderData = (postdata: SearchRepository): Observable<any> => {
        return this.mockService.GetAggOrderData(postdata);
    }

    ReloadGrid = () => {
        var x = this.aggGrid.ReloadGrid();
    }

    GetRowsToSave = () => {
        var x = this.aggGrid.GetRowsToSave();
    }
}


