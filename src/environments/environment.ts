// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBN2Z4XVfAAwMVP_ox6rTR5I7mS4C7yyk0',
    authDomain: 'f00dz9-app.firebaseapp.com',
    databaseURL: 'https://f00dz9-app.firebaseio.com',
    projectId: 'f00dz9-app',
    storageBucket: 'f00dz9-app.appspot.com',
    messagingSenderId: '625229359791'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
