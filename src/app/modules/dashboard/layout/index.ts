import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransitionView } from '@dashboard/components/transition-view/transition-view';

@Component({
	selector: 'dashboard-layout',
	imports: [RouterOutlet, TransitionView],
	templateUrl: 'index.html',
})
export default class DashboardLayout {}
