import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderlListComponent } from './orderl-list.component';

describe('OrderlListComponent', () => {
  let component: OrderlListComponent;
  let fixture: ComponentFixture<OrderlListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderlListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
