import { AppChatModule } from './app-chat.module';

describe('AppChatModule', () => {
  let appChatModule: AppChatModule;

  beforeEach(() => {
    appChatModule = new AppChatModule();
  });

  it('should create an instance', () => {
    expect(appChatModule).toBeTruthy();
  });
});
