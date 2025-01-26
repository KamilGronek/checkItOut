import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
    constructor(private authService: AuthService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.authService.check().subscribe((isAuthenticated) => {
            if (isAuthenticated) {
                console.log('User is authenticated');
            } else {
                console.log('User is not authenticated');
            }
        });
    }
}
