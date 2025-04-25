import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCitiesApi } from '@auth/modules/sign-up/api/form-get-cities';
import { FormDepartmentApi } from '@auth/modules/sign-up/api/form-get-departments';
import { FormValidator } from '@auth/modules/sign-up/services/form-validator';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { TCalendarDate } from '@fresco-ui/frs-calendar/frs-calendar';
import { FrsComboboxModule } from '@fresco-ui/frs-combobox';
import { FrsDatePickerModule } from '@fresco-ui/frs-date-picker';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';
import { ADDRESS_STREETS } from '@shared/common/address-streets';
import { ECONOMIC_ACTIVITIES } from '@shared/common/economic-activity';

@Component({
	selector: 'sign-up-business-form',
	templateUrl: 'form-business.html',
	viewProviders: [FormDepartmentApi, FormCitiesApi],
	imports: [FrsButtonModule, FrsComboboxModule, FrsDatePickerModule, FrsFieldModule, FrsInputModule, FrsSelectModule, ReactiveFormsModule],
})
export class SignUpBusinessForm {
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _formValidator = inject(FormValidator);
	private readonly _departmentService = inject(FormDepartmentApi);
	private readonly _cityService = inject(FormCitiesApi);

	protected readonly _disabled = signal(true);
	protected readonly _economicActivities = ECONOMIC_ACTIVITIES as { label: any; value: any }[];
	protected readonly _addressStreets = ADDRESS_STREETS;
	protected readonly _departments = this._departmentService.departments;
	protected readonly _businessCities = this._cityService.businessCities;
	protected readonly _legalRepresentativeBirthCities = this._cityService.legalRepresentativeBirthCities;
	protected readonly _legaRepresentativeExpeditionCities = this._cityService.legalRepresentativeBirthCities;

	// Disable controls
	protected readonly _businessCityDisabled = signal(true);
	protected readonly _legalRepresentativeBirthCityDisabled = signal(true);
	protected readonly _legalRepresentativeExpeditionCityDisabled = signal(true);

	// Business controls
	protected readonly _businessPersonType = this._formBuilder.control('');
	protected readonly _businessName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _businessTradeName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _businessNit = this._formBuilder.control('', [Validators.required, this._formValidator.nit()]);
	protected readonly _businessEconomicActivity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _businessCountry = this._formBuilder.control('');
	protected readonly _businessDepartment = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _businessCity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _businessAddressStreet = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _businessAddressStreetNumber = this._formBuilder.control('', [Validators.required]);
	protected readonly _businessAddressStreetSecondaryNumber = this._formBuilder.control('', [Validators.required]);
	protected readonly _businessAddressStreetBuildNumber = this._formBuilder.control('', [Validators.required]);
	protected readonly _businessAddressStreetComplement = this._formBuilder.control('');
	protected readonly _businessEmail = this._formBuilder.control('', [Validators.required, Validators.email]);
	protected readonly _businessPrefix = this._formBuilder.control('', [Validators.required]);
	protected readonly _businessPhoneNumber = this._formBuilder.control('', [Validators.required, this._formValidator.phoneNumber()]);

	// Legal representative controls
	protected readonly _legalRepresentativeName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _legalRepresentativeSurName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _legalRepresentativeLastName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _legalRepresentativeSurLastName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _legalRepresentativeCharge = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _legalRepresentativeArea = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _legalRepresentativeDocumentNumber = this._formBuilder.control('', [Validators.required, this._formValidator.dni()]);
	protected readonly _legalRepresentativeBirthdate = this._formBuilder.control<TCalendarDate>(null, [
		Validators.required,
		this._formValidator.atLeast18Years(),
		this._formValidator.atMost80Years(),
	]);
	protected readonly _legalRepresentativeBirthCountry = this._formBuilder.control('', [Validators.required]);
	protected readonly _legalRepresentativeBirthDepartment = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _legalRepresentativeBirthCity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _legalRepresentativeExpeditionDate = this._formBuilder.control<TCalendarDate>(null, [Validators.required]);
	protected readonly _legalRepresentativeExpeditionCountry = this._formBuilder.control('', [Validators.required]);
	protected readonly _legalRepresentativeExpeditionDepartment = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _legalRepresentativeExpeditionCity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _legalRepresentativePrefix = this._formBuilder.control('', [Validators.required]);
	protected readonly _legalRepresentativePhoneNumber = this._formBuilder.control('', [Validators.required, this._formValidator.phoneNumber()]);

