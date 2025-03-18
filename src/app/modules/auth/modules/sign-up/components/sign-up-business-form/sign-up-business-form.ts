import { Component, inject, signal } from '@angular/core';
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FrsButtonModule } from '@fresco-ui/button/button.module';
import { ECONOMIC_ACTIVITIES } from '@shared/common/economic-activity';
import { InputField } from '@shared/components/input-field/input-filed';
import { FormValidator } from '../../services/form-validator';
import { ADDRESS_STREETS } from '@shared/common/address-streets';
import { SelectField } from '@shared/components/select-field/select-field';

@Component({
	selector: 'sign-up-business-form',
	templateUrl: 'sign-up-business-form.html',
	imports: [FrsButtonModule, InputField, ReactiveFormsModule, SelectField]
})
export class SignUpBusinessForm {
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _formValidator = inject(FormValidator);

	protected readonly _disabled = signal(true);
	protected readonly _economicActivities = ECONOMIC_ACTIVITIES as { name: any; value: any }[];
	protected readonly _addressStreets = ADDRESS_STREETS;

	//form inputs
	protected readonly _personType = this._formBuilder.control('');
	protected readonly _business = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _tradeName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _nit = this._formBuilder.control('', [Validators.required, this._formValidator.nit()]);
	protected readonly _economicActivity = this._formBuilder.control('', [Validators.required]);
	protected readonly _country = this._formBuilder.control('');
	protected readonly _province = this._formBuilder.control('', [Validators.required]);
	protected readonly _city = this._formBuilder.control('', [Validators.required]);
	protected readonly _addressStreet = this._formBuilder.control('', [Validators.required]);
	protected readonly _addressStreetNumber = this._formBuilder.control('', [Validators.required]);
	protected readonly _addressStreetPlaceNumber = this._formBuilder.control('', [Validators.required]);
	protected readonly _addressStreetPlaceSubNumber = this._formBuilder.control('', [Validators.required]);

	//form group
	protected readonly _businessForm = this._formBuilder.group({
		personType: this._personType,
		business: this._business,
		tradeName: this._tradeName,
		nit: this._nit,
		economicActivity: this._economicActivity,
		country: this._country,
		province: this._province,
		city: this._city,
		addressStreet: this._addressStreet,
		addressStreetNumber: this._addressStreetNumber,
		addressStreetPlaceNumber: this._addressStreetPlaceNumber,
		addressStreetPlaceSubNumber: this._addressStreetPlaceSubNumber
	});

	protected _onSubmit(): void {
		console.log(this._businessForm.value);
	}

	public getBusinessForm(): FormGroup {
		return this._businessForm;
	}
}
