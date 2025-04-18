import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/services/authentication/auth.service';
import { InfluencerService } from 'app/feature/influencers/services/influencer.service';
import { Influencer } from 'app/feature/influencers/services/influencer.types';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { LinkComponent } from 'app/shared/components/ui/link/link.component';
import { TranslocoPipe } from '@ngneat/transloco';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { SocialAuthService } from 'app/core/services/authentication/social-auth.service';

interface SignInForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  rememberMe: FormControl<boolean | null>;
}

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    RouterLink,
    FuseAlertComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    ButtonComponent,
    InputComponent,
    LinkComponent,
    TranslocoPipe
  ]
})
export class AuthSignInComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  signInForm: FormGroup<SignInForm>;
  showAlert: boolean = false;
  isLoading: boolean = false;

  influencerUser: Influencer;

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _influencerService: InfluencerService,
    private _socialAuthService: SocialAuthService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form with typed controls
    this.signInForm = new FormGroup<SignInForm>({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false)
    });

    const userStatus = localStorage.getItem('userStatus');

    if (userStatus) {
      console.log('Status użytkownika przed logowaniem:', userStatus);
    } else {
      console.log('Brak statusu użytkownika w localStorage');
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in with email and password
   */
  signInWithEmailAndPassword(): void {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();
    this.isLoading = true;

    // Hide the alert
    this.showAlert = false;

    this._authService
      .signInUsingEmailAndPassword(this.signInForm.getRawValue())
      .then(() => {
        this.isLoading = false;
        this._influencerService.getInfluencerUser().subscribe({
          next: userData => {
            const status = userData.accountStatus;
            localStorage.setItem('userStatus', status);
            this._router.navigateByUrl('/collaborations/list');
          },
          error: err => {
            this._snackbarService.showFailure('User not found in database');
            console.log(err);
            this._authService.signOut();
            this.signInForm.reset();
            this.signInForm.enable();
          }
        });
      })
      .catch(error => {
        this.isLoading = false;
        this.signInForm.enable();
        this.signInNgForm.resetForm();

        this.alert = {
          type: 'error',
          message: 'Wrong email or password'
        };

        this.showAlert = true;
      });
  }

  /**
   * Sign in with Instagram
   */
  signInWithSocialPlatform(platform: string = 'instagram'): void {
    this.isLoading = true;
    this._socialAuthService.startOAuthFlow(platform);
  }
}
