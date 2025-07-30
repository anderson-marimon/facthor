import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TOperationHistory } from '@dashboard/modules/operation-history-management/payer-history/api/get-payer-operations-history';

type TStoreActiveOperations = {
	payerOperationsHistory: TOperationHistory[];
};

@Injectable()
export class StorePayerOperationsHistory extends ComponentStore<TStoreActiveOperations> {
	constructor() {
		super({ payerOperationsHistory: [] });
	}

	public readonly setPayerOperationsHistory = this.updater((store, activeOperationList: TOperationHistory[]) => {
		return { ...store, payerOperationsHistory: activeOperationList };
	});

	public readonly getPayerOperationsHistory = () => {
		return this.get().payerOperationsHistory;
	};
}
