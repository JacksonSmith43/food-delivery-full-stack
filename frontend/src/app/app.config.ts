import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// This makes sure that withCredentials is set to true for all HTTP requests, so that the
// session cookie is sent with each request. This is necessary for the backend to recognise the user session and
// allow access to protected resources.
const withCredentialsInterceptor = withInterceptors([(req, next) => next(req.clone({ withCredentials: true }))]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withCredentialsInterceptor),
  ],
};
