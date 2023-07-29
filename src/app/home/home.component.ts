import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MessageBoxService } from '../shared/components/message-box/message-box.service';
import { AbstractComponent } from '../core/abstract.component';
import { SystemService } from '../core/system.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @ViewChild('container') slideContainer: ElementRef;
    isEndObservable = new BehaviorSubject<boolean>(false);

    slideContainerDOM: HTMLElement;
    actualSlide: HTMLElement;
    actualSlideNumber;
    childByNumber: Array<HTMLElement> = [];
    isEnd = false;
    isBegin = true;
    public isFullscreen = false;
    public listenerBound = false;

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
    }
    public ngAfterViewInit(): void {
        this.slideContainerDOM = this.slideContainer.nativeElement;
        this.slideContainerDOM.childNodes.forEach((child) => {
            this.childByNumber.push(child as HTMLElement);
        });
        this.actualSlideNumber = 0;
        this.actualSlide = this.childByNumber[this.actualSlideNumber];
        this.actualSlide.setAttribute('data', 'active');
    }

    public eventNextSlide(): void {
        if (this.actualSlideNumber === 0) {
            this.isBegin = false;
        }

        this.actualSlide.setAttribute('data', 'inactive');
        this.actualSlideNumber += 1;

        if (this.actualSlideNumber > this.childByNumber.length - 2) {
            this.isEnd = true;
        }

        this.actualSlide = this.childByNumber[this.actualSlideNumber];
        this.actualSlide.setAttribute('data', 'active');
    }

    public eventPreviousSlide(): void {
        this.actualSlide.setAttribute('data', 'inactive');

        if (this.isEnd) {
            this.isEnd = false;
        }
        this.actualSlideNumber -= 1;

        if (this.actualSlideNumber === 0) {
            this.isBegin = true;
        }
        this.actualSlide = this.childByNumber[this.actualSlideNumber];
        this.actualSlide.setAttribute('data', 'active');
    }
    public eventFullScreen(): void {
        this.slideContainerDOM.parentElement.requestFullscreen();

        if (!this.listenerBound) {
            document.addEventListener('fullscreenchange', (event) => {
                if (!this.isFullscreen) {
                    this.slideContainerDOM.className += ' ui-slide-container-fullscreen';
                    this.isFullscreen = true;
                } else {
                    this.isFullscreen = false;
                    this.slideContainerDOM.className = this.slideContainerDOM.className.replace(' ui-slide-container-fullscreen', '');
                }
            }, false);
        }
    }
}
