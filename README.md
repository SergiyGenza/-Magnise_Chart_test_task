# About Task

This is a test assignment implemented using Angular 18. All components are standalone. Reactivity within components is ensured by leveraging RxJS. In some instances, signals are used, for example, in the AuthService.

The application's structure is as follows: A user goes through a simple Login component. They then proceed to the Main Page. In the input component, the user selects an instrument to observe and clicks the "Subscribe" button.

Upon initialization, the MarketDataPageComponent retrieves a list of available instruments and connects to a WebSocket using the provided token.

Subsequently, the user receives real-time data from the WebSocket on the first card and sees a chart with historical data on another card. When the "Unsubscribe" button is clicked, data streaming ceases.

The application is implemented with the help of three services: `RealTimeDataService`, `InstrumentsService`, and `AuthService`.

A simple `AuthGuard` is utilized for conditional user access to the main data.

Components are organized into three groups: pages, features, and shared components.

A custom directive is used to display and hide the list of instruments.


Additionally, a simple backend is implemented to handle requests. To set it up and run:
1. Install dependencies: `npm i`
2. Start the development server: `npm run dev`

The frontend part is launched similarly:
1. Install dependencies: `npm i`
2. Start the Angular development server: `ng serve`

# MagniseFintacharts

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

