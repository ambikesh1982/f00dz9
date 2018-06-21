import { AppCartModule } from './app-cart.module';

describe('AppCartModule', () => {
  let appCartModule: AppCartModule;

  beforeEach(() => {
    appCartModule = new AppCartModule();
  });

  it('should create an instance', () => {
    expect(appCartModule).toBeTruthy();
  });
});
