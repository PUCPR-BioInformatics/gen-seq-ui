import {
    Component,
    Input,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    HostBinding,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { delay, distinctUntilChanged, filter } from 'rxjs/operators';

import { GenericChart } from './chart-types/generic-chart';
import { GaugeChart } from './chart-types/gauge/gauge-chart';
import { ChartDataModel } from './model/chart-data.model';
import { SystemService } from '../../../core/system.service';
import { ApplicationException } from '../../../core/exception/application.exception';
import { JsonHelper } from '../../helper/json.helper';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @HostBinding('class') public classes = 'ui-themed-container';

    @Input() public type: 'gauge';
    @Input() public data: ChartDataModel | BehaviorSubject<ChartDataModel>;

    private dataObservable$: BehaviorSubject<ChartDataModel> = new BehaviorSubject(undefined);
    private subscriptions$: Subscription = new Subscription();

    public chart: GenericChart;
    public currentData: ChartDataModel
    public hash = '-' + Math.floor(Math.random() * 2000) + new Date().getTime();

    public types: any = {
        gauge: GaugeChart
    };

    constructor(
        private systemService: SystemService,
        private elementRef: ElementRef
    ) {}

    public ngAfterViewInit(): void {
        if (this.data instanceof BehaviorSubject) {
            this.dataObservable$ = this.data;
        }
        this.initialize();
    }
    public ngOnInit(): void {
        this.watchTheme();
    }
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.data && !(changes.data.currentValue instanceof BehaviorSubject)) {
            this.dataObservable$.next(changes.data.currentValue);
        }
    }
    public ngOnDestroy(): void {
        const chartTooltip = document.getElementById('ui-chart-tooltip' + this.hash);

        if (chartTooltip) {
            chartTooltip.remove();
        }

        this.subscriptions$.unsubscribe();
    }

    public eventCleanTooltip(): void {
        if (this.chart) {
            this.chart.hideTooltip();
        }
    }
    public initialize(): void {
        const viewer = (this.elementRef.nativeElement as HTMLElement).getElementsByClassName('ui-chart-graph').item(0) as HTMLElement;
        this.subscriptions$.add(this.dataObservable$.pipe(
            delay(10),
            filter((data) => data !== undefined),
            distinctUntilChanged((newValues, oldValues) => {
                return JsonHelper.compare(newValues, oldValues);
            })
        ).subscribe((data: ChartDataModel) => {
            this.currentData = data;
            this.chart = new (this.types[this.type])();
            this.chart.initialize(viewer, data, this.hash);
        }));
    }
    private validateInitialization(): void {
        if (!this.data && !this.dataObservable$.getValue()) {
            throw new ApplicationException('Erro ao carregar gráfico', 'Chart data indefinido.');
        } else if (!this.type) {
            throw new ApplicationException('Erro ao carregar gráfico', 'Você deve informar o tipo de gráfico.');
        }
    }
    private watchTheme(): void {
        this.subscriptions$.add(this.systemService.watchTheme().subscribe(
            (theme: string) => {
                this.classes = 'ui-themed-container ' + theme;
            }
        ));
    }
}
