import { Component, computed, effect, input, signal } from '@angular/core';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { ChevronLeft, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'inherit-table-footer',
	templateUrl: 'inherit-table-footer.html',
	imports: [FrsButtonModule, LucideAngularModule],
})
export class InheritTableFooter {
	public readonly totalPages = input(0);
	public readonly currentPage = input(1);
	public readonly paginatorFunction = input<(page: number) => void>();

	protected readonly _chevronIcon = ChevronLeft;
	protected readonly _totalPages = signal(this.totalPages() || 1);

	protected readonly _isActiveNextPage = computed(() => {
		return this._totalPages() > this.currentPage();
	});

	protected readonly _isActivePreviousPage = computed(() => {
		return this.currentPage() > 1;
	});

	constructor() {
		this._watchTotalPages();
	}

	private _watchTotalPages(): void {
		effect(() => {
			const realTotalPages = this.totalPages();
			const current = this._totalPages();

			if (realTotalPages !== current && realTotalPages > 0) {
				this._totalPages.set(realTotalPages);
			}
		});
	}

	protected _onClickPreviousPage(): void {
		if (!this._isActivePreviousPage()) return;
		const paginator = this.paginatorFunction();

		if (!paginator) {
			console.warn('Pagination function not initialized');
			return;
		}

		paginator(this.currentPage() - 1);
	}

	protected _onClickNextPage(): void {
		if (!this._isActiveNextPage()) return;

		const paginator = this.paginatorFunction();
		if (!paginator) {
			console.warn('Pagination function not initialized');
			return;
		}

		paginator(this.currentPage() + 1);
	}
}
