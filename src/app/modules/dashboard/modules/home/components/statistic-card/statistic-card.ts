import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
	selector: 'home-statistic-card',
	templateUrl: 'statistic-card.html',
	imports: [CurrencyPipe],
})
export class HomeStatisticCard {
	public readonly label = input('label');
	public readonly value = input('label');
	public readonly isCurrency = input(false);
}