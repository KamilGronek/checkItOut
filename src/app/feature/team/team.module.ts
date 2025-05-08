import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamComponent } from './team.component';

@NgModule({
  imports: [
    CommonModule,
    TeamComponent,
    RouterModule.forChild([
      {
        path: '',
        component: TeamComponent
      }
    ])
  ]
})
export class TeamModule { }
