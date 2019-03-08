import { TaskModule } from './task.module';

describe('TaskModule', () => {
    let chartsModule: TaskModule;

    beforeEach(() => {
        chartsModule = new TaskModule();
    });

    it('should create an instance', () => {
        expect(chartsModule).toBeTruthy();
    });
});
