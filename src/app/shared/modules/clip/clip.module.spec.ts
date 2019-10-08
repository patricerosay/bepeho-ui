import { ClipModule } from './clip.module';

describe('ClipModule', () => {
    let statModule: ClipModule;

    beforeEach(() => {
        statModule = new ClipModule();
    });

    it('should create an instance', () => {
        expect(statModule).toBeTruthy();
    });
});
