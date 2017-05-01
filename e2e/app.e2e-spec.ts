import { HttpClientAngularPage } from './app.po';

describe('http-client-angular App', () => {
  let page: HttpClientAngularPage;

  beforeEach(() => {
    page = new HttpClientAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
