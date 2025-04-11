import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsPreferencesComponent } from './preferences/preferences.component';
import { SettingsPlanBillingComponent } from './plan-billing/plan-billing.component';
import { SettingsSecurityComponent } from './security/security.component';
import { AddressesComponent } from './addresses/addresses.component';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
    SettingsAccountComponent,
    SettingsSecurityComponent,
    SettingsPlanBillingComponent,
    SettingsPreferencesComponent,
    AddressesComponent,
    TranslocoPipe
  ],
  standalone: true
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any[] = [];
  selectedPanel: string = 'account';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _translocoService: TranslocoService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Setup available panels
    this.panels = [
      {
        id: 'account',
        icon: 'heroicons_outline:user-circle',
        title: this._translocoService.translate('settings.panels.account.title'),
        description: this._translocoService.translate('settings.panels.account.description'),
        disabled: false
      },
      {
        id: 'security',
        icon: 'heroicons_outline:lock-closed',
        title: this._translocoService.translate('settings.panels.security.title'),
        description: this._translocoService.translate('settings.panels.security.description'),
        disabled: false
      },
      {
        id: 'addresses',
        icon: 'heroicons_outline:map-pin',
        title: this._translocoService.translate('settings.panels.addresses.title'),
        description: this._translocoService.translate('settings.panels.addresses.description'),
        disabled: false
      },
      {
        id: 'plan-billing',
        icon: 'heroicons_outline:credit-card',
        title: this._translocoService.translate('settings.panels.plan-billing.title'),
        description: this._translocoService.translate('settings.panels.plan-billing.description'),
        disabled: true
      },
      {
        id: 'preferences',
        icon: 'heroicons_outline:bell',
        title: this._translocoService.translate('settings.panels.preferences.title'),
        description: this._translocoService.translate('settings.panels.preferences.description'),
        disabled: false
      }
    ];

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode and drawerOpened
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        } else {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Subscribe to language changes
    this._translocoService.langChanges$.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      // Update panel titles and descriptions when language changes
      this.panels = this.panels.map(panel => ({
        ...panel,
        title: this._translocoService.translate(`settings.panels.${panel.id}.title`),
        description: this._translocoService.translate(`settings.panels.${panel.id}.description`)
      }));

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Navigate to the panel
   *
   * @param panel
   */
  goToPanel(panel: any): void {
    if (panel.disabled === true) return;
    this.selectedPanel = panel.id;

    // Close the drawer on 'over' mode
    if (this.drawerMode === 'over') {
      this.drawer.close();
    }
  }

  /**
   * Get the details of the panel
   *
   * @param id
   */
  getPanelInfo(id: string): any {
    return this.panels.find(panel => panel.id === id);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
