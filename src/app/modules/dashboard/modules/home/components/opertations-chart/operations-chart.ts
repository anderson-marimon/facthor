import {
	afterNextRender,
	Component,
	effect,
	ElementRef,
	HostListener,
	inject,
	Injector,
	input,
	runInInjectionContext,
	viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type TChartData = {
	month: string;
	idMonth: number;
	operationsCount: number;
};

@Component({
	selector: 'home-operations-chart',
	standalone: true,
	templateUrl: `operations-chart.html`,
	imports: [CommonModule],
})
export class HomeOperationsChartComponent {
	public readonly operations = input<TChartData[]>([]);
	public readonly operationsFinanced = input<TChartData[]>([]);
	public readonly maxY = input(0);
	public readonly minY = input(0);
	public readonly showFinanced = input(true); // <-- control para mostrar/ocultar financiadas

	private readonly _injector = inject(Injector);
	private readonly _canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
	private _ctx!: CanvasRenderingContext2D;
	private _animationFrameId: number | null = null;
	private _animationProgress = 0;
	private _hoveredIndex: number | null = null;
	private _pointsAnimationFrame = 0;
	private _pointAppearTimestamps: number[] = [];
	private _scaleFactor = 1.5;

	private _tooltipOpacity = 0;
	private _tooltipX = 0;
	private _tooltipY = 0;
	private _targetTooltipX = 0;
	private _targetTooltipY = 0;
	private _tooltipVisible = false;

	constructor() {
		afterNextRender(() => {
			const canvas = this._canvasRef()?.nativeElement;

			if (canvas) {
				this._ctx = canvas.getContext('2d')!;
			}

			runInInjectionContext(this._injector, () => {
				effect(() => {
					const ops = this.operations();
					const opsFinished = this.operationsFinanced();

					if (this._ctx && ops.length > 0 && (this.showFinanced() ? opsFinished.length > 0 : true) && this.maxY() > this.minY()) {
						this._animate();
					}
				});
			});
		});
	}

	@HostListener('window:resize')
	protected _onResize() {
		this._animate();
	}

	@HostListener('mousemove', ['$event'])
	protected _onMouseMove(event: MouseEvent) {
		const canvas = this._canvasRef()?.nativeElement;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;

		const width = canvas.clientWidth;
		const paddingLeft = 40;
		const paddingRight = 20;
		const graphWidth = width - paddingLeft - paddingRight;
		const months = this.operations().map((m) => m.month);
		const stepX = graphWidth / (months.length - 1);

		let closestIndex = 0;
		let minDist = Infinity;
		for (let i = 0; i < months.length; i++) {
			const pointX = paddingLeft + stepX * i;
			const dist = Math.abs(pointX - x);
			if (dist < minDist) {
				minDist = dist;
				closestIndex = i;
			}
		}

		const paddingTop = 20;
		const paddingBottom = 40;
		const legendHeight = 40;
		const height = canvas.clientHeight;
		const graphHeight = height - paddingTop - paddingBottom - legendHeight;
		const scaleY = graphHeight / (this.maxY() - this.minY());

		this._hoveredIndex = closestIndex;
		this._tooltipVisible = true;

		const targetX = paddingLeft + stepX * closestIndex;
		const total = this.operations()[closestIndex]?.operationsCount ?? 0;
		const finished = this.showFinanced() ? (this.operationsFinanced()[closestIndex]?.operationsCount ?? 0) : 0;
		const maxVal = this.showFinanced() ? Math.max(finished, total) : total;
		const targetY = paddingTop + graphHeight - (maxVal - this.minY()) * scaleY;

		this._targetTooltipX = targetX;
		this._targetTooltipY = targetY - 50;

		this._redraw();
	}

	@HostListener('mouseleave')
	protected _onMouseLeave() {
		this._tooltipVisible = false;
	}

	private _animate() {
		this._animationProgress = 0;
		this._pointsAnimationFrame = 0;
		this._pointAppearTimestamps = [];

		if (this._animationFrameId) {
			cancelAnimationFrame(this._animationFrameId);
		}

		const animateStep = () => {
			if (this._animationProgress < 1) {
				this._animationProgress += 0.02;
				if (this._animationProgress > 1) this._animationProgress = 1;
			} else {
				this._pointsAnimationFrame++;
			}
			this._redraw();
			this._animationFrameId = requestAnimationFrame(animateStep);
		};
		animateStep();
	}

	private _redraw() {
		const canvas = this._canvasRef()?.nativeElement;
		if (!canvas || !this._ctx) return;

		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const scale = this._scaleFactor;

		canvas.width = width * scale;
		canvas.height = height * scale;
		this._ctx.setTransform(scale, 0, 0, scale, 0, 0);

		const ease = 0.1;
		this._tooltipX += (this._targetTooltipX - this._tooltipX) * ease;
		this._tooltipY += (this._targetTooltipY - this._tooltipY) * ease;

		const targetOpacity = this._tooltipVisible ? 1 : 0;
		this._tooltipOpacity += (targetOpacity - this._tooltipOpacity) * ease;

		this._ctx.clearRect(0, 0, width, height);

		this._drawGrid(width, height);
		this._drawLines(width, height, this._animationProgress);
		this._drawLegend(width, height);
		this._drawTooltip(width, height);
	}

	private _drawGrid(width: number, height: number) {
		const ctx = this._ctx;
		const paddingLeft = 40;
		const paddingTop = 20;
		const paddingBottom = 40;
		const paddingRight = 20;
		const legendHeight = 40;
		const graphWidth = width - paddingLeft - paddingRight;
		const graphHeight = height - paddingTop - paddingBottom - legendHeight;

		ctx.strokeStyle = '#AAAAAA';
		ctx.lineWidth = 0.5;
		ctx.setLineDash([8, 8]);

		const numHorizontalLines = 4;

		ctx.beginPath();
		for (let i = 0; i < numHorizontalLines; i++) {
			const y = paddingTop + (graphHeight / numHorizontalLines) * i;
			ctx.moveTo(paddingLeft, y);
			ctx.lineTo(paddingLeft + graphWidth, y);
		}
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.beginPath();

		const baseY = paddingTop + graphHeight;
		ctx.moveTo(paddingLeft, baseY);
		ctx.lineTo(paddingLeft + graphWidth, baseY);
		ctx.stroke();

		ctx.fillStyle = '#555555';
		ctx.font = '12px nunito';

		for (let i = 0; i <= numHorizontalLines; i++) {
			if (i === numHorizontalLines) continue;
			const value = this.maxY() - ((this.maxY() - this.minY()) / numHorizontalLines) * i;
			const y = paddingTop + (graphHeight / numHorizontalLines) * i;
			ctx.fillText(`${value.toLocaleString()}`, 5, y + 4);
		}

		const months = this.operations().map((m) => m.month);
		const stepX = graphWidth / (months.length - 1);
		months.forEach((label, index) => {
			ctx.fillText(label, paddingLeft + stepX * index - 15, paddingTop + graphHeight + 20);
		});
	}

	private _drawLines(width: number, height: number, progress: number) {
		const ctx = this._ctx;
		const root = document.documentElement;
		const primaryColor = getComputedStyle(root).getPropertyValue('--primary');
		const secondaryColor = getComputedStyle(root).getPropertyValue('--primary-facthor');

		const paddingLeft = 40;
		const paddingTop = 20;
		const paddingBottom = 40;
		const paddingRight = 20;
		const legendHeight = 40;
		const graphWidth = width - paddingLeft - paddingRight;
		const graphHeight = height - paddingTop - paddingBottom - legendHeight;

		const months = this.operations().map((m) => m.month);
		const stepX = graphWidth / (months.length - 1);
		const scaleY = graphHeight / (this.maxY() - this.minY());

		const series = [
			...(this.showFinanced() ? [{ values: this.operationsFinanced().map((d) => d.operationsCount), color: primaryColor, dashed: true }] : []),
			{ values: this.operations().map((d) => d.operationsCount), color: secondaryColor, dashed: false },
		];

		series.forEach((serie) => {
			const points = serie.values.map((value, index) => ({
				x: paddingLeft + stepX * index,
				y: paddingTop + graphHeight - (value - this.minY()) * scaleY,
			}));

			if (points.length === 0) return;

			let totalLength = 0;
			for (let i = 1; i < points.length; i++) {
				const dx = points[i].x - points[i - 1].x;
				const dy = points[i].y - points[i - 1].y;
				totalLength += Math.sqrt(dx * dx + dy * dy);
			}

			const currentLength = totalLength * progress;

			ctx.beginPath();
			ctx.strokeStyle = serie.color;
			ctx.lineWidth = 2;
			ctx.setLineDash(serie.dashed ? [8, 8] : []);

			let accumulated = 0;
			ctx.moveTo(points[0].x, points[0].y);

			for (let i = 1; i < points.length; i++) {
				const dx = points[i].x - points[i - 1].x;
				const dy = points[i].y - points[i - 1].y;
				const segmentLength = Math.sqrt(dx * dx + dy * dy);
				if (accumulated + segmentLength >= currentLength) {
					const ratio = (currentLength - accumulated) / segmentLength;
					const x = points[i - 1].x + dx * ratio;
					const y = points[i - 1].y + dy * ratio;
					ctx.lineTo(x, y);
					break;
				} else {
					ctx.lineTo(points[i].x, points[i].y);
					accumulated += segmentLength;
				}
			}
			ctx.stroke();

			if (progress === 1) {
				const visiblePoints = Math.floor(this._pointsAnimationFrame / 10);
				const now = performance.now();
				points.forEach((point, index) => {
					if (index <= visiblePoints) {
						if (!this._pointAppearTimestamps[index]) {
							this._pointAppearTimestamps[index] = now;
						}
						const elapsed = now - this._pointAppearTimestamps[index];
						const duration = 300;
						const t = Math.min(1, elapsed / duration);
						const scale = 1 - Math.pow(1 - t, 3);
						const radius = 3 * scale;
						ctx.beginPath();
						ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
						ctx.fillStyle = serie.color;
						ctx.fill();
					}
				});
			}
		});
		ctx.setLineDash([]);
	}

	private _drawLegend(width: number, height: number) {
		const ctx = this._ctx;
		const root = document.documentElement;
		const primaryColor = getComputedStyle(root).getPropertyValue('--primary');
		const secondaryColor = getComputedStyle(root).getPropertyValue('--primary-facthor');

		const legendHeight = 20;
		const legendY = height - legendHeight + 10;
		const iconSize = 10;
		const spacing = 10;
		const textOffsetY = 2;

		ctx.font = '13px nunito';

		const text1 = 'Número de operaciones';
		const text2 = 'Operaciones financiadas';
		const text1Width = ctx.measureText(text1).width;

		let legendX = 5;

		ctx.fillStyle = secondaryColor;
		ctx.fillRect(legendX, legendY - 8, iconSize, iconSize);
		ctx.fillStyle = '#333';
		ctx.fillText(text1, legendX + iconSize + spacing, legendY + textOffsetY);

		if (this.showFinanced()) {
			const legend2X = legendX + iconSize + spacing + text1Width + 20;
			ctx.fillStyle = primaryColor;
			ctx.fillRect(legend2X, legendY - 8, iconSize, iconSize);
			ctx.fillStyle = '#333';
			ctx.fillText(text2, legend2X + iconSize + spacing, legendY + textOffsetY);
		}
	}

	private _drawTooltip(width: number, height: number) {
		if (this._hoveredIndex === null || this._tooltipOpacity < 0.01) return;

		const ctx = this._ctx;
		const alpha = this._tooltipOpacity;

		const total = this.operations()[this._hoveredIndex]?.operationsCount ?? 0;
		const finished = this.showFinanced() ? (this.operationsFinanced()[this._hoveredIndex]?.operationsCount ?? 0) : null;

		const values = [
			{ label: 'Operaciones', value: total, color: getComputedStyle(document.documentElement).getPropertyValue('--primary-facthor') },
			...(this.showFinanced()
				? [{ label: 'Financiadas', value: finished!, color: getComputedStyle(document.documentElement).getPropertyValue('--primary') }]
				: []),
		];

		ctx.save();
		ctx.globalAlpha = alpha;

		ctx.beginPath();
		ctx.moveTo(this._tooltipX, 20);
		ctx.lineTo(this._tooltipX, height - 80);
		ctx.strokeStyle = '#999';
		ctx.setLineDash([4, 4]);
		ctx.stroke();
		ctx.setLineDash([]);

		const tooltipWidth = 120;
		const tooltipHeight = values.length * 16 + 12;

		let boxX = this._tooltipX + 10;
		if (boxX + tooltipWidth > width) boxX = width - tooltipWidth - 10;
		if (boxX < 0) boxX = 0;

		let boxY = this._tooltipY;
		if (boxY + tooltipHeight > height - 10) boxY = height - tooltipHeight - 10;
		if (boxY < 0) boxY = 0;

		ctx.fillStyle = '#fff';
		ctx.strokeStyle = '#ccc';
		ctx.lineWidth = 1;
		ctx.fillRect(boxX, boxY, tooltipWidth, tooltipHeight);
		ctx.strokeRect(boxX, boxY, tooltipWidth, tooltipHeight);

		ctx.font = '12px nunito';
		values.forEach((item, i) => {
			ctx.fillStyle = item.color;
			ctx.fillRect(boxX + 5, boxY + 12 + i * 16, 6, 6);
			ctx.fillStyle = '#333';
			ctx.fillText(`${item.label}: ${item.value}`, boxX + 15, boxY + 18 + i * 16);
		});
		ctx.restore();
	}
}
