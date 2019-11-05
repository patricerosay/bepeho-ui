import { CountdownModule } from './countdown.module';

describe('CountdownModule', () => {
    let statModule: CountdownModule;

    beforeEach(() => {
        statModule = new CountdownModule();
    });

    it('should create an instance', () => {
        expect(statModule).toBeTruthy();
    });
});
