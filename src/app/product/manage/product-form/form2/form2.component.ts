import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.scss']
})
export class Form2Component implements OnInit, OnChanges, OnDestroy {

  @Input() productForm: FormGroup;

  orderTimeSliderValue: number;
  orderTimeSliderRange: number;
  orderTimeSliderStep: number;
  orderTimeUnit: string;

  subscription: Subscription;

  daysOfWeek = ['All Days', 'Weekends', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

  constructor() { }

  ngOnChanges() {
    this.subscription = this.productForm.get('form2.orderTime').valueChanges.subscribe(
      value => {
        this.orderTimeSliderValue = value;
      }
    );
  }


  setOrderBeforeRange(eventValue: any) {
    switch (eventValue) {
      case 'instant':
        this.configureSlider(30, 'instant');
        break;
      case 'preOrder':
        this.configureSlider(4, 'preOrder');
        break;
      default:
        this.configureSlider(30, 'instant');
        break;
    }
    console.log('Oreder before slider range is set to :', eventValue);
  }

  configureSlider(value: number, type: string) {
    this.orderTimeSliderValue = value;
    if (type === 'instant') {
      this.orderTimeSliderStep = 30;
      this.orderTimeSliderRange = 120;
      this.orderTimeUnit = 'minutes';
    } else {
      this.orderTimeSliderStep = 4;
      this.orderTimeSliderRange = 24;
      this.orderTimeUnit = 'hours';
    }
  }

  ngOnInit() {
    const orderType = this.productForm.get('form2.orderType').value;
    const orderTime = this.productForm.get('form2.orderTime').value;
    this.configureSlider(orderTime, orderType);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
