import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { getBase64FromTFile } from '@shared/utils/get-base64-from-t-file';
import { toast } from 'ngx-sonner';

export class ApiPostSignUp {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _signUpForm = signal<Record<string, any>>({});
	private readonly _resource = resource({ request: this._signUpForm, loader: (body) => this._signUp(body) });

	public readonly data = this._resource.value;
	public readonly loading = this._resource.isLoading;
	public readonly errors = this._resource.error;

	private async _signUp(body: ResourceLoaderParams<Record<string, any>>): Promise<boolean> {
		if (Object.keys(this._signUpForm()).length === 0) return false;

		const path = `${this._url}${envs.FT_AUTH_REGISTER}`;

		try {
			const response = await fetch(path, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body.request),
				signal: body.abortSignal,
			});

			const { ok, message }: TApi<boolean> = await response.json();

			if (!ok) {
				throw new Error(message);
			}

			toast.message('Registro exitoso', {
				description: 'Recibirás un correo de confirmación.',
			});

			return ok;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));

			toast.message('Registro fallido', {
				description: error.message || 'error al enviar el formulario de registro, por favor intente nuevamente',
			});
			return false;
		}
	}

	public signUp(form: Record<string, any>): void {
		const { role, business, documents, account } = form;
		const [nit, digit] = business['businessNit'].split('-');

		const _form = {
			roleExecution: Number(role['option']),
			idPersonType: 1,
			businessLegalName: business['businessName'],
			tradename: business['businessTradeName'],
			idIdentificationType: 2,
			identificationNumber: Number(nit),
			identificationCheckDigit: Number(digit),
			idCodeCiiu: business['businessEconomicActivity'][0].value,
			idCountry: 82,
			idDepartment: business['businessProvince'][0].value,
			idTown: business['businessCity'][0].value,
			principalAddress:
				business['businessAddressStreet'][0].label +
				' ' +
				business['businessAddressStreetNumber'] +
				' # ' +
				business['businessAddressStreetSecondaryNumber'] +
				' - ' +
				business['businessAddressStreetBuildNumber'],

			email: business['businessEmail'],
			cellCallsign: '57',
			cellPhone: business['businessPhoneNumber'],
			legalRepFirstName: business['legalRepresentativeName'],
			legalRepSecondName: business['legalRepresentativeSurName'] || undefined,
			legalRepFirstSurname: business['legalRepresentativeLastName'],
			legalRepSecondSurname: business['legalRepresentativeSurLastName'],
			legalRepJobTitle: business['legalRepresentativeCharge'],
			legalRepArea: business['legalRepresentativeArea'],
			legalRepIdType: 1,
			legalRepIdNumber: Number(business['legalRepresentativeDocumentNumber']),
			legalRepIdBirthdate: business['legalRepresentativeBirthdate'].toLocaleDateString('en-CA'),
			legalRepIdBirthCountry: 82,
			legalRepIdBirthDepartment: business['legalRepresentativeBirthDepartment'][0].value,
			legalRepIdBirthTown: business['legalRepresentativeBirthCity'][0].value,
			legalRepIdDateIssuance: business['legalRepresentativeExpeditionDate'].toLocaleDateString('en-CA'),
			legalRepIdCountryIssuance: 82,
			legalRepIdDepartmentIssuance: business['legalRepresentativeExpeditionDepartment'][0].value,
			legalRepIdTownIssuance: business['legalRepresentativeExpeditionCity'][0].value,
			legalRepEmail: business['legalRepresentativeEmail'],
			legalRepCellCallsign: business['legalRepresentativePrefix'],
			legalRepCellPhone: business['legalRepresentativePhoneNumber'],
			user: {
				firstName: account['firsName'],
				secondName: account['surName'] || undefined,
				firstSurname: account['lastName'],
				secondSurname: account['surLastName'],
				username: account['dniNumber'],
				email: account['email'],
				password: account['password'],
			},
			businessLegalDocuments: [
				{
					idLegalDocumentType: 1,
					legalDocumentBase64: getBase64FromTFile(documents['chamberOfCommerceFile'][0]),
				},
				{
					idLegalDocumentType: 2,
					legalDocumentBase64: getBase64FromTFile(documents['rutFile']),
				},
				{
					idLegalDocumentType: 3,
					legalDocumentBase64: getBase64FromTFile(documents['bankCertificationFile'][0]),
				},
				{
					idLegalDocumentType: 4,
					legalDocumentBase64: getBase64FromTFile(documents['legalRepresentativeDniFile'][0]),
				},
			],
			bankAccount: {
				idBank: documents['bank'][0].value,
				accountNumber: documents['accountNumber'],
				idAccountType: documents['accountType'][0].value,
			},
		};

		_form.principalAddress = _form.principalAddress.trim();
		if (role['option'] !== '2') {
			_form.businessLegalDocuments.push({
				idLegalDocumentType: 5,
				legalDocumentBase64: getBase64FromTFile(documents['financialStatementsFile'][0]),
			});
		}

		this._signUpForm.set(_form);
	}
}
