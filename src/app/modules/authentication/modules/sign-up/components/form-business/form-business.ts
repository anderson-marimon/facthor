import { afterNextRender, Component, DestroyRef, inject, output, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCitiesApi } from '@authentication/modules/sign-up/api/form-get-cities';
import { FormCiuuCodesApi } from '@authentication/modules/sign-up/api/form-get-ciuu-codes';
import { FormDepartmentApi } from '@authentication/modules/sign-up/api/form-get-departments';
import { ADDRESS_STREETS } from '@authentication/modules/sign-up/common/address-streets';
import { FormValidator } from '@authentication/services/form-validator';
import { SignUpFormStore } from '@authentication/modules/sign-up/stores/sign-up.store';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { TCalendarDate } from '@fresco-ui/frs-calendar/frs-calendar';
import { FrsComboboxModule } from '@fresco-ui/frs-combobox';
import { FrsDatePickerModule } from '@fresco-ui/frs-date-picker';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';

@Component({
	selector: 'sign-up-business-form',
	templateUrl: 'form-business.html',
	viewProviders: [FormCitiesApi, FormCiuuCodesApi, FormDepartmentApi],
	imports: [FrsButtonModule, FrsComboboxModule, FrsDatePickerModule, FrsFieldModule, FrsInputModule, FrsSelectModule, ReactiveFormsModule],
})
export class SignUpBusinessForm {
	private readonly _signUpFormStore = inject(SignUpFormStore);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _validator = inject(FormValidator);
	private readonly _formDepartmentApi = inject(FormDepartmentApi);
	private readonly _formCiuuCodesApi = inject(FormCiuuCodesApi);
	private readonly _formCitiesApi = inject(FormCitiesApi);
	private readonly _birthDate = signal<Date | null>(null);

	public readonly formChange = output<boolean>();

	// Inputs data
	protected readonly _addressStreetsOptions = ADDRESS_STREETS;
	protected readonly _departmentsOptions = this._formDepartmentApi.departments;
	protected readonly _businessCitiesOptions = this._formCitiesApi.businessCities;
	protected readonly _economicActivitiesOptions = this._formCiuuCodesApi.ciuuCodes;
	protected readonly _legalRepresentativeBirthCitiesOptions = this._formCitiesApi.legalRepresentativeBirthCities;
	protected readonly _legaRepresentativeExpeditionCitiesOptions = this._formCitiesApi.legalRepresentativeExpeditionCities;

	// Disable controls
	protected readonly _disabled = signal(true);
	protected readonly _businessCityDisabled = signal(true);
	protected readonly _legalRepresentativeBirthCityDisabled = signal(true);
	protected readonly _legalRepresentativeExpeditionCityDisabled = signal(true);

	// Business controls
	protected readonly _businessPersonType = this._formBuilder.control('');
	protected readonly _businessName = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _businessTradeName = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _businessNit = this._formBuilder.control('', [Validators.required, this._validator.nit()]);
	protected readonly _businessEconomicActivity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _businessCountry = this._formBuilder.control('');
	protected readonly _businessDepartment = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _businessCity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _businessAddressStreet = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _businessAddressStreetNumber = this._formBuilder.control('', [Validators.required]);
	protected readonly _businessAddressStreetSecondaryNumber = this._formBuilder.control('', [Validators.required]);
	protected readonly _businessAddressStreetBuildNumber = this._formBuilder.control('', [Validators.required]);
	// protected readonly _businessAddressStreetComplement = this._formBuilder.control('');
	protected readonly _businessEmail = this._formBuilder.control('', [Validators.required, Validators.email]);
	protected readonly _businessPrefix = this._formBuilder.control('', [Validators.required]);
	protected readonly _businessPhoneNumber = this._formBuilder.control('', [Validators.required, this._validator.phoneNumber()]);

	// Legal representative controls
	protected readonly _legalRepresentativeName = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _legalRepresentativeSurName = this._formBuilder.control('', [this._validator.name(true)]);
	protected readonly _legalRepresentativeLastName = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _legalRepresentativeSurLastName = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _legalRepresentativeCharge = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _legalRepresentativeArea = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _legalRepresentativeDocumentNumber = this._formBuilder.control('', [Validators.required, this._validator.dni()]);
	protected readonly _legalRepresentativeBirthdate = this._formBuilder.control<TCalendarDate>(null, [
		Validators.required,
		this._validator.atLeast18Years(),
		this._validator.atMost80Years(),
	]);
	protected readonly _legalRepresentativeBirthCountry = this._formBuilder.control('', [Validators.required]);
	protected readonly _legalRepresentativeBirthDepartment = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _legalRepresentativeBirthCity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _legalRepresentativeExpeditionDate = this._formBuilder.control<TCalendarDate>(null, [
		Validators.required,
		this._validator.expeditionDate(this._birthDate),
	]);
	protected readonly _legalRepresentativeExpeditionCountry = this._formBuilder.control('', [Validators.required]);
	protected readonly _legalRepresentativeExpeditionDepartment = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _legalRepresentativeExpeditionCity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _legalRepresentativeEmail = this._formBuilder.control('', [Validators.required, Validators.email]);
	protected readonly _legalRepresentativePrefix = this._formBuilder.control('', [Validators.required]);
	protected readonly _legalRepresentativePhoneNumber = this._formBuilder.control('', [Validators.required, this._validator.phoneNumber()]);

