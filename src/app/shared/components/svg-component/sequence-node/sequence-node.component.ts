import {
    Component,
    Input,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    HostBinding,
    OnInit
} from '@angular/core';

import { Subscription } from 'rxjs';

import * as d3 from 'd3';

import { SystemService } from '../../../../core/system.service';
import { SvgHelper } from '../../../helper/svg.helper';
import { SequenceNodeModel } from './model/sequence-node.model';

@Component({
    selector: 'app-sequence-node',
    templateUrl: './sequence-node.component.html',
    styleUrls: ['./sequence-node.component.scss']
})
export class SequenceNodeComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding('class') public classes = 'ui-themed-container';

    @Input() public type: 'gauge';
    @Input() public data: Array<SequenceNodeModel>;

    private subscriptions$: Subscription = new Subscription();
    public hash = '-' + Math.floor(Math.random() * 2000) + new Date().getTime();
    protected viewer: HTMLElement;
    protected svg: SVGElement;
    protected circleGroup: SVGGElement;
    protected pathGroup: SVGGElement;

    constructor(
        private systemService: SystemService,
        private elementRef: ElementRef
    ) {}

    public ngAfterViewInit(): void {
        this.initialize();
    }
    public ngOnInit(): void {
        this.watchTheme();
    }

    public ngOnDestroy(): void {
        this.subscriptions$.unsubscribe();
    }

    public initialize(): void {
        this.viewer = (this.elementRef.nativeElement as HTMLElement) as HTMLElement;

        this.svg = SvgHelper.buildSvg(d3.select(this.viewer), {
            class: 'ui-sequence-node-svg',
            width: '100%',
            height: '100%'
        });
        this.circleGroup = SvgHelper.buildGroup(this.svg);
        this.pathGroup = SvgHelper.buildGroup(this.svg);
        this.buildElements();
    }

    private buildElements(): void {
        this.data.forEach((sequenceNode: SequenceNodeModel, index: number) => {
            SvgHelper.buildCircle(this.circleGroup, {
                r: 40,
                fill: sequenceNode.color,
                cy: 50,
                cx: (index > 0) ? (150 * index) + 60 : 60
            });
        });
    }
    private watchTheme(): void {
        this.subscriptions$.add(this.systemService.watchTheme().subscribe(
            (theme: string) => {
                this.classes = 'ui-themed-container ' + theme;
            }
        ));
    }
}
