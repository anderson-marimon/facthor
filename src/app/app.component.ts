import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, NgxSonnerToaster],
	template: `
		<router-outlet />
		<ngx-sonner-toaster [class]="_class" />
	`,
})
export class AppComponent {
	protected readonly _class = '[&_li]:!rounded-md [&_li]:!shadow-sm !select-none';
}
