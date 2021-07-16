import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { UserModalComponent } from './user-modal.component';
import { UiAbstractSystemService } from '../core/ui-abstract-system.service';
import { UiMessageBoxModule } from '../shared/components/message-box/ui-message-box.module';
import { UiSharedModule } from '../shared/components/ui-shared.module';

const providers: Array<any> = [
    { provide: UiAbstractSystemService, useClass: UiAbstractSystemService },
    { provide: UiAbstractSystemService, useClass: UiAbstractSystemService },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
];

describe('UserModalComponent', () => {
    // let component: UserModalComponent;
    let fixture: ComponentFixture<UserModalComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                UiMessageBoxModule,
                RouterTestingModule,
                UiSharedModule
            ],
            declarations: [
                UserModalComponent
            ],
            providers
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(UserModalComponent);
        // component = fixture.componentInstance;
        fixture.detectChanges();
    });
    // it('Verifica se o componente foi criado', () => {
    //     expect(component).toBeTruthy();
    // });
});
