import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';

@Component({
	selector: 'facthor-logo-animated',
	templateUrl: 'facthor-logo-animated.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacthorLogoAnimated implements AfterViewInit {
	private readonly _elementRef = inject(ElementRef);

	public readonly duration = input(1000);
	public readonly withText = input(false);
	public readonly textColor = input('#FFFFFF');
	public readonly shadowColor = input('#24A185');
	public readonly color = input('#00CC87');

	public ngAfterViewInit(): void {
		this._hiddenSvg();
		this.startAnimation();
	}

	private _hiddenSvg(): void {
		const svg = this._elementRef.nativeElement.querySelector('svg');
		svg.style.opacity = '1';
	}

	private startAnimation(): void {
		const svg = this._elementRef.nativeElement.querySelector('svg');
		const paths = svg.querySelectorAll('path, polygon');

		paths.forEach((path: SVGPathElement | SVGPolygonElement) => {
			this.unDrawPath(path);
			path.style.transition = `fill ${this.duration() * 0.3}ms ease-in-out`;
		});

		paths.forEach((path: SVGPathElement | SVGPolygonElement, index: number) => {
			setTimeout(() => {
				this.drawPath(path).then(() => {
					if (index === paths.length - 1) {
						setTimeout(() => {
							this.reverseAnimation();
						}, 500);
					}
				});
			}, index * 200);
		});
	}

	private drawPath(path: SVGPathElement | SVGPolygonElement): Promise<void> {
		if (typeof window === 'undefined') return new Promise(() => {});
		
		return new Promise((resolve) => {
			if (!path.getAttribute('data-original-fill')) {
				path.setAttribute('data-original-fill', path.getAttribute('fill') || 'currentColor');
			}

			const length = path.getTotalLength();
			path.style.stroke = path.getAttribute('data-original-fill')!;
			path.style.strokeWidth = '2';
			path.style.strokeDasharray = length.toString();
			path.style.strokeDashoffset = length.toString();

			let start: number | null = null;

			const animate = (timestamp: number) => {
				if (!start) start = timestamp;
				const progress = timestamp - start;
				const percent = Math.min(progress / this.duration(), 1);

				path.style.strokeDashoffset = (length - length * percent).toString();

				if (percent < 1) {
					requestAnimationFrame(animate);
				} else {
					path.style.fill = path.getAttribute('data-original-fill')!;
					resolve();
				}
			};

			requestAnimationFrame(animate);
		});
	}

	private reverseAnimation(): void {
		const svg = this._elementRef.nativeElement.querySelector('svg');
		const paths = svg.querySelectorAll('path, polygon');

		Array.from(paths)
			.reverse()
			.forEach((path: any, index: number) => {
				setTimeout(() => {
					this.unDrawPathWithAnimation(path).then(() => {
						if (index === paths.length - 1) {
							setTimeout(() => {
								this.startAnimation();
							}, 500);
						}
					});
				}, index * 200);
			});
	}

	private unDrawPathWithAnimation(path: SVGPathElement | SVGPolygonElement): Promise<void> {
		return new Promise((resolve) => {
			path.style.fill = 'transparent';
			path.style.stroke = path.getAttribute('data-original-fill')!;
			path.style.strokeWidth = '2';

			const length = path.getTotalLength();
			path.style.strokeDasharray = length.toString();
			path.style.strokeDashoffset = '0';

			let start: number | null = null;

			const animate = (timestamp: number) => {
				if (!start) start = timestamp;
				const progress = timestamp - start;
				const percent = Math.min(progress / this.duration(), 1);

				path.style.strokeDashoffset = (length * percent).toString();

				if (percent < 1) {
					requestAnimationFrame(animate);
				} else {
					path.style.stroke = 'none';
					path.style.strokeWidth = '0';
					resolve();
				}
			};

			requestAnimationFrame(animate);
		});
	}

	private unDrawPath(path: SVGPathElement | SVGPolygonElement): void {
		path.style.stroke = 'none';
		path.style.strokeWidth = '0';
		path.style.strokeDasharray = 'none';
		path.style.strokeDashoffset = 'none';
		path.style.fill = 'transparent';
	}
}
