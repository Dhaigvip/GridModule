import { Injectable } from '@angular/core';
import { SearchRepository, ClientResponse } from '../../library/index';

import { Fund, FundIdentity, FundDistributor } from './Fund';
import { Observable, Subject, AsyncSubject } from 'rxjs/Rx';
import { ObservableCreator } from './ObservableCreater';
import { AggregatedOrder } from './AggregatedOrder';

@Injectable()
export class MockService {
    //Mock Data
    private FundList = [];
    private AggOrderList = [];

    constructor() {
        this.MockFundList();
        this.MockAggOrderList();
    }

    private MockFundList = (): any => {
        if (this.FundList.length > 0) return;
        for (var i = 0; i < 10; i++) {
            var f = new Fund();
            f.Identity = new FundIdentity();
            f.Identity.BaseCurrencyId = 'SEK';
            f.Identity.FundId = i.toString();
            f.Identity.FundName = 'FundName' + i.toString();
            f.Identity.Isin = "Isin" + i.toString();
            f.Identity.ShareClassId = 'ShareClassId' + i.toString();

            f.Distributor = new FundDistributor();
            f.Distributor.DistributorName = f.Identity.FundId + 'Distributor';
            f.Distributor.OrganizationId = i.toString();

            f.ExtPosReference = i.toString();
            f.IsActive = true;
            f.IsPrepaid = true;
            f.LatestNav = 100.99;
            f.LatestNavDate = new Date();
            f.ObjectVersion = i.toString();
            f.RedemptionCutOffTime = '10:00';
            f.SubscriptionCutOffTime = '11:00';
            this.FundList.push(f);
        }
    }

    private MockAggOrderList = (): any => {
        if (this.AggOrderList.length > 0) return;
        for (var i = 0; i < 10000; i++) {
            var aggOrder = new AggregatedOrder();
            aggOrder.AccountingResponseDate = new Date()
            aggOrder.AccountingSendDate = new Date()
            aggOrder.AggregatedOrderId = i.toString()
            aggOrder.CashSettlementDate = new Date()
            aggOrder.CreatedDate = new Date()
            aggOrder.CurrencyPrice = 10.00
            aggOrder.ErrorNo = null
            aggOrder.ErrorNumber = null
            aggOrder.ErrorText = ""
            aggOrder.ExternalAccountLabel = "ExternalAccountLabel" + i.toString()
            aggOrder.ExternalAccountNumber = i.toString() + 123456
            aggOrder.ExternalFeeAmount = 100.234
            aggOrder.ExternalOrderId = "ExternalOrderId" + i.toString()
            aggOrder.ExternalResponseDate = new Date()
            aggOrder.ExternalSendDate = new Date()
            aggOrder.ExtPosReference = i.toString()
            aggOrder.FundName = "FundName" + i.toString()
            aggOrder.FundPrice = 10.89
            aggOrder.FundPriceTypeId = "SUB"
            aggOrder.IsApprovedToSend = true
            aggOrder.IsConfirmed = false
            aggOrder.IsFinalised = false
            aggOrder.IsForced = false
            aggOrder.Isin = "12334"
            aggOrder.IsPaid = true
            aggOrder.ObjectVersion = i.toString()
            aggOrder.OrderAmount = 1000.90897
            aggOrder.OrderPlacementCode = "RED"
            aggOrder.OrderType = "SUB"
            aggOrder.OrganizationName = "OrganizationName" + i.toString()
            aggOrder.PaymentChannel = "ABC"
            aggOrder.PaymentResponseDate = new Date()

            aggOrder.PaymentSendDate = new Date()
            aggOrder.SettlementAmount = 1234.89
            aggOrder.SettlementDate = new Date()
            aggOrder.StatusInformation = "StatusInformation" + i.toString()
            aggOrder.TradeAmount = 12344.786
            aggOrder.TradeCurrencyId = "SEK"
            aggOrder.TradeDate = new Date()
            aggOrder.TransactionModeCode = "SUB"
            aggOrder.Units = 12345.76

            this.AggOrderList.push(aggOrder);
        }

    }

    public GetOrderData = (postdata: SearchRepository): Observable<any> => {
        var grdInput = this.Paginate(this.FundList, postdata.Options.rows, postdata.Options.page)
        return ObservableCreator.createFromData(grdInput);
    }

    public GetAggOrderData = (postdata: SearchRepository): Observable<any> => {
        var grdInput = this.Paginate(this.AggOrderList, postdata.Options.rows, postdata.Options.page)
        return ObservableCreator.createFromData(grdInput);
    }

    private Paginate = (array, page_size, page_number) => {

        var list = array.slice((page_number - 1) * page_size, (page_number) * page_size);
        var response = new ClientResponse();
        response.Data = {};
        response.Data.UserData = {};
        response.Data.UserData['Units'] = 500;
        response.Data.TotalRecords = 10;
        response.Data.SomeList = list;
        response.Success = true;
        return response;
    }
}

