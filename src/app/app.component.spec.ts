import { TestBed, async } from '@angular/core/testing';

import '../library/bundles/jqgrid';

import { Component, QueryList, ViewChild, ViewChildren, ContentChild, Directive, ContentChildren } from '@angular/core';
import { jqGrid, JQGridModule, SearchRepository, ClientResponse, JQGridUtilities } from '../library/index';
import { TestGrid } from './Data/TestGrid';
import { EditableGrid } from './Data/EditableGrid';
import { persistence } from './Data/EditableGridPersistence';
import { Fund, FundIdentity, FundDistributor } from './Data/Fund';
import { Observable, Subject, AsyncSubject } from 'rxjs/Rx';
import { MockService } from './Data/app.mockservice';

@Component({
    selector: 'test',
    template: `
    <jqGrid #aggOrder="jqGrid" [dtOptions]="aggOrderOptions"
        [id]="table_id"
        [filterOptions]="filterOptions"
        [getData]="GetAggOrderData"
        [getSubData]="GetOrderData"
        [getReferenceData]="GetReferenceData($event)"
        [gridPersistence]="aggOrderPersistence"
        (saveData)="Save($event)"
        (exportData)="ExportAggOrder($event)"
        [subGridOptions]="aggOrdersubOptions"
        (updatePersistence)="UpdatePersistence($event)">
    </jqGrid>
    <br/>
    <button (click)="ReloadGrid()">Reload</button>
    <button (click)="GetRowsToSave()">GetRows</button>
    `
})
class TestGridComponent {
    orderOptions: any = {};
    aggOrderOptions: any = {};
    aggOrderPersistence = persistence;

    aggOrdersubOptions: any = {};
    table_id = 'grdAggregatedOrders';
    subgrid_table_id = this.table_id + '_sub';

    @ViewChild('aggOrder') aggGrid: jqGrid

    constructor(private mockService: MockService) { }

    ngOnInit() {
        this.aggOrdersubOptions = $.extend(true, {}, { rowNum: 10, exportToExcel: true, showColchooser: true, sortable: true });

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

describe('TestGridComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestGridComponent, jqGrid],
            providers: [MockService, JQGridUtilities]
        });
    });

    it('Grid init test', async(() => {
        const fixture = TestBed.createComponent(TestGridComponent);
        //fixture.componentInstance.text = 'foo';
        fixture.detectChanges();
        const el = fixture.debugElement.nativeElement as HTMLElement;
        expect(1 + 1).toBe(2);
        //expect(el.querySelector('p').textContent).toBe('foo');
    }));
});
