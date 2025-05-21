import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'aside-sub-link',
	imports: [LucideAngularModule],
	templateUrl: 'aside-sub-link.html',
})
export class AsideSubLink {
	public readonly label = input('label');
	public readonly href = input('');
	public readonly type = input<'link' | 'separator'>('link');
}
