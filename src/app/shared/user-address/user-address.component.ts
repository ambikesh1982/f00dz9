import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Observable, Subscription } from 'rxjs';
import { LocationService } from '../../core/location.service';
import { AppUser, IGeoInfo } from '../../core/models';
import { DataService } from '../../core/data.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.scss']
})
export class UserAddressComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input() userId: string;
  @Output() geoInfo = new EventEmitter<IGeoInfo>();

  @ViewChild('addessSearch') searchElm: ElementRef;
  @ViewChild('gmap') mapElm: ElementRef;

  subscription: Subscription;

  addressForm: FormGroup;

  userData$: Observable<AppUser>;

  constructor(
    private locationService: LocationService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private dataService: DataService
  ) {
    this.createForm();
    this.locationService.loadGoogleMapScript();
  }

  ngOnChanges() {
    if (this.userId) {
      console.log('ngOnChanges(): if (this.userId)', this.userId);
      this.dataService.getUserFromFirestore(this.userId).pipe(
        first()
      ).subscribe( user => {
        if (user && user.geoInfo) {
          console.log('TODO: this.patchFormValue(user.geoInfo);', user.geoInfo);
          this.patchFormValue(user.geoInfo);
          this.geoInfo.emit(user.geoInfo);
        } else {
          console.log('TODO: No geoInfo. Show dialog box.');
        }
      });
    } else {
      console.log('ngOnChanges(): else', this.userId);
    }
  }

  ngOnInit() {
  }

  createForm() {
    this.addressForm = this.formBuilder.group({
      autoAddressFromMap: ['', Validators.required]
      // coordinates: ['']
      // addressFromUser: ['', Validators.required],
    });
  }

  patchFormValue(geo: IGeoInfo) {
    this.addressForm.patchValue({
      autoAddressFromMap: geo.autoAddressFromMap
    });
    // this.addressForm.disable();
  }

  addressAutoComplete() {
  }

  ngAfterViewInit() {
    console.log('afterViewInit: #### View Initialized ####');

    this.subscription = this.locationService.isGoogle$.subscribe(
      google => {
      if (google) {

        const autoComplete = new google.places.Autocomplete(this.searchElm.nativeElement /*, {types: ['geocode']}*/);

        autoComplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place = autoComplete.getPlace();

            if (place.geometry) {
              const userLat = place.geometry.location.lat();
              const userLng = place.geometry.location.lng();

              const userGeoHash = this.locationService.generateGeoHash(userLat, userLng);
              console.log('UserGeoHash >>>>> ', userGeoHash);
              const geoPoint = new firebase.firestore.GeoPoint(userLat, userLng);

              const userGeoInfo: IGeoInfo = <IGeoInfo>{ coordinates: geoPoint, autoAddressFromMap: place.formatted_address };

              this.geoInfo.emit(userGeoInfo);
            } else {
              console.log('Unable to find a place! try again!!');
              return;
            }
          }); // ngZone.run
        }); // autoComplete.addListener
      } else {
        console.log('##### Waiting for Google-maps api ##### ', google);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
