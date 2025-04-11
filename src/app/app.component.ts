import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/authentication/auth.service';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'app/feature/users/services/user.service';
import { UserPreferencesService } from 'app/feature/users/services/user-preferences/user-preferences.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _userPreferencesService: UserPreferencesService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    this._authService.check().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('User is authenticated');

        // Initialize user data
        this._userService
          .getLoggedInUser()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(user => {
            if (user) {
              console.log('User data loaded');

              // Apply user preferences if available
              this._userPreferencesService.applyUserPreferences();
            } else {
              console.warn('User data could not be loaded');
            }
          });
      } else {
        console.log('User is not authenticated');
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
