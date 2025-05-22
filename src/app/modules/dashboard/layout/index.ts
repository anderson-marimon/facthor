import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideNav } from '@dashboard/components/aside-nav/aside-nav';
import { TopBar } from '@dashboard/components/top-bar/top-bar';
import { TransitionView } from '@dashboard/transition';

@Component({
	selector: 'dashboard-layout',
	templateUrl: 'index.html',
	imports: [RouterOutlet, AsideNav, TransitionView, TopBar],
})
export default class DashboardLayout {}
