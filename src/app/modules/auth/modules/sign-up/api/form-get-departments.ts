import { Signal, signal } from '@angular/core';

type TApiDepartment = {
    name: string;
    value: number;
};

export class DepartmentService {
    private _departments = signal<TApiDepartment[]>([]);
    private _isLoading = signal(false);
    private _error = signal<Error | null>(null);

    get departments(): Signal<TApiDepartment[]> {
        return this._departments;
    }

    get isLoading(): Signal<boolean> {
        return this._isLoading;
    }

    get error(): Signal<Error | null> {
        return this._error;
    }

    public async loadDepartments(countryId: number): Promise<void> {
        this._isLoading.set(true);
        this._error.set(null);

        try {
            const response = await fetch(`https://api.example.com/countries/${countryId}/departments`);
            if (!response.ok) throw new Error('Failed to fetch departments');

            const data = (await response.json()) as TApiDepartment[];
            this._departments.set(data);
        } catch (err) {
            this._error.set(err as Error);
            this._departments.set([]);
        } finally {
            this._isLoading.set(false);
        }
    }

    reloadDepartments(countryId: number): void {
        this.loadDepartments(countryId);
    }
}
