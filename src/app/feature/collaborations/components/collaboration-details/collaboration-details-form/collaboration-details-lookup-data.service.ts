import { Injectable } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { InfluencerService } from 'app/feature/influencers/services/influencer.service';
import { CityResponse } from 'app/feature/influencers/services/influencer.types';
import { CollaborationService } from 'app/feature/collaborations/services/collaboration.service';
import {
  Collaboration,
  CollaborationResponse
} from 'app/feature/collaborations/services/collaboration.types';
import { TypeService } from 'app/core/services/service-type/service-type.service';
import { FormGroup } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { of, switchMap, combineLatest, map, Subject, takeUntil, catchError } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LookingUpEditDataService {
  // editNewCollaborationFormGroup: UntypedFormGroup;

  private contentTypeSubject = new BehaviorSubject({});
  private getPlatformSubject = new BehaviorSubject([]);

  contentTypes$ = this.contentTypeSubject.asObservable();
  platformList$ = this.getPlatformSubject.asObservable();

  textAreaControlRequirements = new FormControl('', [Validators.required]);
  controlCampaignDetails = new FormControl('', [Validators.required]);
  controlName = new FormControl('', [Validators.required]);
  controlCity = new FormControl('', [Validators.required]);
  controlcompensationType = new FormControl('', [Validators.required]);

  private destroy$ = new Subject<void>();

  private formGroup: FormGroup | null = null;

  collaborationList: Collaboration[] = [];

  constructor(
    private fb: FormBuilder,
    private _influencerService: InfluencerService,
    private _collaborationService: CollaborationService,
    private _typeService: TypeService,
    private translocoService: TranslocoService
  ) {}

  private cityListSubject = new BehaviorSubject({});
  cityList$ = this.cityListSubject.asObservable();

  private collaborationListSubject = new BehaviorSubject<Collaboration[]>([]);
  collaborationList$ = this.collaborationListSubject.asObservable();

  getCollaborationList(): void {
    this._collaborationService.getCollaborationList().subscribe({
      next: (response: CollaborationResponse) => {
        if (!response || !response.content || response.content.length === 0) {
          console.warn('Collaboration list is empty.');
          this.collaborationListSubject.next([]);
        } else {
          console.log('response.content:', response.content);
          this.collaborationListSubject.next(response.content);
        }
      },
      error: err => {
        console.error('Błąd pobierania listy współprac:', err);
        this.collaborationListSubject.next([]);
      }
    });
  }

  private collaborationSubject = new BehaviorSubject<Collaboration | null>(null); // Stworzenie Subject, aby przechować dane
  collaboration$ = this.collaborationSubject.asObservable();

  getCollaborationId(id: number) {
    this._collaborationService.getCollaborationId(id).subscribe({
      next: (response: Collaboration) => {
        this.collaborationSubject.next(response);
      },
      error: error => {
        console.error('Error fetching user list:', error);
      }
    });
  }

  getCityList(): void {
    this._influencerService
      .getInfluencerCityList()
      .pipe(
        switchMap((response: CityResponse) =>
          combineLatest(
            response.content.map(city =>
              this.translocoService
                .selectTranslate(`user.collaborations.cities.${city.name}`)
                .pipe(map(label => ({ value: city.name, label })))
            )
          )
        ),
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Translation error:', error);
          return of([]);
        })
      )
      .subscribe(transformedData => {
        this.cityListSubject.next(transformedData);
      });
  }

  private compensationTypeSubject = new BehaviorSubject({});
  compensationList$ = this.compensationTypeSubject.asObservable();

  getCompensationType(): void {
    this._collaborationService
      .getCompensationType()
      .pipe(
        switchMap(compensations =>
          combineLatest(
            compensations.map(compensation =>
              this.translocoService
                .selectTranslate(
                  `user.collaborations.compensationType.${
                    compensation === 'Gotówka' ? 'cash' : 'barter'
                  }`
                )
                .pipe(map(label => ({ value: compensation, label })))
            )
          )
        ),
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Translation error:', error);
          return of([]);
        })
      )
      .subscribe(transformedData => {
        this.compensationTypeSubject.next(transformedData);
      });
  }
}
