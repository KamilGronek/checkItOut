import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FuseLoadingBarComponent} from "../../../../../../@fuse/components/loading-bar";
import {RouterOutlet} from "@angular/router";
import {Subject} from "rxjs";
import {LanguagesComponent} from "../../languages/languages.component";

@Component({
  selector: 'app-layout-with-banner',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
    imports: [
        NgForOf,
        NgStyle,
        FuseLoadingBarComponent,
        NgIf,
        RouterOutlet,
        LanguagesComponent
    ],
  templateUrl: './layout-with-banner.component.html',
})
export class LayoutWithBannerComponent implements OnInit, OnDestroy {
    messages = [
        { title: 'Welcome to Check It Out', text: 'Connect with local businesses and start earning through collaborations.' },
        { title: 'Earn Cash or Barter', text: 'Monetize your influence with direct payments or exclusive product exchanges.' },
        { title: 'Find Local Partnerships', text: 'Discover businesses near you looking for influencers to promote their brand.' },
        { title: 'Manage Deals with Ease', text: 'Handle offers, negotiations, and deliverables all in one intuitive platform.' },
        { title: 'Grow Your Reputation', text: 'Showcase your success, gain trust, and attract more business opportunities.' },
        { title: 'Real-Time Performance Tracking', text: 'Analyze engagement, reach, and earnings from your collaborations.' },
        { title: 'Welcome to Check It Out', text: 'Connect with local businesses and start earning through collaborations.' }
    ];

    duplicatedMessages = [...this.messages, this.messages[0]]; // Duplicate the first slide at the end
    currentMessageIndex = 0;
    currentTranslate = 0;
    interval: any;
    isTransitioning = true;

    ngOnInit() {
        this.startTextRotation();
    }

    startTextRotation() {
        this.interval = setInterval(() => {
            if (this.currentMessageIndex < this.messages.length) {
                this.currentMessageIndex++;
                this.currentTranslate = this.currentMessageIndex * 100;
            }
        }, 5000);
    }

    handleTransitionEnd() {
        if (this.currentMessageIndex === this.messages.length) {
            // Disable transition, reset instantly
            this.isTransitioning = false;
            this.currentMessageIndex = 0;
            this.currentTranslate = 0;

            // Wait a tiny bit, then re-enable transition
            setTimeout(() => {
                this.isTransitioning = true;
            }, 50);
        }
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
