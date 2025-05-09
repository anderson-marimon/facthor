import { type ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' }), withEnabledBlockingInitialNavigation()),
		provideClientHydration(withEventReplay()),
		provideAnimations(),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
	],
};
