import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [CommonModule, RouterModule, TranslocoPipe, MatIconModule],
  standalone: true
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
