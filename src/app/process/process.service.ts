import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PaginationModel } from '../shared/model/pagination.model';
import { ProcessPaginatedModel } from './shared/model/process-paginated.model';
import { SystemService } from '../core/system.service';
import { ProcessModel } from './shared/model/process.model';
import { GeneomeReferenceModel } from './shared/model/geneome-reference.model';
import { AlignmentToolModel } from './shared/model/alignment-tool.model';
import { ProcessStepEnum } from './shared/enum/process-step-enum';
import { CommandModel } from './shared/model/command.model';
import { WsConnectorProvider } from '../core/ws/provider/ws-connector.service';
import { AbstractWsService } from '../core/ws/service/abstract-ws-service';
import { WsMessageModel } from '../core/ws/model/ws-message.model';

@Injectable({
    providedIn: 'root'
})
export class ProcessService extends AbstractWsService {
    constructor(
        protected systemService: SystemService,
        protected wsConnectorProvider: WsConnectorProvider
    ) {
        super(systemService, wsConnectorProvider);
    }

    protected getWsPath(): string {
        return 'genSeqWs';
    }

    public cancelProcess(genesisProcess: ProcessModel): Observable<ProcessModel> {
        return this.sendRequest<ProcessModel>(new WsMessageModel({
            name: 'orchestrator-process-delete',
            version: '1.0',
            body: genesisProcess
        }));
    }
    public createProcess(genesisProcess: ProcessModel): Observable<ProcessModel> {
        return this.sendRequest<ProcessModel>(new WsMessageModel({
            name: 'orchestrator-process-create',
            version: '1.0',
            body: genesisProcess
        }));
    }
    public getAlignmentTools(): Observable<Array<AlignmentToolModel>> {
        return this.sendRequest<Array<AlignmentToolModel>>(new WsMessageModel({
            name: 'alignment-tools-search',
            version: '1.0',
            body: null
        }));
    }
    public getGenomeReferences(): Observable<Array<GeneomeReferenceModel>> {
        return this.sendRequest<Array<GeneomeReferenceModel>>(new WsMessageModel({
            name: 'genome-references-search',
            version: '1.0',
            body: null
        }));
    }
    public getProcess(filter: any = {}, pagination?: PaginationModel, sort?: any): Observable<ProcessPaginatedModel> {
        const queryParam = new URLSearchParams(filter);

        if (pagination) {
            queryParam.append('limit', pagination.limit.toString())
            queryParam.append('page', pagination.page.toString())
        }
        if (sort) {
            queryParam.append('sort', sort);
        } else {
            queryParam.append('sort', 'creationDate,-1');
        }

        const queryParamUrl = (queryParam.toString() !== '') ? '?' + queryParam.toString() : ''

        return this.sendRequest<ProcessPaginatedModel>(new WsMessageModel({
            name: 'orchestrator-process-search',
            version: '1.0',
            body: queryParamUrl
        }));
    }
    public getCommandsByProcessId(processId): Observable<Array<CommandModel>> {
        return this.sendRequest<Array<CommandModel>>(new WsMessageModel({
            name: 'orchestrator-process-commands',
            version: '1.0',
            body: processId
        }));
    }
    public getProcessById(processId: string): Observable<ProcessModel> {
        return this.sendRequest<ProcessModel>(new WsMessageModel({
            name: 'orchestrator-process',
            version: '1.0',
            body: processId
        }));
    }
    public retryProcess(processId: string, step: ProcessStepEnum): Observable<ProcessModel> {
        const retry = {
            processId,
            step
        };
        return this.sendRequest<ProcessModel>(new WsMessageModel({
            name: 'orchestrator-process-retry',
            version: '1.0',
            body: retry
        }));
    }
}