	// Form group
	protected readonly _form = this._formBuilder.group({
		businessPersonType: this._businessPersonType,
		businessName: this._businessName,
		businessTradeName: this._businessTradeName,
		businessNit: this._businessNit,
		businessEconomicActivity: this._businessEconomicActivity,
		businessCountry: this._businessCountry,
		businessProvince: this._businessDepartment,
		businessCity: this._businessCity,
		businessAddressStreet: this._businessAddressStreet,
		businessAddressStreetNumber: this._businessAddressStreetNumber,
		businessAddressStreetSecondaryNumber: this._businessAddressStreetSecondaryNumber,
		businessAddressStreetBuildNumber: this._businessAddressStreetBuildNumber,
		// businessAddressStreetComplement: this._businessAddressStreetComplement,
		businessEmail: this._businessEmail,
		businessPrefix: this._businessPrefix,
		businessPhoneNumber: this._businessPhoneNumber,

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
		legalRepresentativeEmail: this._legalRepresentativeEmail,
		legalRepresentativePrefix: this._legalRepresentativePrefix,
		legalRepresentativePhoneNumber: this._legalRepresentativePhoneNumber,
	});

	constructor() {
		afterNextRender(() => {
			this._fillForm();
		});

		this._syncForm();
		this._syncDepartments();
		this._syncBirthDate();
	}

	private _syncForm(): void {
		this._form.valueChanges
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				debounceTime(300),
				distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
			)
			.subscribe((form) => {
				this._signUpFormStore.setBusinessForm(form);
				this.formChange.emit(this._form.invalid);
			});
	}

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
			this._formCitiesApi.updateBusinessDepartment.bind(this._formCitiesApi),
			this._businessCityDisabled
		);

		setupDepartmentSync(
			this._legalRepresentativeBirthDepartment,
			this._legalRepresentativeBirthCity,
			this._formCitiesApi.updateLegalRepresentativeBirthDepartment.bind(this._formCitiesApi),
			this._legalRepresentativeBirthCityDisabled
		);

		setupDepartmentSync(
			this._legalRepresentativeExpeditionDepartment,
			this._legalRepresentativeExpeditionCity,
			this._formCitiesApi.updateLegalRepresentativeExpeditionDepartment.bind(this._formCitiesApi),
			this._legalRepresentativeExpeditionCityDisabled
		);
	}

	private _syncBirthDate(): void {
		this._legalRepresentativeBirthdate.valueChanges.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged()).subscribe((date) => {
			this._birthDate.set(date);
		});
	}

	private _fillForm(): void {
		this._signUpFormStore
			.select((state) => state.businessForm)
			.pipe(take(1), distinctUntilChanged())
			.subscribe((form) => {
				if (!form || Object.keys(form).length === 0) return;

				this._businessPersonType.setValue(form['businessPersonType']);
				this._businessName.setValue(form['businessName']);
				this._businessTradeName.setValue(form['businessTradeName']);
				this._businessNit.setValue(form['businessNit']);
				this._businessEconomicActivity.setValue(form['businessEconomicActivity']);
				this._businessCountry.setValue(form['businessCountry']);
				this._businessDepartment.setValue(form['businessProvince']);
				this._businessCity.setValue(form['businessCity']);
				this._businessAddressStreet.setValue(form['businessAddressStreet']);
				this._businessAddressStreetNumber.setValue(form['businessAddressStreetNumber']);
				this._businessAddressStreetSecondaryNumber.setValue(form['businessAddressStreetSecondaryNumber']);
				this._businessAddressStreetBuildNumber.setValue(form['businessAddressStreetBuildNumber']);
				// this._businessAddressStreetComplement.setValue(form['businessAddressStreetComplement']);
				this._businessEmail.setValue(form['businessEmail']);
				this._businessPrefix.setValue(form['businessPrefix']);
				this._businessPhoneNumber.setValue(form['businessPhoneNumber']);

				this._legalRepresentativeName.setValue(form['legalRepresentativeName']);
				this._legalRepresentativeSurName.setValue(form['legalRepresentativeSurName']);
				this._legalRepresentativeLastName.setValue(form['legalRepresentativeLastName']);
				this._legalRepresentativeSurLastName.setValue(form['legalRepresentativeSurLastName']);
				this._legalRepresentativeCharge.setValue(form['legalRepresentativeCharge']);
				this._legalRepresentativeArea.setValue(form['legalRepresentativeArea']);
				this._legalRepresentativeDocumentNumber.setValue(form['legalRepresentativeDocumentNumber']);
				this._legalRepresentativeBirthdate.setValue(new Date(form['legalRepresentativeBirthdate']));
				this._legalRepresentativeBirthCountry.setValue(form['legalRepresentativeBirthCountry']);
				this._legalRepresentativeBirthDepartment.setValue(form['legalRepresentativeBirthDepartment']);
				this._legalRepresentativeBirthCity.setValue(form['legalRepresentativeBirthCity']);
				this._legalRepresentativeExpeditionDate.setValue(new Date(form['legalRepresentativeExpeditionDate']));
				this._legalRepresentativeExpeditionCountry.setValue(form['legalRepresentativeExpeditionCountry']);
				this._legalRepresentativeExpeditionDepartment.setValue(form['legalRepresentativeExpeditionDepartment']);
				this._legalRepresentativeExpeditionCity.setValue(form['legalRepresentativeExpeditionCity']);
				this._legalRepresentativeEmail.setValue(form['legalRepresentativeEmail']);
				this._legalRepresentativePrefix.setValue(form['legalRepresentativePrefix']);
				this._legalRepresentativePhoneNumber.setValue(form['legalRepresentativePhoneNumber']);
			});
	}

	public getForm(): FormGroup {
		return this._form;
	}
}
