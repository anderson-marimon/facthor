import { NgModule } from '@angular/core';
import { FrsAlert } from '@fresco-ui/frs-alert/frs-alert';
import { FrsAlertTitle } from '@fresco-ui/frs-alert/frs-alert-title';
import { FrsAlertDescription } from '@fresco-ui/frs-alert/frs-alert-description';

@NgModule({
	imports: [FrsAlert, FrsAlertTitle, FrsAlertDescription],
	exports: [FrsAlert, FrsAlertTitle, FrsAlertDescription],
})
export class FrsAlertModule {}
