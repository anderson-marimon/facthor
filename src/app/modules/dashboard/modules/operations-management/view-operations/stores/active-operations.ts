import { Injectable } from '@angular/core';
import { TActiveOperation } from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { ComponentStore } from '@ngrx/component-store';

type TStoreActiveOperations = {
	activeOperationList: TActiveOperation[];
};

@Injectable()
export class StoreActiveOperations extends ComponentStore<TStoreActiveOperations> {
	constructor() {
		super({ activeOperationList: [] });
	}

	public readonly setActiveOperationList = this.updater((store, activeOperationList: TActiveOperation[]) => {
		return { ...store, activeOperationList };
	});

	public readonly getActiveOperationList = () => {
		return this.get().activeOperationList;
	};
}
