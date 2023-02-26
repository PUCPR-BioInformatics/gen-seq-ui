import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationModel } from '../shared/model/pagination.model';
import { Observable } from 'rxjs';
import { ProcessPaginatedModel } from './shared/model/process-paginated.model';
import { SystemService } from '../core/system.service';
import { ProcessModel } from './shared/model/process.model';
import { GeneomeReferenceModel } from './shared/model/geneome-reference.model';
import { AlignmentToolModel } from './shared/model/alignment-tool.model';
import { ProcessStepEnum } from './shared/enum/process-step-enum';
import { CommandExecutionModel } from './shared/model/command-execution.model';

@Injectable({
    providedIn: 'root'
})
export class GenesisProcessService {
    constructor(
        private systemService: SystemService,
        private http: HttpClient
    ) { }

    public cancelProcess(genesisProcess: ProcessModel): Observable<ProcessModel> {
        return this.http.delete<ProcessModel>(this.systemService.getApiPath('gen-seq-api') + 'orchestrator/process/' + genesisProcess._id);
    }
    public createProcess(genesisProcess: ProcessModel): Observable<ProcessModel> {
        return this.http.post<ProcessModel>(this.systemService.getApiPath('gen-seq-api') + 'orchestrator/process', genesisProcess);
    }
    public getAlignmentTools(): Observable<Array<AlignmentToolModel>> {
        const url = this.systemService.getApiPath('gen-seq-api') + 'resources/alignment/tools';
        return this.http.get<Array<AlignmentToolModel>>(url)
    }
    public getGenomeReferences(): Observable<Array<GeneomeReferenceModel>> {
        const url = this.systemService.getApiPath('gen-seq-api') + 'resources/genome/references';
        return this.http.get<Array<GeneomeReferenceModel>>(url)
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

        return this.http.get<ProcessPaginatedModel>(this.systemService.getApiPath('gen-seq-api') + 'orchestrator/process' + queryParamUrl);
    }
    public getCommandsByProcessId(processId): Observable<Array<CommandExecutionModel>> {
        return this.http.get<Array<CommandExecutionModel>>(this.systemService.getApiPath('gen-seq-api') + 'orchestrator/command/' + processId);
    }
    public getProcessById(processId: string): Observable<ProcessModel> {
        return this.http.get<ProcessModel>(this.systemService.getApiPath('gen-seq-api') + 'orchestrator/process/' + processId);
    }
    public retryProcess(processId: string, step: ProcessStepEnum): Observable<ProcessModel> {
        const retry = {
            processId,
            step
        };
        return this.http.put<ProcessModel>(this.systemService.getApiPath('gen-seq-api') + 'orchestrator/process/' + processId + '/retry', retry);
    }
}
