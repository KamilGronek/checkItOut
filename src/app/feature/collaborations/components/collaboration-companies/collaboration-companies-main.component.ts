import { Component } from '@angular/core';
import { CollaborationCompaniesComponent } from './collaboration-companies.component';

@Component({
    selector: 'app-collaboration-main',
    standalone: true,
    imports: [CollaborationCompaniesComponent],
    templateUrl: './collaboration-companies-main.component.html',
})
export class CollaborationCompaniesMainComponent {
    constructor() { }

}
