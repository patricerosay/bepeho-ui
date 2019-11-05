import { WorkerModule } from './worker.module';

describe('WorkerModule', () => {
    let chartsModule: WorkerModule;

    beforeEach(() => {
        chartsModule = new WorkerModule();
    });

    it('should create an instance', () => {
        expect(chartsModule).toBeTruthy();
    });
});
