import { envs } from '@envs/envs';
import { ComponentStore } from '@ngrx/component-store';
import { firstValueFrom } from 'rxjs';

export async function devReduxTool(store: ComponentStore<any>, name: string): Promise<void> {
	if (typeof window === 'undefined' || !(window as any).__REDUX_DEVTOOLS_EXTENSION__) return;
	if (envs.PRODUCTION) return;

	const devtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({ name });

	const initialState = await firstValueFrom(store.state$);
	devtools.init(initialState);

	store.state$.subscribe((state) => {
		devtools.send(`${name}_UPDATE`, state);
	});
}
