import { afterNextRender, Component, DestroyRef, inject, Injector, input, runInInjectionContext, signal, Signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InvoiceDetailStatus } from '@shared/components/invoice-detail-status/invoice-detail-status';
import {
	TApiGetOrderInvoiceListResponse,
	TOrderInvoice,
} from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-list';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FrsCheckboxModule } from '@fresco-ui/frs-checkbox';
import { LucideAngularModule, MousePointer } from 'lucide-angular';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { FrsButtonDirective } from '@fresco-ui/frs-button/frs-button';
import { getBase64FromTFile } from '@shared/utils/get-base64-from-t-file';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { UploadProofDisbursementReserveDragInputFiles } from '@dashboard/modules/operations-management/upload-proof-disbursement/components/reserve-drag-input-files/reserve-drag-input-files';

type ModalProps = {
	fnGetOrderInvoiceList: () => void;
	orderInvoices: Signal<Nullable<TApiGetOrderInvoiceListResponse['data']>>;
	isLoadingOrderInvoiceList: Signal<boolean>;
	fnUploadProofDisbursementReserveFinancier: (params: { description: string; invoices: number[]; proofDisbursement: string }) => void;
	isLoadingApiPostUploadProofDisbursementReserveFinancier: Signal<boolean>;
};

const HEADERS = ['n.factura', 'emisor', 'nit del emisor', 'estado', 'fecha de emisión', 'monto de factura'];

@Component({
	selector: 'upload-proof-reserve-disbursement-modal',
	templateUrl: 'upload-proof-reserve-disbursement-modal.html',
	imports: [
		CommonModule,
		CurrencyPipe,
		EmptyResult,
		FrsButtonDirective,
		FrsCheckboxModule,
		GeneralLoader,
		InheritTable,
		InvoiceDetailStatus,
		LoadingIcon,
		LucideAngularModule,
		UploadProofDisbursementReserveDragInputFiles,
	],
})
export class UploadProofReserveDisbursementModal {
	public readonly data = input.required<ModalProps>();
	public readonly closeDialog = input<() => void>();

	private readonly _selectedInvoicesId = signal<number[]>([]);
	private readonly _selectedInvoice = signal<Nullable<TOrderInvoice>>(null);

	private readonly _destroyRef = inject(DestroyRef);
	private readonly _injector = inject(Injector);
	private readonly _formBuilder = inject(FormBuilder);

	protected readonly _files = signal<TFile[]>([]);
	protected readonly _selectControls = signal<FormControl<boolean | null>[]>([]);
	protected readonly _control = this._formBuilder.control('');
	protected readonly _cursorIcon = MousePointer;
	protected readonly _allSelectControl = this._formBuilder.control(false);
	protected readonly _headers = HEADERS;

	constructor() {
		afterNextRender(() => {
			this._addObservables();
			this.data().fnGetOrderInvoiceList();
		});
	}

	private _addObservables(): void {
		const { orderInvoices } = this.data();
		runInInjectionContext(this._injector, () => {
			toObservable(orderInvoices)
				.pipe(takeUntilDestroyed(this._destroyRef))
				.subscribe((invoices) => {
					if (!invoices) {
						this._selectControls.set([]);
						return;
					}
					this._syncSelectControls(invoices.data);
				});
		});
	}

	private _syncSelectControls(operations: any[]): void {
		const currentControls = this._selectControls();
		const currentValues = currentControls.map((control) => control.value);

		const newControls = operations.map((_, index) => {
			const previousValue = index < currentValues.length ? currentValues[index] : false;
			return this._formBuilder.control<boolean | null>(previousValue);
		});

		this._selectControls.set(newControls);
	}

	protected _getSelectedInvoices(): any[] {
		const controls = this._selectControls();
		return (
			this.data()
				?.orderInvoices()
				?.data.filter((_, index) => {
					return controls[index]?.value === true;
				}) || []
		);
	}

	protected _onChangeSelectSingleInvoice(index: number, orderInvoice: TOrderInvoice): void {
		const controls = this._selectControls();

		controls.forEach((control, i) => {
			if (i === index) {
				control.setValue(true);
				const invoiceId = this.data()?.orderInvoices()?.data[index].id;
				invoiceId && this._selectedInvoicesId.set([invoiceId]);
				this._selectedInvoice.set(orderInvoice);
			} else {
				control.setValue(false);
			}
		});

		const isAllChecked = controls.every((control) => control.value);
		this._allSelectControl.setValue(isAllChecked);
	}

	protected _onUploadFiles(files: TFile[]): void {
		this._files.set(files);
	}

	protected _onClickCancel(): void {
		this.closeDialog()!();
	}

	protected _onClickUploadProofDisbursement(): void {
		const { fnUploadProofDisbursementReserveFinancier, isLoadingApiPostUploadProofDisbursementReserveFinancier } = this.data();

		if (isLoadingApiPostUploadProofDisbursementReserveFinancier() || !this._files()[0]) return;

		fnUploadProofDisbursementReserveFinancier({
			proofDisbursement: getBase64FromTFile(this._files()[0]),
			invoices: this._selectedInvoicesId(),
			description: this._control.value?.trim() || 'Sin comentarios',
		});
	}
}
