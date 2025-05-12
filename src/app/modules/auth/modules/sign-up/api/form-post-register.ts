import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { TApi } from '@shared/types/api-response';

export class ApiFormPostRegister {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _form = signal<Record<string, any>>({});
	private readonly _resource = resource({ request: this._form, loader: (body) => this._postForm(body) });

	public readonly data = this._resource.value;
	public readonly loading = this._resource.isLoading;
	public readonly errors = this._resource.error;

	private async _postForm(body: ResourceLoaderParams<Record<string, any>>): Promise<any> {
		if (Object.keys(this._form()).length === 0) return;

		const path = `${this._url}${envs.FT_AUTH_REGISTER}`;

		try {
			const response = await fetch(path, {
				method: 'POST',
				signal: body.abortSignal,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error('error al enviar el formulario de registro, por favor intente nuevamente');
			}

			const result: TApi<boolean> = await response.json();
			console.log(result);

			return result.data;
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	public sendForm(form: Record<string, any>): void {
		const { role, business, documents, account } = form;
		const [nit, digit] = business['businessNit'].split('-');

		const _form = {
			roleExecution: role['option'],
			idPersonType: 1,
			businessLegalName: business['businessName'],
			tradename: business['businessTradeName'],
			idIdentificationType: 2,
			identificationNumber: nit,
			identificationCheckDigit: digit,
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
				business['businessAddressStreetBuildNumber'] +
				' ' +
				business['businessAddressStreetComplement'],

			email: business['businessEmail'],
			cellCellsing: '57',
			cellPhone: business['businessPhoneNumber'],
			legalRepFirstName: business['legalRepresentativeName'],
			legalRepSecondName: business['legalRepresentativeSurName'] || undefined,
			legalRepFirstSurname: business['legalRepresentativeLastName'],
			legalRepSecondSurname: business['legalRepresentativeSurLastName'],
			legalRepJobTitle: business['legalRepresentativeCharge'],
			legalRepArea: business['legalRepresentativeArea'],
			legalRepIdType: 1,
			legalRepIdNumber: business['legalRepresentativeDocumentNumber'],
			legalRepBirthdate: business['legalRepresentativeBirthdate'].toLocaleDateString('en-CA'),
			legalRepBirthCountry: 82,
			legalRepBirthDepartment: business['legalRepresentativeBirthDepartment'][0].value,
			legalRepBirthTown: business['legalRepresentativeBirthCity'][0].value,
			legalRepIssuance: business['legalRepresentativeExpeditionDate'].toLocaleDateString('en-CA'),
			legalRepIssuanceCountry: 82,
			legalRepIssuanceDepartment: business['legalRepresentativeExpeditionDepartment'][0].value,
			legalRepIssuanceTown: business['legalRepresentativeExpeditionCity'][0].value,
			legalRepEmail: business['legalRepresentativeEmail'],
			legalRepCellsing: business['legalRepresentativePrefix'],
			legalRepCellPhone: business['legalRepresentativePhoneNumber'],
			user: {
				firstName: account['firsName'],
				secondName: account['surName'] || undefined,
				firstSurname: account['lastName'],
				secondSurname: account['surLastName'],
				email: account['email'],
				username: account['dniNumber'],
				password: account['password'],
			},
			businessLegalDocuments: [
				{
					idLegalDocumentType: 1,
					legalDocumentBase64: documents['chamberOfCommerceFile'][0].base64,
				},
				{
					idLegalDocumentType: 2,
					legalDocumentBase64: documents['rutFile'][0].base64,
				},
				{
					idLegalDocumentType: 3,
					legalDocumentBase64: documents['bankCertificationFile'][0].base64,
				},
				{
					idLegalDocumentType: 4,
					legalDocumentBase64: documents['legalRepresentativeDniFile'][0].base64,
				},
			],
			bankAccount: {
				idBank: documents['bank'][0].value,
				idAccountType: documents['accountType'][0].value,
				accountNumber: documents['accountNumber'],
			},
		};

		_form.principalAddress = _form.principalAddress.trim();
		if (role['option'] !== '2') {
			_form.businessLegalDocuments.push({
				idLegalDocumentType: 5,
				legalDocumentBase64: documents['financialStatementsFile'][0].base64,
			});
		}

		console.log(_form);

		// this._form.set(_form);
	}
}
