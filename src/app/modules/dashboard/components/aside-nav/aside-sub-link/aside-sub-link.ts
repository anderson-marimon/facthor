import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'aside-sub-link',
	templateUrl: 'aside-sub-link.html',
	imports: [LucideAngularModule, RouterLink],
})
export class AsideSubLink {
	public readonly label = input('');
	public readonly href = input('');
	public readonly type = input<'link' | 'separator'>('link');
	public readonly activeRoute = input('');
}
