import { NetworkModule } from './network.module';

describe('NetworkModule', () => {
  let dashboardModule: NetworkModule;

  beforeEach(() => {
    dashboardModule = new NetworkModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
  });
});
