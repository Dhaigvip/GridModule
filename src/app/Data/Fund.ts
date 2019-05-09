export class Fund {
    Identity: FundIdentity
    Distributor: FundDistributor
    SubscriptionCutOffTime: string
    RedemptionCutOffTime: string
    IsPrepaid: boolean
    LatestNav: number
    LatestNavDate: Date
    IsActive: boolean
    ObjectVersion: string
    ExtPosReference: string

}
export class FundIdentity {
    FundId: string
    FundName: string
    ShareClassId: string
    Isin: string
    BaseCurrencyId: string
}
export class FundDistributor {
    DistributorName: string
    OrganizationId: string

}
