import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Router } from '@angular/router';

import { Inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Influencer } from 'app/services/influencer/Influencer';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';

import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
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
import { CollaborationService } from '../../../services/collaboration/collaboration.service';
import { Collaboration } from '../../../services/collaboration/Collaboration';
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
        MatNativeDateModule,
    ],
    styleUrl: 'collaborationsId-list.styles.css',
})
export class CollaborationsIdComponent {
    formFieldHelpers: string[] = [''];

    id: number;
    influencerList: Influencer[];
    collaboration = {};

    card: any;
    cardForm: UntypedFormGroup;

    list = {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis placerat, odio nec pellentesque consectetur, libero ligula ultricies diam, a vehicula orci ipsum at ligula. Fusce vulputate, dolor in laoreet egestas, eros ex semper tortor, eu euismod arcu risus vitae urna. Donec porta, metus quis elementum elementum, augue diam mollis orci, nec bibendum quam nulla feugiat nisl. Nam dictum posuere turpis, at mattis nibh finibus vel. Donec consequat gravida leo non laoreet. Morbi placerat imperdiet tristique. Fusce ut arcu ac enim posuere aliquam. Sed sodales facilisis elementum. Integer sollicitudin ornare cursus. Mauris tempus, risus ut ultrices malesuada, arcu tortor congue ante, vel malesuada tellus ante sit amet velit. Phasellus feugiat fringilla vehicula. In at ultricies ante. Aenean euismod accumsan elementum. Vestibulum a nisi dui. Aliquam et nibh quam. Proin lacinia tincidunt turpis a lobortis. In vitae massa porttitor, accumsan metus non, efficitur tortor. Proin aliquam dapibus massa, a aliquet massa. Fusce maximus erat odio. Nulla dictum venenatis nisi, vitae suscipit lectus interdum ac. Etiam dolor sem, faucibus et odio ut, imperdiet fermentum lectus. Nunc porttitor, nisl et congue iaculis, sem leo lobortis enim, ut dignissim metus ipsum nec erat. Nulla pellentesque risus sit amet ante feugiat eleifend. Sed mollis eleifend lacus, nec tempus nibh ullamcorper a. Praesent elementum urna et nisl eleifend congue. Suspendisse quis hendrerit urna. Suspendisse rhoncus, ligula ut fermentum vulputate, quam justo pretium lorem, vitae dapibus urna dolor at magna. Donec viverra, magna ac facilisis ultricies, turpis mi faucibus lectus, sit amet tempus ipsum sem sit amet mauris. Proin ligula nisi, elementum pulvinar maximus eu, semper ac nisl. Etiam venenatis semper quam, vel pellentesque ex tincidunt ut. Donec non pretium sapien. Proin mi arcu, ultricies vitae arcu sed, vehicula laoreet arcu.',
    };

    collaborationList: Collaboration[] = [];
    isLoading: boolean = true;
    error: string | null = null;
    configForm: UntypedFormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _formBuilder: UntypedFormBuilder,
        private fb: FormBuilder,
        private _collaborationService: CollaborationService,
        private _cdRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService
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
     * @param dueDate
     * @returns true,
     */

    ngAfterViewInit(): void {}

    readonly range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    ngOnInit(): void {
        this.configForm = this._formBuilder.group({
            title: 'Usuń pozycję',
            message:
                'Czy jesteś pewien że chcesz usunąć pozycje? <span class="font-medium"></span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Usuń',
                    color: 'warn',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Anuluj',
                }),
            }),
            dismissible: true,
        });

        this.getCollaborationList();

        this.route.paramMap.subscribe((params) => {
            this.id = +params.get('id');
        });
    }

    private async getCollaborationList(): Promise<void> {
        this._collaborationService.getCollaborationList().subscribe({
            next: (response: Collaboration[]) => {
                this.collaborationList = response;
                this.isLoading = false;

                this.collaboration = this.collaborationList.find(
                    (item) => item.id === this.id
                );

                this._cdRef.detectChanges();

                console.log('collaboration:', this.collaboration);
            },
            error: (err) => {
                console.error('Error fetching collaborations:', err);
                this.error = 'Failed to load collaborations.';
                this.isLoading = false;
            },
        });
    }

    delete(companyId: number): void {
        this._collaborationService.deleteCollaboration(companyId).subscribe({
            next: () => {
                this.router.navigate(['/collaborations']);
            },
            error: (err) => {
                console.error('Error deleting company:', err);
            },
        });
    }

    openConfirmationDialog(companyId: number): void {
        const dialogRef = this._fuseConfirmationService.open(
            this.configForm.value
        );

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            this.delete(companyId);
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
