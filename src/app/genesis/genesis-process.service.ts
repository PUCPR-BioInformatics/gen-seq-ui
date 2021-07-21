import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationModel } from '../shared/model/pagination.model';
import { Observable } from 'rxjs';
import { GenesisProcessContainerModel } from './shared/model/genesis-process-container.model';
import { SystemService } from '../core/system.service';
import { GenesisProcessModel } from './shared/model/genesis-process.model';
import { GeneomeReferenceModel } from './shared/model/geneome-reference.model';
import { AlignmentToolModel } from './shared/model/alignment-tool.model';

@Injectable({
    providedIn: 'root'
})
export class GenesisProcessService {
    constructor(
        private systemService: SystemService,
        private http: HttpClient
    ) { }

    public createProcess(genesisProcess: GenesisProcessModel): Observable<GenesisProcessModel> {
        return this.http.post<GenesisProcessModel>(this.systemService.getApiPath('gen-seq-api') + 'genesis/process', genesisProcess);
    }
    public getAlignmentTools(): Observable<Array<AlignmentToolModel>> {
        const url = this.systemService.getApiPath('gen-seq-api') + 'genesis/alignment/tools';
        return this.http.get<Array<AlignmentToolModel>>(url)
    }
    public getGenomeReferences(): Observable<Array<GeneomeReferenceModel>> {
        const url = this.systemService.getApiPath('gen-seq-api') + 'genesis/genome/references';
        return this.http.get<Array<GeneomeReferenceModel>>(url)
    }
    public getProcess(filter: any = {}, pagination?: PaginationModel, sort?: any): Observable<GenesisProcessContainerModel> {
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

        return this.http.get<GenesisProcessContainerModel>(this.systemService.getApiPath('gen-seq-api') + 'genesis/process' + queryParamUrl);
    }
    public getProcessById(processId: string): Observable<GenesisProcessModel> {
        return this.http.get<GenesisProcessModel>(this.systemService.getApiPath('gen-seq-api') + 'genesis/process/' + processId);
    }
}
