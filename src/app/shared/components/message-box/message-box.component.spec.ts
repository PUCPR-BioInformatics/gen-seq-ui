import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MessageBoxComponent } from './message-box.component';
import { MessageBoxModule } from './message-box.module';

describe('MessageBoxComponent', () => {
    // let component: MessageBoxComponent;
    let fixture: ComponentFixture<MessageBoxComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MessageBoxModule
            ],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {}
                }, {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessageBoxComponent);
        // component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it ('should create the app', () => {
    //     fixture = TestBed.createComponent(MessageBoxComponent);
    //     component = fixture.componentInstance;
    //     expect(component).toBeTruthy();
    // });

    // afterEach(() => {
    //     fixture.destroy();
    // });
});
