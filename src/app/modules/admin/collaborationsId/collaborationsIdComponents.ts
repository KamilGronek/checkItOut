import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
    ElementRef,
    QueryList,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Router } from '@angular/router';

import { Inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { Influencer } from '../../../services/influencer/Influencer';
import { Influencer } from 'app/services/influencer/Influencer';

import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
// import { InfluencerService } from '../../../services/influencer/collaborations.service';
import { InfluencerService } from 'app/services/influencer/influencer.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FuseCardComponent } from '@fuse/components/card';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'app/services/collaboration/Collaboration';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateTime } from 'luxon';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'collaborationsId',
    standalone: true,
    templateUrl: './collaborationsId.component.html',
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush,

    imports: [
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatDividerModule,
        NgApexchartsModule,
        MatTableModule,
        MatSortModule,
        NgClass,
        MatProgressBarModule,
        CurrencyPipe,
        DatePipe,
        FuseCardComponent,
        MatDatepickerModule,
        JsonPipe,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    styleUrl: 'collaborationsId-list.styles.css',
})
export class CollaborationsIdComponent {
    formFieldHelpers: string[] = [''];

    id: number;
    influencerList: Influencer[];
    collaborationData = {};

    card: any;
    cardForm: UntypedFormGroup;

    list = {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis placerat, odio nec pellentesque consectetur, libero ligula ultricies diam, a vehicula orci ipsum at ligula. Fusce vulputate, dolor in laoreet egestas, eros ex semper tortor, eu euismod arcu risus vitae urna. Donec porta, metus quis elementum elementum, augue diam mollis orci, nec bibendum quam nulla feugiat nisl. Nam dictum posuere turpis, at mattis nibh finibus vel. Donec consequat gravida leo non laoreet. Morbi placerat imperdiet tristique. Fusce ut arcu ac enim posuere aliquam. Sed sodales facilisis elementum. Integer sollicitudin ornare cursus. Mauris tempus, risus ut ultrices malesuada, arcu tortor congue ante, vel malesuada tellus ante sit amet velit. Phasellus feugiat fringilla vehicula. In at ultricies ante. Aenean euismod accumsan elementum. Vestibulum a nisi dui. Aliquam et nibh quam. Proin lacinia tincidunt turpis a lobortis. In vitae massa porttitor, accumsan metus non, efficitur tortor. Proin aliquam dapibus massa, a aliquet massa. Fusce maximus erat odio. Nulla dictum venenatis nisi, vitae suscipit lectus interdum ac. Etiam dolor sem, faucibus et odio ut, imperdiet fermentum lectus. Nunc porttitor, nisl et congue iaculis, sem leo lobortis enim, ut dignissim metus ipsum nec erat. Nulla pellentesque risus sit amet ante feugiat eleifend. Sed mollis eleifend lacus, nec tempus nibh ullamcorper a. Praesent elementum urna et nisl eleifend congue. Suspendisse quis hendrerit urna. Suspendisse rhoncus, ligula ut fermentum vulputate, quam justo pretium lorem, vitae dapibus urna dolor at magna. Donec viverra, magna ac facilisis ultricies, turpis mi faucibus lectus, sit amet tempus ipsum sem sit amet mauris. Proin ligula nisi, elementum pulvinar maximus eu, semper ac nisl. Etiam venenatis semper quam, vel pellentesque ex tincidunt ut. Donec non pretium sapien. Proin mi arcu, ultricies vitae arcu sed, vehicula laoreet arcu.',
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _influencerService: InfluencerService,
        private _formBuilder: UntypedFormBuilder,
        private fb: FormBuilder
    ) {
        this.cardForm = this.fb.group({
            dueDate: [null],
        });
        this.card = {
            dueDate: null,
        };
    }

    /**
     *
     * @param dueDate - Data do sprawdzenia
     * @returns true,
     */

    ngAfterViewInit(): void {}

    readonly range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.id = +params.get('id');

            console.log('id:', this.id);

            this._influencerService
                .getdataJson()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((influencerList) => {
                    this.influencerList = influencerList;

                    this.collaborationData = this.influencerList.find(
                        (item) => item.id === this.id
                    );

                    console.log(this.collaborationData);
                });
        });
    }

    isOverdue(date: string): boolean {
        return (
            DateTime.fromISO(date).startOf('day') <
            DateTime.now().startOf('day')
        );
    }

    onDateSelected(): void {
        const selectedDate = this.cardForm.get('dueDate')?.value;
        this.card.dueDate = selectedDate;
        console.log('Selected date:', selectedDate);
    }

    clearDueDate(): void {
        this.cardForm.get('dueDate')?.setValue(null);
        this.card.dueDate = null;
        console.log('Date cleared');
    }

    /**
     * Focus on the given element to start editing the list title
     *
     * @param listTitleInput
     */
    renameList(listTitleInput: HTMLElement): void {
        setTimeout(() => {
            listTitleInput.focus();
        });
    }

    updateListTitle(event: any): void {
        const element: HTMLInputElement = event.target;

        const newTitle = element.value;

        // If the title is empty...
        if (!newTitle || newTitle.trim() === '') {
            return;
        }
    }

    autoResize(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    goBackToMain(): void {
        this.router.navigate(['/collaborations']);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
