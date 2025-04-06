import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { switchMap, combineLatest } from 'rxjs';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollaborationConfirmPopUpService {
  private configFormSubject = new BehaviorSubject<UntypedFormGroup | null>(null);

  private readonly destroy$ = new Subject<void>();

  configForm$ = this.configFormSubject.asObservable();

  constructor(private fb: FormBuilder, private translocoService: TranslocoService) {}

  popUpConfirmation(
    iconName = 'heroicons_outline:bell-alert',
    iconColor = 'success',
    confirmLabel = 'Ok'
  ) {
    this.translocoService.langChanges$
      .pipe(
        switchMap(() =>
          combineLatest([
            this.translocoService.selectTranslate(
              'user.collaborations.pop_up_notice.confirm.title'
            ),
            this.translocoService.selectTranslate(
              'user.collaborations.pop_up_notice.confirm.message'
            ),
            this.translocoService.selectTranslate('user.collaborations.details.return_button')
          ])
        ),
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Translation error:', error);
          return of(['Error', 'Translation failed', 'Cancel']);
        })
      )
      .subscribe(([translatedTitle, translatedMessage, translatedbuttonCancel]) => {
        const form = this.fb.group({
          title: translatedTitle,
          message: `${translatedMessage} <span class="font-medium"></span>`,
          icon: this.fb.group({
            show: true,
            name: iconName,
            color: iconColor
          }),
          actions: this.fb.group({
            confirm: this.fb.group({
              show: true,
              label: confirmLabel,
              color: 'primary'
            }),
            cancel: this.fb.group({
              show: true,
              label: translatedbuttonCancel
            })
          }),
          dismissible: true
        });

        this.configFormSubject.next(form);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
