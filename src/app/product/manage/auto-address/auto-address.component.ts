import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { LocationService } from '../../../core/location.service';
import { IGeoInfo } from '../../../core/models';

@Component({
  selector: 'app-auto-address',
  templateUrl: './auto-address.component.html',
  styleUrls: ['./auto-address.component.scss']
})
export class AutoAddressComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  subscription: Subscription;

  @ViewChild('addessSearch') searchElm: ElementRef;
  @ViewChild('gmap') mapElm: ElementRef;
  @Input() productForm: FormGroup;
  @Input() userGeoInfo: IGeoInfo;

  geoInfo: IGeoInfo;

  place: google.maps.places.PlaceResult;

  constructor(private locationService: LocationService, private ngZone: NgZone) {
    console.log('constructor: #### View Initialized ####');
    this.locationService.loadGoogleMapScript(); // Initialize googe-maps
  }

  ngOnChanges() {
    console.log('#### from ngOnChanges() ####');
    if (this.userGeoInfo) {
      this.patchUserAddress(this.userGeoInfo);
    }
  }

  ngOnInit() {
  }


  patchUserAddress(geoInfo: IGeoInfo) {
    this.productForm.get('addressForm').patchValue(
      {
        autoAddressFromMap: geoInfo.autoAddressFromMap,
        addressFromUser: geoInfo.addressFromUser,
        coordinates: geoInfo.coordinates
      });
    this.productForm.get('addressForm').disable();
  }

  ngAfterViewInit() {
    console.log('afterViewInit: #### View Initialized ####');

    this.subscription = this.locationService.isGoogle$.subscribe(
      google => {
        if (google) {
          console.log('##### Google-maps api loaded #####');

          if (this.productForm.get('addressForm.coordinates').value) {

            this.locationService.createMap(
              this.mapElm,
              this.productForm.get('addressForm.coordinates').value.latitude,
              this.productForm.get('addressForm.coordinates').value.longitude
            );

          }

          const autoComplete = new google.places.Autocomplete(this.searchElm.nativeElement /*, {types: ['geocode']}*/);

          autoComplete.addListener('place_changed', () => {
            this.ngZone.run(() => {

              const place = autoComplete.getPlace();

              if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                const geoPoint = new firebase.firestore.GeoPoint(lat, lng);

                this.productForm.get('addressForm.coordinates').patchValue(geoPoint);
                this.productForm.get('addressForm.autoAddressFromMap').patchValue(place.formatted_address);


                const map = this.locationService.createMap(this.mapElm, lat, lng);

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
