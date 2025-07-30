import { afterNextRender, Component, input, Signal } from '@angular/core';
import { ViewCard } from '@shared/components/view-card/view-card';
import { TBankAccount } from '@dashboard/modules/operations-management/upload-proof-disbursement/api/get-bank-account';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';

type ModalProps = {
	fnGetBankAccount: () => void;
	isLoadingApiGetBankAccount: Signal<boolean>;
	bankAccount: Signal<Nullable<TBankAccount>>;
};

@Component({
	selector: 'bank-account-modal',
	templateUrl: 'bank-account-modal.html',
	imports: [ViewCard, GeneralLoader],
})
export class BankAccountModal {
	public readonly data = input.required<ModalProps>();
	public readonly closeDialog = input<() => void>();

	constructor() {
		afterNextRender(() => {
			this.data().fnGetBankAccount();
		});
	}
}