import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { TransitionView } from './shared/transition';

@Component({
	selector: 'app-root',
	template: `
		<router-outlet />
		<transition-view />
		<ngx-sonner-toaster [class]="_class" />
	`,
	imports: [RouterOutlet, NgxSonnerToaster, TransitionView],
})
export class AppComponent {
	protected readonly _class = '[&_li]:!p-3 [&_li]:!rounded-md [&_li]:!shadow-sm !select-none';
}
