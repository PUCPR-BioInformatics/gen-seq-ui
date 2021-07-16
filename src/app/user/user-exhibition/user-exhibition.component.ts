import { Component } from '@angular/core';

import { AbstractComponent } from '../../core/abstract.component';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { SystemService } from '../../core/system.service';
import { ThemeModel } from '../../shared/model/theme.model';

@Component({
    selector: 'app-user-exhibition',
    templateUrl: './user-exhibition.component.html',
    styleUrls: ['./user-exhibition.component.scss']
})
export class UserExhibitionComponent extends AbstractComponent {
    public isMobile = false;
    public navBarMode: 'vertical' | 'horizontal' | 'mobile';
    public retraction = false;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService,
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        this.watchNavBarMode();
        this.watchRetraction();
    }

    public eventNavigationMenuChanged(value: boolean): void {
        this.systemService.setNavBarMode((value) ? 'vertical' : 'horizontal');
    }
    public eventRetractionChanged(value: boolean): void {
        this.systemService.setRetraction(value);
    }
    public eventThemeChange(theme: ThemeModel): void {
        this.systemService.setTheme(theme.themeClass);
    }
    public getActualTheme(): string {
        return this.systemService.getTheme();
    }
    public getThemes(): Array<ThemeModel> {
        return this.systemService.getThemes();
    }
    protected watchNavBarMode(): void {
        this.subscriptions$.add(this.systemService.watchNavBarMode().subscribe(
            (mode: 'vertical' | 'horizontal' | 'mobile') => {
                if (mode === 'mobile') {
                    this.isMobile = true;
                } else {
                    this.isMobile = false;
                }
                this.navBarMode = mode;
            }
        ));
    }
    private watchRetraction(): void {
        this.subscriptions$.add(this.systemService.watchRetraction().subscribe(
            (retraction: boolean) => this.retraction = retraction
        ));
    }
}
