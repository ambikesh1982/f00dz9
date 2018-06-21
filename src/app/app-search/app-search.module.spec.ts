import { AppSearchModule } from './app-search.module';

describe('AppSearchModule', () => {
  let appSearchModule: AppSearchModule;

  beforeEach(() => {
    appSearchModule = new AppSearchModule();
  });

  it('should create an instance', () => {
    expect(appSearchModule).toBeTruthy();
  });
});
