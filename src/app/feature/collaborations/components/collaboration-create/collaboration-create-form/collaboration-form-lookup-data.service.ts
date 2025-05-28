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
import {
  ContentTypes,
  Platforms,
  Currency
} from 'app/feature/collaborations/services/collaboration.types';
import { Address } from 'app/feature/users/services/user-addresses/user-addresses.types';

@Injectable({
  providedIn: 'root'
})
export class LookingUpDataService {
  editNewCollaborationFormGroup: UntypedFormGroup;

  private getPlatformSubject = new BehaviorSubject<Platforms[]>([]);
  private cityListSubject = new BehaviorSubject<{ value: string; label: string }[]>([]);

  private compensationTypeSubject = new BehaviorSubject<{ value: string; label: string }[]>([]);
  private destroy$ = new Subject<void>();
  private formGroup: FormGroup | null = null;

  platformList$ = this.getPlatformSubject.asObservable();
  cityList$ = this.cityListSubject.asObservable();
  compensationList$ = this.compensationTypeSubject.asObservable();

  userListSubject = new BehaviorSubject<{ value: number; label: string; addresses: any }[]>([]);
  userList$ = this.userListSubject.asObservable();

  companyListSubject = new BehaviorSubject<{ value: string; label: string }[]>([]);
  companyList$ = this.companyListSubject.asObservable();

  serviceTypeSubject = new BehaviorSubject<{ value: number; label: string }[]>([]);
  serviceType$ = this.serviceTypeSubject.asObservable();

  private contentTypeSubject = new BehaviorSubject<ContentTypes[]>([]);
  public contentTypes$ = this.contentTypeSubject.asObservable();

  currencyListSubject = new BehaviorSubject<{ value: number; label: string }[]>([]);
  currency$ = this.currencyListSubject.asObservable();

  contentTypesContent = [];
  contentCurrency = [];

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
                    compensation === 'CASH' ? 'cash' : 'barter'
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

  currencies: Currency[] = [];

  getCurrency(): void {
    this._collaborationService.getCurrency().subscribe({
      next: response => {
        const contentCurrency = response.content.map(currency => ({
          value: currency.id,
          label: currency.isoCode,
          id: currency.id,
          isoCode: currency.isoCode,
          name: currency.name,
          sign: currency.sign,
          countryCode: currency.countryCode
        }));
        console.log('contentCurrency;', contentCurrency);

        this.currencyListSubject.next(contentCurrency);
      },
      error: error => {
        console.error('Error fetching content type:', error);
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

  getCurrency(): void {
    this._collaborationService.getCurrency().subscribe({
      next: response => {
        const contentCurrency = response.content.map(currency => ({
          value: currency.id,
          label: currency.isoCode
        }));
        console.log('contentCurrency;', contentCurrency);

        this.currencyListSubject.next(contentCurrency);
      },
      error: error => {
        console.error('Error fetching content type:', error);
      }
    });
  }

  getUserCompany() {
    this._collaborationService.getUser().subscribe({
      next: (response: User) => {
        const res = response.content;
        console.log('res;', res);

        const filteredUsers = response.content.map(user => ({
          value: user.id,
          label: user.profilePicture,
          addresses: user.addresses
        }));
        console.log('filteredUsers;', filteredUsers);

        this.userListSubject.next(filteredUsers);
      },
      error: error => {
        console.error('Error fetching user list:', error);
      }
    });
  }

  getServiceTypeList() {
    this._collaborationService
      .getServiceTypeList()
      .pipe(
        switchMap((response: ServiceTypeCollaboration) =>
          combineLatest(
            response.content.map(serviceType =>
              this.translocoService
                .selectTranslate(`user.collaborations.service-types.${serviceType.name}`)
                .pipe(map(label => ({ value: serviceType.id, label })))
            )
          )
        ),
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Translation error:', error);
          return of([]);
        })
      )
      .subscribe(serviceTyps => {
        this.serviceTypeSubject.next(serviceTyps);
      });
  }

  getContentType(): void {
    this._collaborationService.getCollaborationContentType().subscribe({
      next: response => {
        this.contentTypesContent = response.content.map(contentType => ({
          name: contentType.name,
          id: contentType.id,
          active: false
        }));
        this.contentTypeSubject.next(this.contentTypesContent);
      },
      error: error => {
        console.error('Error fetching content type:', error);
      }
    });
  }

  getPlatform(): void {
    this._collaborationService.getCollaborationPlatform().subscribe({
      next: response => {
        const platforms = response.content.map((platform: any) => ({
          ...platform,
          isDisplay: platform.active
        }));

        this.getPlatformSubject.next(platforms);

        console.log('platforms:', platforms);

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
      console.log(' item.isDisplay:', item.isDisplay);

      this.contentTypesContent.map(contentType => {
        contentType.active = item.isDisplay;
      });

      let platformCurrentValues = this.getCurrentValues(type);

      if (type === 'platforms' && item.isDisplay) {
        if (!platformCurrentValues.includes(item.id)) {
          platformCurrentValues.push(item.id);
        }

        console.log('platformCurrentValues:', platformCurrentValues);
      } else {
        platformCurrentValues = platformCurrentValues.filter((id: string) => id !== item.id);
      }

      console.log(`Updated ${type}:`, platformCurrentValues);

      this.updateFormValue(type, platformCurrentValues);
    }
  }

  private updateFormValue(type: 'contentTypes' | 'platforms', values: any[]): void {
    const control = this.editNewCollaborationFormGroup.get(type);
    if (control) {
      control.setValue(values);
      console.log(`Updated ${type} in form:`, control.value);
    } else {
      console.error(`Control for ${type} not found in form.`);
    }
  }

  private getCurrentValues(type: 'contentTypes' | 'platforms'): any[] {
    return this.formGroup?.get(type)?.value || [];
  }

  itemPlatform = '';

  getTooltipText(type: 'contentTypes' | 'platforms', item: any) {
    if (type === 'platforms') {
      if (!item.active) {
        return `${item.name} - ${this.translocoService.translate(
          'user.collaborations.details.tooltip'
        )}`;
      }

      this.itemPlatform = item.name;

      return this.itemPlatform;
    }

    const allActive = this.contentTypesContent.some(contentItem => contentItem.active);

    if (allActive) {
      return this.itemPlatform, this.itemPlatform;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
