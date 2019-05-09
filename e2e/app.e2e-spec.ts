import { FundModulePage } from './app.po';

describe('fund-module App', () => {
  let page: FundModulePage;

  beforeEach(() => {
    page = new FundModulePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
