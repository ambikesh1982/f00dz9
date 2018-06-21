import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  private loadAPI: Promise<any>;

  constructor() { }

  private loadScript(): void {
    if (!document.getElementById('gmap')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = environment.googleMapURL;
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
