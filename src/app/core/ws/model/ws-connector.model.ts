import { WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Subscription } from 'rxjs';

import { WsConnectionStateEnum } from '../enum/ws-connection-state.enum';

export interface WsConnectorModel {
    state$: BehaviorSubject<WsConnectionStateEnum>;
    connection$: WebSocketSubject<any>;
    heartBeatSubscription$: Subscription;
    api: string;
    apiPath: string;
}
