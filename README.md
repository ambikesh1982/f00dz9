# F00dz9

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


Order states: 
1. Awaiting_Confirmation -> Cancel|Reject|Confirm
2. Confirmed -> Completed
3. Cancelled 
4. Rejected
5. Timeout
6. Completed

order state interface: 
{
    state: string;
    updatedAt: date();
    reason?: string;
    additionalComments?: string;
}


Folder structure -
Feature modules-
1. Product( List/Detail/Manage )
2. Users( Detail/Manage )
3. Tray( List/Detail )
4. Chat 
5. Search
6. Sign-In
7. Checkout
8. Admin

Layout Modules
1. Home
2. PageNotFound
3. ToolBar
4. Confimation-Dialog
5. Fab-Action


