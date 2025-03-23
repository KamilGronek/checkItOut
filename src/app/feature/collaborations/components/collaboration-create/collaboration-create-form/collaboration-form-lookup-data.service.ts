import { Injectable } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { InfluencerService } from 'app/feature/influencers/services/influencer.service';
import { City, CityResponse } from 'app/feature/influencers/services/influencer.types';
import { CollaborationService } from 'app/feature/collaborations/services/collaboration.service';
import {
  User,
  ServiceTypeCollaboration
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
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ContentTypes, Platforms } from 'app/feature/collaborations/services/collaboration.types';
@Injectable({
  providedIn: 'root'
})
export class LookingUpDataService {
  editNewCollaborationFormGroup: UntypedFormGroup;
  private contentTypeSubject = new BehaviorSubject<ContentTypes[]>([]);
  private getPlatformSubject = new BehaviorSubject<Platforms[]>([]);
  private cityListSubject = new BehaviorSubject<{ value: string; label: string }[]>([]);
  private compensationTypeSubject = new BehaviorSubject<{ value: string; label: string }[]>([]);
  private destroy$ = new Subject<void>();
  private formGroup: FormGroup | null = null;

  contentTypes$ = this.contentTypeSubject.asObservable();
  platformList$ = this.getPlatformSubject.asObservable();
  cityList$ = this.cityListSubject.asObservable();
  compensationList$ = this.compensationTypeSubject.asObservable();

  userListSubject = new BehaviorSubject<{ value: number; label: string }[]>([]);
  userList$ = this.userListSubject.asObservable();

  companyListSubject = new BehaviorSubject<{ value: string; label: string }[]>([]);
  companyList$ = this.companyListSubject.asObservable();

  serviceTypeSubject = new BehaviorSubject<{ value: number; label: string }[]>([]);
  serviceType$ = this.serviceTypeSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    private _influencerService: InfluencerService,
    private _collaborationService: CollaborationService,
    private _typeService: TypeService,
    private translocoService: TranslocoService
  ) {}

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

  getUserCompany() {
    this._collaborationService.getUser().subscribe({
      next: (response: User) => {
        const filteredUsers = response.content
          .filter(company => company.company)
          .map(company => ({
            value: company.id,
            label: company.company.name
          }));
        this.userListSubject.next(filteredUsers);
      },
      error: error => {
        console.error('Error fetching user list:', error);
      }
    });
  }

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

  getServiceTypeList() {
    this._collaborationService.getServiceTypeList().subscribe({
      next: (response: ServiceTypeCollaboration) => {
        const serviceTyps = response.content.map(serviceType => ({
          value: serviceType.id,
          label: serviceType.name
        }));
        this.serviceTypeSubject.next(serviceTyps);
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
      },
      error: error => {
        console.error('Error fetching content type:', error);
      }
    });
  }

  getPlatform(): void {
    this._collaborationService.getCollaborationPlatform().subscribe({
      next: response => {
        const platforms = response.content.map((platform: any) => {
          return {
            ...platform,
            isDisplay: platform.active
          };
        });

        console.log('platforms');

        this.getPlatformSubject.next(platforms);
        this.initializePlatformToggle(platforms);
      },
      error: error => {
        console.error('Error fetching platforms:', error);
      }
    });
  }

  initializePlatformToggle(platforms: any[]): void {
    const firstPlatform = platforms.find(p => p.active);
    if (firstPlatform) {
      this.toggleChip('platforms', firstPlatform);
    }
  }

  setFormGroup(form: FormGroup): void {
    this.formGroup = form;
  }

  toggleChip(type: 'contentTypes' | 'platforms', item: any): void {
    console.log('item:', item);

    if (type === 'contentTypes') {
      item.active = !item.active;
    } else if (type === 'platforms') {
      item.isDisplay = !item.isDisplay;
    }

    let currentValues = this.getCurrentValues(type);

    if ((type === 'platforms' && item.isDisplay) || (type === 'contentTypes' && item.active)) {
      currentValues.push(item.id);

      console.log('currentValues:', currentValues);
    } else {
      currentValues = currentValues.filter((id: string) => id !== item.id);
    }
    console.log(`Updated ${type}:`, currentValues);

    this.updateFormValue(type, currentValues);
  }

  private updateFormValue(type: 'contentTypes' | 'platforms', currentValues: any[]): void {
    if (!this.formGroup) {
      console.error('Nie można zaktualizować wartości – brak formularza!');
      return;
    }

    this.formGroup.patchValue({
      [type]: currentValues
    });
  }

  private getCurrentValues(type: 'contentTypes' | 'platforms'): any[] {
    return this.formGroup?.get(type)?.value || [];
  }

  getTooltipText(platform: any): string {
    if (!platform.active) {
      return `${platform.name} - ${this.translocoService.translate(
        'user.collaborations.details.tooltip'
      )}`;
    }
    return platform.name;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
