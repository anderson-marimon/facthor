import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EAccessInformation } from '@dashboard/common/enums/access-information';
import { TAccessServices } from '@dashboard/common/enums/services';
import {
	ApiGetFormalizedInvoiceList,
	TApiGetFormalizedInvoiceListQueryParams,
	TApiGetFormalizedInvoiceListQuerySignalParams,
	TFormalizedInvoice,
} from '@dashboard/modules/operations-management/create-operation/api/get-formalized-invoices';
import { ApiGetOperationsFinancierList } from '@dashboard/modules/operations-management/create-operation/api/get-operation-financiers';
import { ApiPostCreateOperation } from '@dashboard/modules/operations-management/create-operation/api/post-create-operation';
import {
	ApiPostGetOperationSummary,
	TApiPostGetOperationSummarySignalBody,
} from '@dashboard/modules/operations-management/create-operation/api/post-get-operation-summary';
import { CreateOperationPrepareOperationDrawer } from '@dashboard/modules/operations-management/create-operation/components/prepare-operation-drawer/prepare-operation-drawer';
import { CreateOperationTableFilters } from '@dashboard/modules/operations-management/create-operation/components/table-filters/table-filters';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsCheckboxModule } from '@fresco-ui/frs-checkbox';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InvoiceStatus } from '@shared/components/invoice-status/invoice-status';
import { Eye, FileX2, LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { tap } from 'rxjs';

const HEADERS = ['n.factura', 'nit del emisor', 'emisor', 'receptor', 'estado', 'expedition', 'vencimiento', 'detalles'];

@Component({
	selector: 'operations-management-create-operation',
	templateUrl: 'index.html',
	animations: [
		trigger('slideEffect', [
			transition(':enter', [
				style({ transform: 'translateY(100%)' }),
				animate('800ms cubic-bezier(0.25, 1, 0.5, 1)', style({ transform: 'translateY(0)' })),
			]),
			transition(':leave', [animate('800ms cubic-bezier(0.25, 1, 0.5, 1)', style({ transform: 'translateY(100%)' }))]),
		]),
	],
	providers: [ApiGetFormalizedInvoiceList, ApiGetOperationsFinancierList, ApiPostCreateOperation, ApiPostGetOperationSummary],
	imports: [
		CreateOperationTableFilters,
		CreateOperationPrepareOperationDrawer,
		CommonModule,
		EmptyResult,
		FrsButtonModule,
		FrsCheckboxModule,
		GeneralLoader,
		InheritTable,
		InheritTableFooter,
		InvoiceStatus,
		LucideAngularModule,
	],
})
export default class OperationsManagementCreateOperation {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _apiGetFormalizedInvoiceList = inject(ApiGetFormalizedInvoiceList);
	private readonly _apiGetOperationFinancierList = inject(ApiGetOperationsFinancierList);
	private readonly _apiPostGetOperationSummary = inject(ApiPostGetOperationSummary);
	private readonly _apiPostCreateOperation = inject(ApiPostCreateOperation);
	private readonly _selectedFormalizedInvoices = signal<string[]>([]);
	private readonly _selectedFormalizedInvoice = signal<Nullable<TFormalizedInvoice>>(null);
	private readonly _getOperationSummaryBody = signal<Nullable<TApiPostGetOperationSummarySignalBody>>(null);

	private readonly _accessToken = signal('');
	private readonly _accessModule = signal('');
	private readonly _accessServices = signal<Nullable<TAccessServices>>(null);

	private readonly _getFormalizedInvoiceListParams = signal<Partial<TApiGetFormalizedInvoiceListQuerySignalParams>>({});

	protected readonly _eyeIcon = Eye;
	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;

	protected readonly _createOperationResult = this._apiPostCreateOperation.response;
	protected readonly _isLoadingApiPostCreateOperation = this._apiPostCreateOperation.isLoading;

	protected readonly _invoices = this._apiGetFormalizedInvoiceList.response;
	protected readonly _isLoadingApiGetFormalizedInvoiceList = this._apiGetFormalizedInvoiceList.isLoading;

	protected readonly _operationSummary = this._apiPostGetOperationSummary.response;
	protected readonly _isLoadingApiPostGetOperationSummary = this._apiPostGetOperationSummary.isLoading;

	protected readonly _allSelectControl = this._formBuilder.control(false);
	protected readonly _selectControls = signal<FormControl<boolean | null>[]>([]);
	protected readonly _isOperationReadyToCreate = signal(false);
	protected readonly _isSelectedFinancier = signal(false);
	protected readonly _showPrepareInvoiceSection = signal(false);

	constructor() {
		this._getAccessInformation();
		this._getInitFormalizedInvoiceList();
		this._addObservables();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken.set(data[EAccessInformation.TOKEN]);
			this._accessModule.set(data[EAccessInformation.MODULE]);
			this._accessServices.set(data[EAccessInformation.SERVICES]);
		});
	}

	private _getInitFormalizedInvoiceList(): void {
		this._getFormalizedInvoiceListParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_FORMALIZED_INVOICES_SERVICE,
			Page: 1,
			Size: 14,
		});

		this._apiGetFormalizedInvoiceList.getFormalizedInvoiceList(this._getFormalizedInvoiceListParams());
	}

	private _addObservables(): void {
		toObservable(this._invoices)
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				tap((invoices) => {
					if (!invoices) {
						this._selectControls.set([]);
						return;
					}
					this._syncSelectControls(invoices.data);
				})
			)
			.subscribe();

		toObservable(this._createOperationResult)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((createOperationResult) => {
				if (!createOperationResult?.ok && createOperationResult?.internalCode === 1102) {
					toast.message('Parámetros del financiador actualizado', {
						description: 'Se han actualizados los parámetros del financiador, revise el detalle nuevamente.',
					});

					this._reloadPostGetOperationSummary();
				}
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

	private _reloadPostGetOperationSummary(): void {
		this._apiPostGetOperationSummary._getOperationSummary({ ...this._getOperationSummaryBody()! });
	}

	protected _getSelectedInvoices(): any[] {
		const controls = this._selectControls();
		return (
			this._invoices()?.data.filter((_, index) => {
				return controls[index]?.value === true;
			}) || []
		);
	}

	// ==== Futura implementación ====
	// private _areAllSelected(): boolean {
	// 	const controls = this._selectControls();
	// 	return controls.length > 0 && controls.every((control) => control.value);
	// }

	protected _onChangeSelectSingleInvoice(index: number, formalizedInvoice: TFormalizedInvoice): void {
		const controls = this._selectControls();

		controls.forEach((control, i) => {
			if (i === index) {
				control.setValue(true);
				const invoiceId = this._invoices()?.data[index].id;
				this._selectedFormalizedInvoices.set([invoiceId!]);
				this._selectedFormalizedInvoice.set(formalizedInvoice);
			} else {
				control.setValue(false);
			}
		});

		const isAllChecked = controls.every((control) => control.value);
		this._allSelectControl.setValue(isAllChecked);
	}

	protected _onSelectFinancier(status: boolean): void {
		this._isSelectedFinancier.set(status);
	}

	protected _onClickToggleShowPrepareOperation(): void {
		this._showPrepareInvoiceSection.update((prev) => {
			if (prev) {
				this._getInitFormalizedInvoiceList();
			}

			return !prev;
		});
	}

	// ==== Futura implementación ====
	// protected _toggleAllSelection(): void {
	// 	const value = this._allSelectControl.value;
	// 	this._selectControls().forEach((control) => control.setValue(value));
	// }

	protected _getOperationsFinancierList(): void {
		this._apiGetOperationFinancierList._getOperationsFinancierList({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_FINANCIER_SERVICE,
		});
	}

	protected _postGetOperationSummary(financierId: number): void {
		this._getOperationSummaryBody.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATION_SUMMARY_SERVICE,
			invoices: [this._selectedFormalizedInvoice()?.id!],
			idFinancier: financierId,
		});

		this._apiPostGetOperationSummary._getOperationSummary({ ...this._getOperationSummaryBody()! });
	}

	protected _getFormalizedInvoiceListForPaginator(page: number): void {
		this._apiGetFormalizedInvoiceList.getFormalizedInvoiceList({
			...this._getFormalizedInvoiceListParams(),
			Page: page,
		});
	}

	protected _getFormalizedInvoiceListForFilter(queryFilters: Partial<Omit<TApiGetFormalizedInvoiceListQueryParams, 'Size'>>): void {
		this._getFormalizedInvoiceListParams.set({
			...this._getFormalizedInvoiceListParams(),
			...queryFilters,
		});

		this._apiGetFormalizedInvoiceList.getFormalizedInvoiceList(this._getFormalizedInvoiceListParams());
	}
}
