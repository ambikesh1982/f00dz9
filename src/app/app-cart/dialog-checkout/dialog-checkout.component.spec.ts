import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCheckoutComponent } from './dialog-checkout.component';

describe('DialogCheckoutComponent', () => {
  let component: DialogCheckoutComponent;
  let fixture: ComponentFixture<DialogCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
