import { Injectable } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { InfluencerService } from 'app/feature/influencers/services/influencer.service';
import { CollaborationService } from 'app/feature/collaborations/services/collaboration.service';
import {
  Collaboration,
  CollaborationResponse
} from 'app/feature/collaborations/services/collaboration.types';
import { FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LookingUpUserDataService {
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

  collaborationList: Collaboration[] = [];

  constructor(private fb: FormBuilder, private _influencerService: InfluencerService) {}

  private statusListSubject = new BehaviorSubject<[]>([]);
  statusList$ = this.statusListSubject.asObservable();

  private typeListSubject = new BehaviorSubject<[]>([]);
  typeList$ = this.typeListSubject.asObservable();

  getStatus(): void {
    this._influencerService.getInfluencerStatus().subscribe({
      next: (response: any) => {
        const mapped = response.map(status => ({
          label: status,
          value: status
        }));
        this.statusListSubject.next(mapped);
      },
      error: error => {
        console.error('Error fetching status list:', error);
      }
    });
  }

  getAccountType(): void {
    this._influencerService.getInfluencerTypeAccount().subscribe({
      next: (response: any) => {
        const mapped = response.map(type => ({
          label: type,
          value: type
        }));
        this.typeListSubject.next(mapped);
      },
      error: error => {
        console.error('Error fetching status list:', error);
      }
    });
  }
}
