import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { v4 as uuidv4 } from 'uuid';
import { WsConnectorModel } from '../model/ws-connector.model';
import { SystemService } from '../../system.service';
import { WsConnectorProvider } from '../provider/ws-connector.service';
import { WsMessageModel } from '../model/ws-message.model';
import { WsConnectionStateEnum } from '../enum/ws-connection-state.enum';
import { ApplicationException } from '../../exception/application.exception';


export abstract class AbstractWsService {
    wsConnector: WsConnectorModel = null;

    constructor(
        protected systemService: SystemService,
        protected wsConnectorProvider: WsConnectorProvider
    ) {
        this.connect();
    }

    protected connect(): void {
        this.wsConnector = this.wsConnectorProvider.getWsConnector(this.getWsPath());
    }
    protected abstract getWsPath(): string;
    protected sendRequest<T>(wsRequest: WsMessageModel<any>): Observable<T> {
        wsRequest.uuid = uuidv4();
        return new Observable<T>((observer) => {
            this.wsConnector.state$.pipe(
                filter((state: WsConnectionStateEnum) => state === WsConnectionStateEnum.CONNECTED),
                take(1)
            ).subscribe(
                () => {
                    this.wsConnector.connection$.next(wsRequest);
                    this.wsConnector.connection$.pipe(
                        filter((wsResponse: WsMessageModel<T>) => wsResponse.uuid === wsRequest.uuid),
                        take(1)
                    ).subscribe(
                        (wsResponse: WsMessageModel<T>) => {
                            if (wsResponse.code !== 200) {
                                console.log(wsResponse)
                                const body = wsResponse.body as any;
                                observer.error(
                                    new ApplicationException(body.detail, body.description, wsResponse.code)
                                );
                            }
                            observer.next(wsResponse.body);
                            observer.complete()
                        }
                    );
                }
            );
        }).pipe(take(1));
    }
}
