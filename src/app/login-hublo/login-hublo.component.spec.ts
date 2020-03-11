import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginHubloComponent } from './login-hublo.component';
import { LoginHubloModule } from './login-hublo.module';

describe('LoginComponent', () => {
  let component: LoginHubloComponent;
  let fixture: ComponentFixture<LoginHubloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginHubloModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginHubloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
