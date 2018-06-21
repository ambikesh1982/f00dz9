import { AppUserModule } from './app-user.module';

describe('AppUserModule', () => {
  let appUserModule: AppUserModule;

  beforeEach(() => {
    appUserModule = new AppUserModule();
  });

  it('should create an instance', () => {
    expect(appUserModule).toBeTruthy();
  });
});
