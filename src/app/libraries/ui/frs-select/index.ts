import { NgModule } from '@angular/core';
import { FrsSelect } from '@fresco-ui/frs-select/frs-select';
import { FrsSelectOptions } from '@fresco-ui/frs-select/frs-select-options';
import { FrsSelectTrigger } from '@fresco-ui/frs-select/frs-select-trigger';

@NgModule({
	imports: [FrsSelect, FrsSelectOptions, FrsSelectTrigger],
	exports: [FrsSelect, FrsSelectOptions, FrsSelectTrigger]
})
export class FrsSelectModule {}
