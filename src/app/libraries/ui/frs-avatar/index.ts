import { NgModule } from '@angular/core';
import { FrsAvatar } from '@fresco-ui/frs-avatar/frs-avatar';
import { FrsAvatarImage } from '@fresco-ui/frs-avatar/frs-avatar-image';
import { FrsAvatarFallback } from '@fresco-ui/frs-avatar/frs-avatar-fallback';

@NgModule({
	imports: [FrsAvatar, FrsAvatarImage, FrsAvatarFallback],
	exports: [FrsAvatar, FrsAvatarImage, FrsAvatarFallback],
})
export class FrsAvatarModule {}
