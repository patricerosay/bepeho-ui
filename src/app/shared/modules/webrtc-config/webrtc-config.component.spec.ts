import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebrtcConfigComponent } from './webrtc-config.component';

describe('WebrtcConfigComponent', () => {
  let component: WebrtcConfigComponent;
  let fixture: ComponentFixture<WebrtcConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebrtcConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebrtcConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
