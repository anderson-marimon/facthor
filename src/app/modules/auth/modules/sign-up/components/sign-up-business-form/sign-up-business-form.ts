import { Component, inject, signal } from '@angular/core';
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidator } from '@auth/modules/sign-up/services/form-validator';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsComboboxModule } from '@fresco-ui/frs-combobox';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';
import { ADDRESS_STREETS } from '@shared/common/address-streets';
import { ECONOMIC_ACTIVITIES } from '@shared/common/economic-activity';

@Component({
    selector: 'sign-up-business-form',
    templateUrl: 'sign-up-business-form.html',
    imports: [FrsButtonModule, FrsComboboxModule, FrsFieldModule, FrsInputModule, FrsSelectModule, ReactiveFormsModule],
})
export class SignUpBusinessForm {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _formValidator = inject(FormValidator);

    protected readonly _disabled = signal(true);
    protected readonly _economicActivities = ECONOMIC_ACTIVITIES as { label: any; value: any }[];
    protected readonly _addressStreets = ADDRESS_STREETS;

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
    protected readonly _businessPrefix = this._formBuilder.control('+57', [Validators.required]);
    protected readonly _businessNumber = this._formBuilder.control('', [Validators.required]);

    // Legal representative

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
        addressStreetNumber: this._businessAddressStreetNumber,
        addressStreetSecondaryNumber: this._businessAddressStreetSecondaryNumber,
        addressStreetBuildNumber: this._businessAddressStreetBuildNumber,
        addressStreetComplement: this._businessAddressStreetComplement,
    });

    protected _onSubmit(): void {
        console.log(this._businessForm.value);
    }

    public getBusinessForm(): FormGroup {
        return this._businessForm;
    }
}
