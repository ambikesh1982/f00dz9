import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAddressComponent } from './auto-address.component';

describe('AutoAddressComponent', () => {
  let component: AutoAddressComponent;
  let fixture: ComponentFixture<AutoAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
