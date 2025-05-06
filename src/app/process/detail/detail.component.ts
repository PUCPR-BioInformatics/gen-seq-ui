import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, interval } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';

import { AbstractComponent } from '../../core/abstract.component';
import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { ProcessService } from '../process.service';
import { ProcessModel } from '../shared/model/process.model';
import { ChartDataModel } from '../../shared/components/svg-component/chart/model/chart-data.model';
import { ChartHelper } from '../../shared/helper/chart.helper';
import { CommandModel } from './model/command.model';
import { CommandExecutionStatusEnum } from '../shared/enum/command-execution-status.enum';
import { ProcessStates } from '../process.states';
import { CommandDetailComponent } from './command-detail/command-detail.component';
import { STEP_STYLE } from '../shared/const/step-styling.const';
import { ProcessStatusEnum } from '../shared/enum/process-status-enum';
import { ResourceModel } from './model/resources.model';
import { OutputResourceModel } from './model/output-resource.model';
import { SequenceNodeModel } from '../../shared/components/svg-component/sequence-node/model/sequence-node.model';
import { NumberFormatHelper } from '../../shared/helper/number-format.pipe';
import { ProcessStepEnum } from '../shared/enum/process-step-enum';
import { BarGraphBuilder } from './builder/bar-graph.builder';
import { SpiderGraphBuilder } from './builder/spider-graph.builder';
import { PointGraphBuilder } from './builder/point-graph.builder';
import { HorizontalBarGraphBuilder } from './builder/horizontal-bar-graph.builder';

