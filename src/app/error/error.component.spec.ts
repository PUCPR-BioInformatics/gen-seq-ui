import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ErrorComponent } from './error.component';
import { UiSharedModule } from '../shared/components/ui-shared.module';
import { UiSystemServiceMockSpec } from '../shared/mock/ui-system.service.mock.spec';
import { MessageBoxModule } from '../shared/components/message-box/message-box.module';
import { UiAbstractSystemService } from '../core/ui-abstract-system.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

describe('ErrorComponent', () => {
    let component: ErrorComponent;
    let fixture: ComponentFixture<ErrorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                MessageBoxModule,
                UiSharedModule,
                RouterTestingModule
            ],
            declarations: [
                ErrorComponent
            ],
            providers: [
                {
                    provide: UiAbstractSystemService,
                    useClass: UiSystemServiceMockSpec
                },
                {
                    provide: MatDialogRef,
                    useValue: {}
                }, {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}
                }, {
                    provide: MatDialog,
                    useValue: {}
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it ('should create the app', () => {
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    afterEach(() => {
        fixture.destroy();
    });
});
