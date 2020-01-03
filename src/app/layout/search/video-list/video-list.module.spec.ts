import { VideoListModule } from './video-list.module';

describe('MapModule', () => {
    let chartsModule: VideoListModule;

    beforeEach(() => {
        chartsModule = new VideoListModule();
    });

    it('should create an instance', () => {
        expect(chartsModule).toBeTruthy();
    });
});
