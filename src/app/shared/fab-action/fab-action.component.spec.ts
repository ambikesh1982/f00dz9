import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabActionComponent } from './fab-action.component';

describe('FabActionComponent', () => {
  let component: FabActionComponent;
  let fixture: ComponentFixture<FabActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
