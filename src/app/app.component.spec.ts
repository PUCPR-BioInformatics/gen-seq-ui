import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { SystemService } from './core/system.service';
import { SystemServiceMockSpec } from './shared/mock/system.service.mock.spec';
import { UiUserService } from './user/user.service';
import { UiUserServiceMockSpec } from './shared/mock/user.service.mock.spec';

describe('AppComponent', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                {
                    provide: SystemService,
                    useClass: SystemServiceMockSpec
                }, {
                    provide: UiUserService,
                    useClass: UiUserServiceMockSpec
                }
            ]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
