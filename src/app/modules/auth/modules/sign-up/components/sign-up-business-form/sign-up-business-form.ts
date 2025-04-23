import { Component, inject, signal } from '@angular/core';
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '@auth/modules/sign-up/api/form-get-departments';
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
    templateUrl: 'sign-up-business-form.html',
    viewProviders: [DepartmentService],
    imports: [FrsButtonModule, FrsComboboxModule, FrsDatePickerModule, FrsFieldModule, FrsInputModule, FrsSelectModule, ReactiveFormsModule],
})
export class SignUpBusinessForm {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _formValidator = inject(FormValidator);
    private readonly _departmentService = inject(DepartmentService);

    protected readonly _disabled = signal(true);
    protected readonly _economicActivities = ECONOMIC_ACTIVITIES as { label: any; value: any }[];
    protected readonly _addressStreets = ADDRESS_STREETS;
    protected readonly _departments = this._departmentService.departments;
    protected readonly _minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
    protected readonly _maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 80));

    // Business form inputs
    protected readonly _businessPersonType = this._formBuilder.control('');
    protected readonly _businessName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
    protected readonly _businessTradeName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
    protected readonly _businessNit = this._formBuilder.control('', [Validators.required, this._formValidator.nit()]);
    protected readonly _businessEconomicActivity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
    protected readonly _businessCountry = this._formBuilder.control('');
    protected readonly _businessProvince = this._formBuilder.control('', [Validators.required]);
    protected readonly _businessCity = this._formBuilder.control('', [Validators.required]);
    protected readonly _businessAddressStreet = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
    protected readonly _businessAddressStreetNumber = this._formBuilder.control('', [Validators.required]);
    protected readonly _businessAddressStreetSecondaryNumber = this._formBuilder.control('', [Validators.required]);
    protected readonly _businessAddressStreetBuildNumber = this._formBuilder.control('', [Validators.required]);
    protected readonly _businessAddressStreetComplement = this._formBuilder.control('');
    protected readonly _businessEmail = this._formBuilder.control('', [Validators.required, Validators.email]);
    protected readonly _businessPrefix = this._formBuilder.control('', [Validators.required]);
    protected readonly _businessPhoneNumber = this._formBuilder.control('', [Validators.required, this._formValidator.phoneNumber()]);

    // Legal representative
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
    protected readonly _legalRepresentativeBirthProvince = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
    protected readonly _legalRepresentativeBirthCity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
    protected readonly _legalRepresentativeExpeditionDate = this._formBuilder.control<TCalendarDate>(null, [
        Validators.required,
        this._formValidator.atLeast18Years(),
        this._formValidator.atMost80Years(),
    ]);
    protected readonly _legalRepresentativeExpeditionCountry = this._formBuilder.control('', [Validators.required]);
    protected readonly _legalRepresentativeExpeditionProvince = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
    protected readonly _legalRepresentativeExpeditionCity = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
    protected readonly _legalRepresentativePrefix = this._formBuilder.control('', [Validators.required]);
    protected readonly _legalRepresentativePhoneNumber = this._formBuilder.control('', [Validators.required, this._formValidator.phoneNumber()]);

    //form group
    protected readonly _businessForm = this._formBuilder.group({
        personType: this._businessPersonType,
        business: this._businessName,
        tradeName: this._businessTradeName,
        nit: this._businessNit,
        economicActivity: this._businessEconomicActivity,
        country: this._businessCountry,
        province: this._businessProvince,
        city: this._businessCity,
        addressStreet: this._businessAddressStreet,
        addressStreetPhoneNumber: this._businessAddressStreetNumber,
        addressStreetSecondaryNumber: this._businessAddressStreetSecondaryNumber,
        addressStreetBuildNumber: this._businessAddressStreetBuildNumber,
        addressStreetComplement: this._businessAddressStreetComplement,
    });

    protected readonly _legalRepresentativeForm = this._formBuilder.group({
        name: this._legalRepresentativeName,
        surName: this._legalRepresentativeSurName,
        lastName: this._legalRepresentativeLastName,
        surLastName: this._legalRepresentativeSurLastName,
        charge: this._legalRepresentativeCharge,
        area: this._legalRepresentativeArea,
        documentNumber: this._legalRepresentativeDocumentNumber,
        birthdate: this._legalRepresentativeBirthdate,
        birthCountry: this._legalRepresentativeBirthCountry,
        birthProvince: this._legalRepresentativeBirthProvince,
        birthCity: this._legalRepresentativeBirthCity,
        expeditionDate: this._legalRepresentativeExpeditionDate,
        expeditionCountry: this._legalRepresentativeExpeditionCountry,
        expeditionProvince: this._legalRepresentativeExpeditionProvince,
        expeditionCity: this._legalRepresentativeExpeditionCity,
        prefix: this._legalRepresentativePrefix,
        phoneNumber: this._legalRepresentativePhoneNumber,
    });

    constructor() {
        // this._syncForms();
        this._departmentService.loadDepartments(1);
    }

    private _syncForms(): void {
        this._legalRepresentativeForm.valueChanges.subscribe(value => {
            console.log(this._legalRepresentativeForm.errors);
        });
    }

    protected _onSubmit(): void {
        console.log(this._businessForm.value);
    }

    public getBusinessForm(): FormGroup {
        return this._businessForm;
    }
}
