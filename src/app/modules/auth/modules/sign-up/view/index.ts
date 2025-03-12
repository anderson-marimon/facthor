import { type AfterViewInit, ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FrsButtonDirective } from '@fresco-ui/button/button.directive';
import { FormStep } from '../components/form-step/form-step';

@Component({
	selector: 'sign-up-page',
	imports: [FormStep, RouterLink, FrsButtonDirective],
	templateUrl: 'index.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SignUpPage implements AfterViewInit {
	protected readonly formSteps = signal(Array(5).fill(false));

	public ngAfterViewInit(): void {
		this._startForm();
	}

	private _startForm(): void {
		this._setStep(0, true);
	}

	private _setStep(index: number, value: boolean) {
		this.formSteps.update(steps => {
			const newSteps = [...steps];
			newSteps[index] = value;
			return newSteps;
		});
	}
}
