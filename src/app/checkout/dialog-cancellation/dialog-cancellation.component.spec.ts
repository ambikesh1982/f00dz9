import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCancellationComponent } from './dialog-cancellation.component';

describe('DialogCancellationComponent', () => {
  let component: DialogCancellationComponent;
  let fixture: ComponentFixture<DialogCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
