// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  URL_BACKEND : "http://localhost:8080/puesto-vigilancia-1.0",
  
  
  
  firebase: {
    apiKey: 'AIzaSyDCI1DjDRTyWgCJd681nhrEqY216Kfbm44',
    authDomain: 'doctoradocienciasdelasaludusco.firebaseapp.com',
    databaseURL: 'https://doctoradocienciasdelasaludusco.firebaseio.com',
    projectId: 'doctoradocienciasdelasaludusco',
    storageBucket: 'doctoradocienciasdelasaludusco.appspot.com',
    messagingSenderId: '399106387464',
    appId: '1:399106387464:web:7741df6f88e489f7176bbd',
    measurementId: 'G-PTHMQCDL1F'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.