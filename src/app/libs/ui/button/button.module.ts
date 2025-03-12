import { NgModule } from '@angular/core';
import { FrsButtonDirective } from './button.directive';

@NgModule({
	imports: [FrsButtonDirective],
	exports: [FrsButtonDirective]
})
export class FrsButtonModule {}
