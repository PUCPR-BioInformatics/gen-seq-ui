import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MessageBoxService } from '../shared/components/message-box/message-box.service';
import { AbstractComponent } from '../core/abstract.component';
import { SystemService } from '../core/system.service';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent extends AbstractComponent implements OnInit {
    public message: string;
    public boldMessage: string;
    public subTitle: string;
    public title: string;
    public icon: string;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService,
        private router: ActivatedRoute
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.title = 'Erro ao acessar rota';
        const code = this.router.snapshot.fragment;
        if (!code) {
            this.boldMessage = 'Rota não encontrada';
            this.icon = 'fas fa-plane-slash';
            this.subTitle = 'Rota não existe';
            this.message = 'Onde está todo mundo?';
        } else if (code === '403') {
            this.boldMessage = 'Sem permissão de acesso';
            this.icon = 'fas fa-lock';
            this.message = 'Os seus perfis não permitem acesso a este módulo.';
            this.subTitle = 'Você não pode acessar está rota';
        }
    }
}
