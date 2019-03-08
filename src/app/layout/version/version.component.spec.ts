import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VersionComponent } from './version.component';
import { VersionModule } from './version.module';

describe('MapComponent', () => {
  let component: VersionComponent;
  let fixture: ComponentFixture<VersionComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          VersionModule,
          RouterTestingModule,
          BrowserAnimationsModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
