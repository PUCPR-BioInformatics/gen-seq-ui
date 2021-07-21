import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SystemService } from '../../../core/system.service';
import { MessageBoxService } from '../message-box/message-box.service';
import { AbstractComponent } from '../../../core/abstract.component';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent extends AbstractComponent {
    @Input() type: 'more' | 'paginated' = 'paginated';
    @Input() page: number;
    @Input() processing: boolean;
    @Input() limit: number;
    @Input() limits = [5, 10, 15, 20, 50];
    @Input() size: number;

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() limitChange: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService
    ) {
        super(systemService, messageBoxService);
    }

    public eventPageChange(page: number): void {
        this.page = page;
        this.pageChange.emit(this.page);
    }
    public eventLoadMoreNotifications(): void {
        this.eventPageChange(this.page + 1);
    }
    public eventLimitChange(limit: string | number): void {
        this.limit = (typeof limit === 'string') ? parseInt(limit as string, 10) : limit;
        this.page = 1;
        this.limitChange.emit(this.limit);
    }
    public getActualFirstItemIndex(): number {
        return (this.page - 1) * this.limit + 1;
    }
    public getActualLastItemIndex(): number {
        return (this.page * this.limit < this.size) ?
            this.page * this.limit :
            this.size;
    }
}
