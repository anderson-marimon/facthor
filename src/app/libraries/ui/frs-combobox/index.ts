import { NgModule } from '@angular/core';
import { FrsCombobox } from '@fresco-ui/frs-combobox/frs-combobox';
import { FrsComboboxTrigger } from '@fresco-ui/frs-combobox/frs-combobox-trigger';
import { FrsComboboxOptions } from '@fresco-ui/frs-combobox/frs-combobox-options';

@NgModule({
	imports: [FrsCombobox, FrsComboboxTrigger, FrsComboboxOptions],
	exports: [FrsCombobox, FrsComboboxTrigger, FrsComboboxOptions],
})
export class FrsComboboxModule {}
