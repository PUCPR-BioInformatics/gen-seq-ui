import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, forkJoin, interval } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';

import { AbstractComponent } from '../../core/abstract.component';
import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { GenesisProcessService } from '../genesis-process.service';
import { ProcessModel } from '../shared/model/process.model';
import { ChartDataModel } from '../../shared/components/chart/model/chart-data.model';
import { ChartHelper } from '../../shared/helper/chart.helper';
import { CommandExecutionModel } from '../shared/model/command-execution.model';
import { CommandExecutionStatusEnum } from '../shared/enum/command-execution-status.enum';
import { GenesisStates } from '../genesis.states';
import {
    CommandDetailComponent
} from './command-detail/command-detail.component';
import { ProcessStepEnum } from '../shared/enum/process-step-enum';
import { STEP_STYLE } from '../shared/const/step-styling.const';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends AbstractComponent {

    public TIMER = interval(2000).pipe(startWith(0));
    public commands: Array<CommandExecutionModel>;
    public process: ProcessModel;
    public processData$: BehaviorSubject<ChartDataModel> = new BehaviorSubject(undefined) ;
    public completenessText: string;
    public informations: { [key: string]: string | number | undefined } = {};
    public title: string;
    public subTitle: string;
    public lastUpdate = new Date();

    constructor(
        public systemService: SystemService,
        public dialog: MatDialog,
        public messageBoxService: MessageBoxService,
        public genesisService: GenesisProcessService,
        public router: Router,
        public route: ActivatedRoute
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
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
        const cssClass = (this.process.completedDate) ? ['ui-linear-gradient-default-initial', 'ui-linear-gradient-default-endless'] :
            ['ui-linear-gradient-success-initial', 'ui-linear-gradient-success-endless'];
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
        this.router.navigate([GenesisStates.creation.path], {
            queryParams: {
                from: this.process._id
            }
        });
    }
    public eventNewExecution(): void {
        this.router.navigate([GenesisStates.creation.path ]);
    }
    public eventGenesisSummary(): void {
        this.router.navigate(['../../'], {
            relativeTo: this.route
        });
    }
    public eventExecutionDetail(execution: CommandExecutionModel): void {
        this.dialog.open(CommandDetailComponent, {
            data: {
                execution,
                process: this.process
            },
            maxWidth: '90vw',
            maxHeight: '90vh'
        })
    }
    public eventRetryStep(step: ProcessStepEnum, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.subscriptions$.add(this.genesisService.retryProcess(this.process._id, step).subscribe(
            (updatedProcess: ProcessModel) => {
                this.handleGenesisProcess(updatedProcess);
            }, (error) => {
                this.openErrorMessageBox(error);
            }
        ));
    }
    public getCssClass(execution: CommandExecutionModel): string {
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
    public getStepIcon(step: string): string {
        return STEP_STYLE[step].icon;
    }
    public getExecutionStatus(command: CommandExecutionModel): string {
        if (!command.startDate) {
            return 'Waiting';
        } else if (!command.endDate) {
            return 'Executing';
        } else {
            return (command.status === CommandExecutionStatusEnum.FAIL) ? 'Failed' : 'Completed';
        }
    }
    private initialize(): void {
        this.title = 'Buscando a execução';
        this.subTitle = 'Aguarde';

        this.watchGenesisProcess();
    }
    private handleGenesisProcess(genesisProcess: ProcessModel): void {
        if (JSON.stringify(genesisProcess) !== JSON.stringify(this.process)) {
            this.process = genesisProcess;
            this.title = 'Execution Detail';
            this.subTitle = this.process._id;
            this.lastUpdate = new Date();
            this.buildGenesisChartData();
        }
    }
    public trackExecutionByStep(index: number, execution: CommandExecutionModel): string {
        return execution.step;
    }
    private watchGenesisProcess(): void {
        this.subscriptions$.add(this.TIMER.pipe(
            filter(() => !this.process || this.process.completedDate === null),
            switchMap(() => {
                return forkJoin([
                    this.genesisService.getProcessById(this.route.snapshot.params.id),
                    this.genesisService.getCommandsByProcessId(this.route.snapshot.params.id)
                ])
            })
        ).subscribe(
            (result: [ProcessModel, Array<CommandExecutionModel>]) => {
                this.commands = result[1];
                this.handleGenesisProcess(result[0]);
            },
            (error: HttpErrorResponse) => {
                this.openErrorMessageBox(error);
            }
        ));
    }
    // protected collectInformations(): void {
    //     const extractedDna = this.getExtractionSizes('dna');
    //     const extractedRna = this.getExtractionSizes('rna');
    //
    //     this.informations.dnaAlignmentSize = this.getAlignmentSize('dna');
    //     this.informations.dnaVariantsSize = extractedDna[0];
    //     this.informations.dnaSnpsSize = extractedDna[1];
    //     this.informations.dnaIndelsSize = extractedDna[2];
    //     this.informations.dnaExecutionTime = this.getExecutionTime('dna');
    //
    //     this.informations.rnaAlignmentSize = this.getAlignmentSize('rna');
    //     this.informations.rnaVariantsSize = extractedRna[0];
    //     this.informations.rnaSnpsSize = extractedRna[1];
    //     this.informations.rnaIndelsSize = extractedRna[2];
    //     this.informations.rnaExecutionTime = this.getExecutionTime('rna');
    // }


    // protected getAlignmentSize(type: 'dna' | 'rna'): number | undefined{
    //     const step = (type === 'dna') ? ProcessStepEnum.ALIGNING_DNA : ProcessStepEnum.ALIGNING_RNA;
    //     const execution = this.commands.find((execution) => execution.step === step);
    //     const parameter = execution.result?.outputParameters.find((parameter) => parameter.name === 'alignmentOutputSize');
    //
    //     return (parameter) ? parseInt(parameter.value as string) : undefined;
    // }
    // protected getExtractionSizes(type: 'dna' | 'rna'): [number | undefined, number | undefined, number | undefined]{
    //     const step = (type === 'dna') ? ProcessStepEnum.EXTRACT_DNA : ProcessStepEnum.EXTRACT_RNA;
    //     const execution = this.commands.find((execution) => execution.step === step);
    //     console.log(this.commands, step)
    //     const parameterVariants = execution.result?.outputParameters.find((parameter) => parameter.name === 'extractedOutputSize');
    //     const parameterSnps = execution.result?.outputParameters.find((parameter) => parameter.name === 'extractedSnpsOutputSize');
    //     const parameterIndels = execution.result?.outputParameters.find((parameter) => parameter.name === 'extractedIndelsOutputSize');
    //
    //     return [
    //         (parameterVariants) ? parseInt(parameterVariants.value as string) - 26 : undefined,
    //         (parameterSnps) ? parseInt(parameterSnps.value as string) - 29 : undefined,
    //         (parameterIndels) ? parseInt(parameterIndels.value as string) - 29 : undefined,
    //     ];
    // }


    // public getExecutionTime(type?: 'dna' | 'rna'): string {
    //     let time = 0;
    //
    //     if (type) {
    //         if (!this.process.completedDate) {
    //             return 'Executando';
    //         }
    //         this.commands.filter((execution) => execution.type === type).forEach((execution) => {
    //             time += new Date(execution.endDate).getTime() - new Date(execution.startDate).getTime()
    //         });
    //     } else {
    //         let initialTime = new Date(this.process.creationDate).getTime();
    //         let finalTime = new Date(this.process.completedDate).getTime();
    //
    //         if (!this.process.completedDate) {
    //             finalTime = new Date().getTime();
    //         }
    //         // if (this.genesisProcess.executionsHistory) {
    //         //     initialTime = new Date(this.genesisProcess.executions[0].startDate).getTime();
    //         // }
    //
    //         time = finalTime - initialTime;
    //     }
    //     const seconds = (time / 1000);
    //     if (seconds < 60) {
    //         return seconds.toFixed(2) + ' segundo(s)';
    //     } else if (seconds < 3600) {
    //         return (seconds / 60).toFixed(2) + ' minuto(s)';
    //     } else {
    //         return (seconds / 60 / 60).toFixed(2) + ' hora(s)';
    //     }
    // }
    // public getFiles(type: 'dna' | 'rna'): Array<CommandResultOutputParameters> {
    //     const parameters = [];
    //     const executions = this.commands.filter((execution) => execution.type === type);
    //
    //     for (const execution of executions) {
    //         for (const parameter of execution.result.outputParameters) {
    //             if (parameter.type === 'file') {
    //                 parameters.push(parameter);
    //             }
    //         }
    //     }
    //     return parameters;
    // }
}
