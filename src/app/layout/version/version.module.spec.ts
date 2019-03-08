import { VersionModule } from './version.module';

describe('VersionModule', () => {
    let chartsModule: VersionModule;

    beforeEach(() => {
        chartsModule = new VersionModule();
    });

    it('should create an instance', () => {
        expect(chartsModule).toBeTruthy();
    });
});
