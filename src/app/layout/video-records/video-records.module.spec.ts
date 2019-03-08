import { MapModule } from './video-records.module';

describe('MapModule', () => {
    let chartsModule: MapModule;

    beforeEach(() => {
        chartsModule = new MapModule();
    });

    it('should create an instance', () => {
        expect(chartsModule).toBeTruthy();
    });
});
