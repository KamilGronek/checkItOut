import { Injectable } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { InfluencerService } from 'app/feature/influencers/services/influencer.service';
import { City, CityResponse } from 'app/feature/influencers/services/influencer.types';
import { CollaborationService } from 'app/feature/collaborations/services/collaboration.service';
import {
  User,
  UserContent,
  ServiceTypeCollaboration,
  ServiceType,
  Platforms,
  Collaboration
} from 'app/feature/collaborations/services/collaboration.types';
import { TypeService } from 'app/core/services/service-type/service-type.service';
import { FormGroup } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import {
  delay,
  Observable,
  of,
  switchMap,
  throwError,
  combineLatest,
  map,
  Subject,
  takeUntil,
  catchError
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookingUpEditDataService {
  editNewCollaborationFormGroup: UntypedFormGroup;

  private contentTypeSubject = new BehaviorSubject({});
  private getPlatformSubject = new BehaviorSubject([]);

  contentTypes$ = this.contentTypeSubject.asObservable();
  platformList$ = this.getPlatformSubject.asObservable();

  contentItems = [];
  platformList = [];

  private destroy$ = new Subject<void>();

  private formGroup: FormGroup | null = null;

  constructor(
    private fb: FormBuilder,
    private _influencerService: InfluencerService,
    private _collaborationService: CollaborationService,
    private _typeService: TypeService,
    private translocoService: TranslocoService
  ) {}

  private cityListSubject = new BehaviorSubject({});
  cityList$ = this.cityListSubject.asObservable();

  private compensationTypeSubject = new BehaviorSubject({});
  compensationList$ = this.compensationTypeSubject.asObservable();

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

  companyListSubject = new BehaviorSubject<{ value: string; label: string }[]>([]);
  companyList$ = this.companyListSubject.asObservable();

  getCompany() {
    this._collaborationService.getCompany().subscribe({
      next: (response: any) => {
        const mappedCompany = response.content.map(company => ({
          value: company.name,
          label: company.imageUrl
        }));
        this.companyListSubject.next(mappedCompany);

        console.log('mappedCompany', mappedCompany);
      },
      error: error => {
        console.error('Error fetching user list:', error);
      }
    });
  }

  serviceTypeSubject = new BehaviorSubject<{ value: number; label: string }[]>([]);
  serviceType$ = this.serviceTypeSubject.asObservable();

  getServiceTypeList() {
    this._collaborationService.getServiceTypeList().subscribe({
      next: (response: ServiceTypeCollaboration) => {
        const serviceTyps = response.content.map(serviceType => ({
          value: serviceType.id,
          label: serviceType.name
        }));
        this.serviceTypeSubject.next(serviceTyps);
        console.log('ServiceTyps:', serviceTyps);
      },
      error: error => {
        console.error('Error fetching user list:', error);
      }
    });
  }

  getContentType(): void {
    this._collaborationService.getCollaborationContentType().subscribe({
      next: response => {
        this.contentTypeSubject.next(response.content);
        // console.log('contentItems:', response.content);
      },
      error: error => {
        console.error('Error fetching content type:', error);
      }
    });
  }
}
