import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
	selector: 'app-root',
	template: `
		<router-outlet />
		<ngx-sonner-toaster [class]="_class" />
	`,
	imports: [RouterOutlet, NgxSonnerToaster],
})
export class AppComponent {
	protected readonly _class = '[&_li]:!p-3 [&_li]:!rounded-md [&_li]:!shadow-sm !select-none';
}
