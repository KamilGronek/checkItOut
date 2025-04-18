import { NgIf } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { LinkComponent } from '../../../../shared/components/ui/link/link.component';
import { TranslocoPipe } from '@ngneat/transloco';
import { SocialAuthService } from 'app/core/services/authentication/social-auth.service';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    FuseAlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    CardComponent,
    LinkComponent,
    TranslocoPipe
  ]
})
export class AuthSignUpComponent {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  isLoading: boolean = false;
  supportedPlatforms: string[] = [];

  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _socialAuthService: SocialAuthService,
    private _snackbarService: SnackbarService
  ) {
    this.loadSupportedPlatforms();
  }

  /**
   * Load supported social platforms from the backend
   */
  private loadSupportedPlatforms(): void {
    this.isLoading = true;
    this._socialAuthService.getSupportedPlatforms().subscribe({
      next: platforms => {
        this.supportedPlatforms = platforms;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading supported platforms:', error);
        // Default to Instagram if API fails
        this.supportedPlatforms = ['instagram'];
        this.isLoading = false;
      }
    });
  }

  /**
   * Start OAuth flow for influencer sign up
   */
  signUpAsInfluencer(platform: string = 'instagram'): void {
    this._socialAuthService.startOAuthFlow(platform);
  }

  /**
   * Navigate to business sign up
   */
  signUpAsBusiness(): void {
    this._router.navigate(['auth/sign-up/business']);
  }
}
