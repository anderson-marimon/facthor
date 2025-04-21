import { NgModule } from '@angular/core';
import { FrsPopover } from '@fresco-ui/frs-popover/frs-popover';
import { FrsPopoverTrigger } from '@fresco-ui/frs-popover/frs-popover-trigger';
import { FrsPopoverContent } from '@fresco-ui/frs-popover/frs-popover-content';

@NgModule({
	imports: [FrsPopover, FrsPopoverTrigger, FrsPopoverContent],
	exports: [FrsPopover, FrsPopoverTrigger, FrsPopoverContent]
})
export class FrsPopoverModule {}
