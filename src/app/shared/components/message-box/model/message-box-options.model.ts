import { HttpErrorResponse } from '@angular/common/http';

import { ApplicationException } from '../../../../core/exception/application.exception';
import { MessageBoxLoaderOptionsModel } from './message-box-loader-options.model';

export interface MessageBoxOptionsModel {
    actualTheme: string;
    description?: string;
    detail?: string;
    disableClose: boolean;
    exception?: HttpErrorResponse | ApplicationException;
    icon?: string;
    iteraction: 'confirm' | 'choice' | 'several' | 'none';
    link?: string;
    linkMessage?: string;
    loaderOptions?: MessageBoxLoaderOptionsModel;
    type: 'loading' | 'normal' | 'error' | 'warning';
}

