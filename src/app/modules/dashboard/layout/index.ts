import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideNav } from '@dashboard/components/aside-nav/aside-nav';
import { TransitionView } from '@dashboard/transition';

@Component({
	selector: 'dashboard-layout',
	imports: [RouterOutlet, AsideNav, TransitionView],
	templateUrl: 'index.html',
})
export default class DashboardLayout {}
