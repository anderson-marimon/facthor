import { Component, input } from '@angular/core';
import { FileX2, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'empty-result',
	templateUrl: 'empty-result.html',
	host: {
		class: 'w-full h-full flex flex-col gap-1 items-center justify-center text-sm text-foreground/60 animate-opacity-in',
	},
	imports: [LucideAngularModule],
})
export class EmptyResult {
	public readonly message = input('No se encontraron registros.');
	public readonly icon = input(FileX2);
}
