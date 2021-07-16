import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExhibitionComponent } from './user-exhibition.component';

describe('UserExhibitionComponent', () => {
    // let component: UserExhibitionComponent;
    let fixture: ComponentFixture<UserExhibitionComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ UserExhibitionComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserExhibitionComponent);
        // component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
