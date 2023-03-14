import { Injectable } from '@angular/core';

import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { filter, switchMap, take } from 'rxjs/operators';

import { v4 as uuidv4 } from 'uuid';

import { WsConnectionStateEnum } from '../enum/ws-connection-state.enum';
import { WsConnectorModel } from '../model/ws-connector.model';
import { SystemService } from '../../system.service';

@Injectable({
    providedIn: 'root'
})
export class WsConnectorProvider {
    public static HEART_BEAT_INTERVAL = 5000;
    public static HEART_BEAT_CHECK = false;

    protected wsConnectors: {
        [key: string]: WsConnectorModel;
    } = {};

    constructor(
        protected systemService: SystemService
    ) {}

    protected buildWsConnector(api: string, apiPath: string): WsConnectorModel {
        const wsConnector = {
            state$: new BehaviorSubject<WsConnectionStateEnum>(WsConnectionStateEnum.PREPARING),
            connection$: undefined,
            api,
            apiPath
        } as WsConnectorModel;
        return wsConnector;
    }
    protected buildWsConnection(wsConnector: WsConnectorModel): WebSocketSubject<any> {
        console.debug(`Criando conexão com: ${wsConnector.apiPath}`);

        return webSocket({
            url: wsConnector.apiPath,
            closeObserver: {
                next: () => {
                    console.debug(`Conexão com: ${wsConnector.apiPath}, foi encerrada.`);
                    this.closeWsConnection(wsConnector.apiPath);
                    this.getWsConnector(wsConnector.api);
                },
            },
            openObserver: {
                next: () => {
                    console.debug(`Conectado com: ${wsConnector.apiPath}`);
                    wsConnector.state$.next(WsConnectionStateEnum.CONNECTED);
                }
            }
        });
    }
    protected buildWsConnectionHeartBeat(api:string, apiPath: string): Subscription {
        return interval(WsConnectorProvider.HEART_BEAT_INTERVAL).pipe(
            filter(() => {
                const connector = this.wsConnectors[apiPath];
                const state = connector.state$.getValue();
                return !WsConnectorProvider.HEART_BEAT_CHECK && connector && state === WsConnectionStateEnum.CONNECTED;
            }),
            switchMap(() => {
                WsConnectorProvider.HEART_BEAT_CHECK = true;
                const connector = this.wsConnectors[apiPath];
                const uuid = uuidv4();
                connector.connection$.next(this.buildWsConnectionHeartBeatMessage(uuid));
                console.debug(`Enviando HeartBeat ${uuid} para ${api}(${apiPath})`);

                return connector.connection$.pipe(
                    filter((message: any) => message.uuid === uuid),
                    take(1)
                );
            })
        ).subscribe(
            (message: any) => {
                console.debug(`Recebido HeartBeat  ${message.uuid} de ${api}(${apiPath})`);
                WsConnectorProvider.HEART_BEAT_CHECK = false;
            }
        );
    }
    protected buildWsConnectionHeartBeatMessage(uuid: string): any {
        return {
            name: 'heart-beat',
            version: 1.0,
            uuid,
            body: {
                time: new Date().getTime()
            }
        };
    }
    public closeWsConnection(apiPath: string): void {
        const wsConnector = this.wsConnectors[apiPath];
        const connection$ = wsConnector.connection$;

        if (!connection$) {
            return;
        }
        if (!connection$.closed) {
            connection$.complete();
        }
        connection$.unsubscribe();
        delete this.wsConnectors[apiPath].connection$;
        wsConnector.heartBeatSubscription$.unsubscribe();
        wsConnector.state$.next(WsConnectionStateEnum.NOT_CONNECTED);
        return;
    }
    public getWsConnector(api: string): WsConnectorModel {
        const apiPath = this.systemService.getApiPath(api);

        if (!this.wsConnectors[apiPath]) {
            this.wsConnectors[apiPath] = this.buildWsConnector(api, apiPath);
        }

        const wsConnector = this.wsConnectors[apiPath];

        if (this.hasValidWsConnection(wsConnector)) {
            wsConnector.state$.next(WsConnectionStateEnum.WAITING);
            wsConnector.connection$ = this.buildWsConnection(wsConnector);
            wsConnector.connection$.subscribe();
            wsConnector.heartBeatSubscription$ = this.buildWsConnectionHeartBeat(wsConnector.api, wsConnector.apiPath);
        }
        return wsConnector;
    }
    public hasValidWsConnection(wsConnector: WsConnectorModel): boolean {
        const state = wsConnector.state$.getValue();
        return state === WsConnectionStateEnum.PREPARING ||
            state === WsConnectionStateEnum.NOT_CONNECTED;
    }
}
