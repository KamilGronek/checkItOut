import { CollaborationService } from '../../../services/collaboration.service';
import { CompanyCollaboration, ServiceType } from '../../../services/collaboration.types';
import { FormGroup } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollaborationEditService {
  constructor(private _collaborationService: CollaborationService) {}

  formatDate(date: Date): string {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00`;
  }

  getUpdatedFormValues(
    formGroup: FormGroup,
    contentTypesList: any[],
    platformsList: any[],
    contentTypeSend: boolean,
    platformSend: boolean,
    resultMin: any,
    resultMax: any,
    currencyId: any
  ): any {
    const formValues = formGroup.getRawValue();

    if (contentTypeSend) {
      formValues.contentTypes = contentTypesList.map(item => item.id);
    }

    if (platformSend) {
      formValues.platforms = platformsList.map(item => item.id);
    }

    formValues.compensationAmountMin = resultMin;
    formValues.compensationAmountMax = resultMax;

    return formValues;
  }

  getUpdatedCollaborationObject(
    formValues: any,
    collaborationToUpdate: any,
    formControls: {
      name: AbstractControl;
      city: AbstractControl;
      details: AbstractControl;
      requirements: AbstractControl;
      compensationType: AbstractControl;
      startDate: AbstractControl;
      endDate: AbstractControl;
      currencyId: any;
    },
    card: { startDate: string; endDate: string }
  ): any {
    const companyId = (collaborationToUpdate.company as CompanyCollaboration).id;
    const serviceTypeId = (collaborationToUpdate.serviceType as ServiceType).id;

    let updatedObject = {
      ...collaborationToUpdate,
      ...Object.keys(formValues).reduce((result, key) => {
        result[key] = formValues[key] !== '' ? formValues[key] : collaborationToUpdate[key];
        return result;
      }, {}),
      name: formControls.name.value,
      company: companyId,
      city: formControls.city.value,
      details: formControls.details.value,
      requirements: formControls.requirements.value,
      compensationType: formControls.compensationType.value,
      serviceType: serviceTypeId,
      startDate: formControls.startDate.value
        ? this.formatDate(new Date(formControls.startDate.value))
        : card.startDate,
      endDate: formControls.endDate.value
        ? this.formatDate(new Date(formControls.endDate.value))
        : card.endDate,
      currency: formControls.currencyId.id
    };

    return updatedObject;
  }

  sendUpdateRequest(
    collaborationUpdated: any,
    collaborationId: number,
    onSuccess: () => void,
    onError: (err: any) => void
  ): void {
    this._collaborationService
      .updateCollaboration(collaborationUpdated, collaborationId)
      .subscribe({
        next: () => {
          onSuccess();
        },
        error: err => {
          onError(err);
        }
      });
  }

  mapActiveItemsToForm(form: FormGroup, type: 'platforms' | 'contentTypes', list: any[]): void {
    const activeIds: string[] = [];

    list.forEach(item => {
      if (item.active) {
        activeIds.push(item.id);
        item.active = false;
      }
    });

    form.patchValue({
      [type]: activeIds
    });

    console.log(`Mapped active ${type}:`, activeIds);
  }
}