declare let Plotly: any;
@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends AbstractComponent implements AfterViewInit {
    @ViewChild('graphContainer', { read: ElementRef }) graphContainer: ElementRef<HTMLDivElement>;
    @ViewChild('graphContainerDNASpider', { read: ElementRef }) spiderDNAGraphContainer: ElementRef<HTMLDivElement>;
    @ViewChild('graphContainerRNASpider', { read: ElementRef }) spiderRNAGraphContainer: ElementRef<HTMLDivElement>;
    @ViewChild('pointsContainer', { read: ElementRef }) pointsContainer: ElementRef<HTMLDivElement>;
    @ViewChild('graphContainerDNAXRNASpider', { read: ElementRef }) graphContainerDNAXRNASpider: ElementRef<HTMLDivElement>;
    @ViewChild('graphContainerChangesSpider', { read: ElementRef }) graphContainerChangesSpider: ElementRef<HTMLDivElement>;

    public TIMER$ = interval(2000).pipe(startWith(0));
    public commands: Array<CommandModel>;
    public resources: Array<ResourceModel>;
    public dnaResources: Array<ResourceModel>;
    public rnaResources: Array<ResourceModel>;
    public process: ProcessModel;
    public processData$: BehaviorSubject<ChartDataModel> = new BehaviorSubject(undefined) ;
    public completenessText: string;
    public title: string;
    public subTitle: string;
    public lastUpdate = new Date();
    public analysedCommand: CommandModel;

    constructor(
        public systemService: SystemService,
        public dialog: MatDialog,
        public messageBoxService: MessageBoxService,
        public genesisService: ProcessService,
        public router: Router,
        public route: ActivatedRoute
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
    }
    public ngAfterViewInit(): void {
        this.initialize();
    }

    public buildGenesisChartData(): void {
        const { total, executed } = this.collectTotalAndExecutedCommands();
        const completeness = parseFloat(((executed/total) * 100).toFixed(0));
        this.completenessText = isNaN(completeness) ? 'No Data' : completeness + '%';
        const completenessTooltip = ChartHelper.buildTooltip('Executed ' + this.completenessText, 'ui-chart-tooltip');
        const executedTooltip = ChartHelper.buildTooltip('Executed ' + this.completenessText, 'ui-chart-tooltip');
        const plots = [
            ChartHelper.buildGaugeGenericPlotDataModel(
                total, 0, 1, 120, 124,
                'ui-chart-gauge-meter-default',
                completenessTooltip
            )
        ];
        let cssClass;
        if (this.process.completedDate ) {
          cssClass = (this.process.result.status === ProcessStatusEnum.FAIL) ?
              ['ui-linear-gradient-error-initial', 'ui-linear-gradient-error-endless'] :
              ['ui-linear-gradient-default-initial', 'ui-linear-gradient-default-endless'];
        } else {
            cssClass = ['ui-linear-gradient-default-initial', 'ui-linear-gradient-default-endless'];
        }

        const effect = ChartHelper.buildGradientEffect(
            'gradient-execution-' + new Date().getTime() + this.process._id,
            { class: cssClass[0], offset: '0%' },
            { class: cssClass[1], offset: '100%'},
            ['stroke', 'fill']
        );
        const executionPloCssClass = (this.process.completedDate) ? 'ui-chart-gauge-meter-path': 'ui-chart-gauge-meter-path ui-chart-gauge-pulse';
        plots.push(
            ChartHelper.buildGaugeGenericPlotDataModel(
                total, 0, (completeness / 100) ,
                120, 124, executionPloCssClass,
                executedTooltip,
                [effect]
            )
        );

        this.processData$.next({
            tooltip: completenessTooltip,
            informations: {
                progress: ChartHelper.buildContextInformation('', 0, 10)
            },
            size: {
                width: 250,
                height: 300
            },
            plots
        } as ChartDataModel);
    }
    protected collectTotalAndExecutedCommands(): { total: number; executed: number; } {
        let total = 0;
        let executed = 0;

        this.commands.forEach((command) => {
            if (!command.isHistorical) {
                total++;
                if (command.status === CommandExecutionStatusEnum.SUCCESS ||
                    command.status === CommandExecutionStatusEnum.FAIL) {
                    executed++;
                }
            }
        })

        return { total, executed };
    }
    public eventCancelGenesisProcess(): void {
        this.loadingState('Canceling process...');
        this.genesisService.cancelProcess(this.process).subscribe(
            (genesisProcess: ProcessModel) => {
                this.process = genesisProcess;
                this.loadingStateDone();
            }, (error: HttpErrorResponse) => {
                this.openErrorMessageBox(error);
                this.loadingStateDone();
            }
        );
    }
    public eventDuplicateExecution(): void {
        this.router.navigate([ProcessStates.creation.path], {
            queryParams: {
                from: this.process._id
            }
        });
    }
    public eventNewExecution(): void {
        this.router.navigate([ProcessStates.creation.path ]);
    }
    public eventGenesisSummary(): void {
        this.router.navigate(['../../'], {
            relativeTo: this.route
        });
    }
    public eventExecutionDetail(execution: CommandModel): void {
        this.dialog.open(CommandDetailComponent, {
            data: {
                execution,
                process: this.process
            },
            maxWidth: '90vw',
            maxHeight: '90vh'
        })
    }
    public eventRetryStep(command: CommandModel, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        if (command.result) {
            command.result.detail = null;
            command.result.description = null;
        }
        command.endDate = null;
        command.status = CommandExecutionStatusEnum.EXECUTING;

        this.subscriptions$.add(this.genesisService.retryProcess(this.process._id, command.step).subscribe(
            (updatedProcess: ProcessModel) => {
                this.handleProcess(updatedProcess);
            }, (error) => {
                this.openErrorMessageBox(error);
            }
        ));
    }
    public getCssClass(execution: CommandModel): string {
        let cssClass = 'ui-process-command ';

        if (!execution.startDate) {
            cssClass += 'ui-process-command-waiting';
        } else if (!execution.endDate) {
            cssClass += 'ui-process-command-executing';
        } else if (execution.status === CommandExecutionStatusEnum.FAIL) {
            cssClass += 'ui-process-command-fail';
        } else if (execution.status === CommandExecutionStatusEnum.SUCCESS) {
            cssClass += 'ui-process-command-done';
        } else if (execution.status === CommandExecutionStatusEnum.SKIPPED) {
            cssClass += 'ui-process-command-skipped';
        } else {
            console.warn(`Status não conhecido ${execution.status}`);
        }

        return cssClass;
    }
    public getCommandsNodes(): Array<SequenceNodeModel> {
        return this.commands.map((command: CommandModel, index: number) => {
           return {
               uid: command._id,
               title: command.step,
               subTitle: command.status,
               color: 'blue',
               isCompleted: command.status === CommandExecutionStatusEnum.SUCCESS,
               previousCommand: (index > 0) ? this.commands[index - 1]._id : null
           };
        });
    }
    public getStepIcon(step: string): string {
        return STEP_STYLE[step].icon;
    }
    public getExecutionStatus(command: CommandModel): string {
        if (!command.startDate) {
            return 'Waiting';
        } else if (!command.endDate) {
            return 'Executing';
        } else if (command.status === CommandExecutionStatusEnum.SKIPPED) {
            return 'Skipped';
        } else {
            return (command.status === CommandExecutionStatusEnum.FAIL) ? 'Failed' : 'Completed';
        }
    }
    public getFileOutputOnly(resource: ResourceModel): Array<OutputResourceModel> {
        return resource.outputResources.filter((output) => output.type === 'file');
    }
    public getFileNameOnly(output: OutputResourceModel): string {
        const allBars = (output.value as string).split('/');
        return allBars[allBars.length - 1];
    }
    public getFileExtension(output: OutputResourceModel): string {
        const allBars = (output.value as string).split('/');
        return allBars[allBars.length - 1].split('.')[1];
    }
    public getFileLinesCount(sourceOutput: OutputResourceModel, outputs: Array<OutputResourceModel>): string {
        const found = outputs.find((output) => output.name === sourceOutput.name + 'Size');
        return found ? 'Lines Count ' + NumberFormatHelper.transform(found.value as number) : 'No Lines Count';
    }
    private initialize(): void {
        this.title = 'Buscando a execução';
        this.subTitle = 'Aguarde';

        this.watchGenesisProcess();
    }
    private handleProcess(genesisProcess: ProcessModel): void {
        if (JSON.stringify(genesisProcess) !== JSON.stringify(this.process)) {
            this.process = genesisProcess;
            this.title = 'Execution Detail';
            this.subTitle = this.process._id;
            this.lastUpdate = new Date();
            this.buildGenesisChartData();
        }
    }
    private handleResources(resources: Array<ResourceModel>): void {
        if (JSON.stringify(resources) !== JSON.stringify(this.resources)) {
            // todo filter to command id active and not all
            this.dnaResources = resources.filter((resource) => resource.step.includes('DNA'));
            this.rnaResources = resources.filter((resource) => resource.step.includes('RNA'));
            this.resources = resources;
        }
    }
    protected handleCommands(): void {
        this.analysedCommand = this.commands.find((command) => command.step === ProcessStepEnum.ANALYSING);
        const result = this.analysedCommand.result;
        const metadata = result?.metadata;

        if (!result || !metadata) {
            return;
        }

        BarGraphBuilder.build(this.graphContainer.nativeElement, metadata);
        SpiderGraphBuilder.build(this.spiderDNAGraphContainer.nativeElement, metadata.dna, 'DNA');
        SpiderGraphBuilder.build(this.spiderRNAGraphContainer.nativeElement, metadata.rna, 'RNA');
        SpiderGraphBuilder.buildMultiple(
            this.graphContainerDNAXRNASpider.nativeElement, [metadata.dna, metadata.rna],
            ['DNA', 'RNA'],
            ['#5760ce', '#0062fa']
        )
        HorizontalBarGraphBuilder.build(this.graphContainerChangesSpider.nativeElement, result);
    }
    @HostListener('window:resize')
    public eventResize(): void {
        Plotly.Plots.resize(this.graphContainer.nativeElement);
    }
    public trackByCommandId(index: number, command: CommandModel): string {
        return command._id;
    }
    private watchGenesisProcess(): void {
        this.subscriptions$.add(
            this.TIMER$.pipe(
                filter(() => !this.process || this.process.completedDate === null),
                switchMap(() => {
                    return combineLatest([
                        this.genesisService.getProcessById(this.route.snapshot.params.id),
                        this.genesisService.getCommandsByProcessId(this.route.snapshot.params.id),
                        this.genesisService.getResourcesByProcessId(this.route.snapshot.params.id)
                    ])
                })
            ).subscribe(
                (result: [ProcessModel, Array<CommandModel>, Array<ResourceModel>]) => {
                    this.commands = result[1];
                    this.handleProcess(result[0]);
                    this.handleResources(result[2]);
                    setTimeout(() => {
                        this.handleCommands();
                    }, 50)
                },
                (error: HttpErrorResponse) => {
                    this.openErrorMessageBox(error);
                }
            )
        );
    }
}