	// Form group
	protected readonly _businessForm = this._formBuilder.group({
		businessPersonType: this._businessPersonType,
		businessBusiness: this._businessName,
		businessTradeName: this._businessTradeName,
		businessNit: this._businessNit,
		businessEconomicActivity: this._businessEconomicActivity,
		businessCountry: this._businessCountry,
		businessProvince: this._businessDepartment,
		businessCity: this._businessCity,
		businessAddressStreet: this._businessAddressStreet,
		businessAddressStreetPhoneNumber: this._businessAddressStreetNumber,
		businessAddressStreetSecondaryNumber: this._businessAddressStreetSecondaryNumber,
		businessAddressStreetBuildNumber: this._businessAddressStreetBuildNumber,
		businessAddressStreetComplement: this._businessAddressStreetComplement,
		legalRepresentativeName: this._legalRepresentativeName,
		legalRepresentativeSurName: this._legalRepresentativeSurName,
		legalRepresentativeLastName: this._legalRepresentativeLastName,
		legalRepresentativeSurLastName: this._legalRepresentativeSurLastName,
		legalRepresentativeCharge: this._legalRepresentativeCharge,
		legalRepresentativeArea: this._legalRepresentativeArea,
		legalRepresentativeDocumentNumber: this._legalRepresentativeDocumentNumber,
		legalRepresentativeBirthdate: this._legalRepresentativeBirthdate,
		legalRepresentativeBirthCountry: this._legalRepresentativeBirthCountry,
		legalRepresentativeBirthDepartment: this._legalRepresentativeBirthDepartment,
		legalRepresentativeBirthCity: this._legalRepresentativeBirthCity,
		legalRepresentativeExpeditionDate: this._legalRepresentativeExpeditionDate,
		legalRepresentativeExpeditionCountry: this._legalRepresentativeExpeditionCountry,
		legalRepresentativeExpeditionDepartment: this._legalRepresentativeExpeditionDepartment,
		legalRepresentativeExpeditionCity: this._legalRepresentativeExpeditionCity,
		legalRepresentativePrefix: this._legalRepresentativePrefix,
		legalRepresentativePhoneNumber: this._legalRepresentativePhoneNumber,
	});

	constructor() {
		this._syncForm();
		this._syncDepartments();
	}

	private _syncForm(): void {}

	private _syncDepartments(): void {
		const setupDepartmentSync = (
			departmentControl: FormControl<any>,
			cityControl: FormControl<any>,
			updateDepartmentFn: (value: any) => void,
			cityDisabledControl?: WritableSignal<boolean>
		): void => {
			departmentControl.valueChanges.subscribe((value) => {
				if (!value || !value.length) return;
				updateDepartmentFn(value[0].value);
				cityControl.setValue([]);
				if (cityDisabledControl && departmentControl.value?.length) {
					cityDisabledControl.set(false);
				}
			});
		};

		setupDepartmentSync(
			this._businessDepartment,
			this._businessCity,
			this._cityService.updateBusinessDepartment.bind(this._cityService),
			this._businessCityDisabled
		);

		setupDepartmentSync(
			this._legalRepresentativeBirthDepartment,
			this._legalRepresentativeBirthCity,
			this._cityService.updateLegalRepresentativeBirthDepartment.bind(this._cityService),
			this._legalRepresentativeBirthCityDisabled
		);

		setupDepartmentSync(
			this._legalRepresentativeExpeditionDepartment,
			this._legalRepresentativeExpeditionCity,
			this._cityService.updateLegalRepresentativeExpeditionDepartment.bind(this._cityService),
			this._legalRepresentativeExpeditionCityDisabled
		);
	}

	public getBusinessForm(): FormGroup {
		return this._businessForm;
	}
}
