import { LoginHubloModule } from './login-hublo.module';

describe('LoginModule', () => {
    let loginModule: LoginHubloModule;

    beforeEach(() => {
        loginModule = new LoginHubloModule();
    });

    it('should create an instance', () => {
        expect(loginModule).toBeTruthy();
    });
});
