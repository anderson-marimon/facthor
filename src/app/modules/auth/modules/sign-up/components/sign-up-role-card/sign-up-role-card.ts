import { Component, input } from '@angular/core';
import { type FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'sing-up-role-card',
	templateUrl: 'sign-up-role-card.html',
	host: { 'class': 'block w-full h-auto' },
	imports: [ReactiveFormsModule]
})
export class SignUpRoleCard {
	public readonly title = input('Role title');
	public readonly value = input('0');
	public readonly description = input('Role description');
	public readonly inputFormControl = input.required<FormControl<any>>();
}
