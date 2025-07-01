import { Component, input } from '@angular/core';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';
import { LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'general-loader',
	templateUrl: 'general-loader.html',
	host: {
		class: 'flex-1 w-full h-full grid place-content-center gap-2.5 animate-opacity-in',
	},
	imports: [FacthorLogoAnimated, LucideAngularModule],
})
export class GeneralLoader {
	public readonly message = input('Cargando...');
}
