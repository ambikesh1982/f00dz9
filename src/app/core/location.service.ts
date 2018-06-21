import { ElementRef, Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { environment } from '../../environments/environment';
import { IGeoInfo } from './models';
import { ScriptLoadService } from './script-load.service';
import { } from '@types/googlemaps'

const GEOLOCATION_ERRORS = {
  'errors.location.unsupportedBrowser': 'Browser does not support location services',
  'errors.location.permissionDenied': 'You have rejected access to your location',
  'errors.location.positionUnavailable': 'Unable to determine your location',
  'errors.location.timeout': 'Service timeout has been reached'
};

@Injectable()
export class LocationService {

  myCurrentPosition: Observable<Position>;
  geoFromAutoComplete$ = new BehaviorSubject<IGeoInfo>({});

  isGoogle$ = new BehaviorSubject<any>(null);

  googleScriptLoaded: boolean;

  constructor(private load: ScriptLoadService, private ngZone: NgZone) {
    this.myCurrentPosition = this.getCurrentPosition();
    this.googleScriptLoaded = false;
  }

  // retruns user position detected by browser navigator
  private getCurrentPosition(): Observable<Position> {
    return Observable.create((observer: Observer<Position>) => {
      // Invokes getCurrentPosition method of Geolocation API.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: Position) => {
            observer.next(position);
            observer.complete();
          },
          (error: PositionError) => {
            switch (error.code) {
              case 1:
                observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                break;
              case 2:
                observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                break;
              case 3:
                observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                break;
            }
          },
          { enableHighAccuracy: true, maximumAge: 600000, timeout: 500000 }
        );
      } else {
        observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
      }
    });
  }

  loadGoogleMapScript() {
    if (!this.googleScriptLoaded ) {
      this.load.loadScript(environment.googleMapURL, 'google-map', () => {
        console.log('Google-Maps Initiated!!');
        const googleMaps = window['google']['maps'];
        this.isGoogle$.next(googleMaps);
      });
      this.googleScriptLoaded = true;

    }
  }

  // Create a map with the marker.
  createMap(mapElement: ElementRef, myLat: any, myLng: any): google.maps.Map {

    const myLatLng = { lat: myLat, lng: myLng };
    const map = new google.maps.Map(mapElement.nativeElement, {
      zoom: 16,
      center: myLatLng,
      disableDefaultUI: true,
      scrollwheel: false,
    });

    const marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
    });

    return map;
  }

  placeAutoComplete(searchElement: ElementRef) {
    const autoComplete = new google.maps.places.Autocomplete(searchElement.nativeElement /*, {types: ['geocode']}*/);
    autoComplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autoComplete.getPlace();
        console.log('place ####: ', place);

        if (place.geometry) {
          const geoPoint = new firebase.firestore.GeoPoint(
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );

          const geo: IGeoInfo = {
            coordinates: geoPoint,
            autoAddressFromMap: place.formatted_address,
            addressFromUser: null
          };

        }
      });

    });
  }
}


/*
import { Injectable } from '@angular/core';

const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAwVnwE1bEZf_Bkk_pSkGM0XlBSXJocVUY&callback=initMap';

@Injectable()
export class GmapService {

      private loadAPI: Promise<any>;

      constructor() {}

      private loadScript(): void {
          if (!document.getElementById('gmap')) {
              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = url;
              script.id = 'gmap';
              document.head.appendChild(script);
          }
      }

      get init(): Promise<any> {
          if (!this.loadAPI) {
              this.loadAPI = new Promise((resolve) => {
                window['initMap'] = (ev: any) => {
                    resolve(window['google'].maps);
                  };
                this.loadScript();
              });
          }
          return this.loadAPI;
      }
}
*/
