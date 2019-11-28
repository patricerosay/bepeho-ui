import { SequenceModule } from './sequence.module';

describe('SequenceModule', () => {
    let statModule: SequenceModule;

    beforeEach(() => {
        statModule = new SequenceModule();
    });

    it('should create an instance', () => {
        expect(statModule).toBeTruthy();
    });
});
