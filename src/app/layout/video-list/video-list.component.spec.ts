import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VideoListComponent } from './video-list.component';
import { VideoListModule } from './video-list.module';

describe('MapComponent', () => {
  let component: VideoListComponent;
  let fixture: ComponentFixture<VideoListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          VideoListModule,
          RouterTestingModule,
          BrowserAnimationsModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
