import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VideoRecordsComponent } from './video-records.component';
import { VideoRecordsModule } from './video-records.module';

describe('MapComponent', () => {
  let component: VideoRecordsComponent;
  let fixture: ComponentFixture<VideoRecordsComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          VideoRecordsModule,
          RouterTestingModule,
          BrowserAnimationsModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
