import { Routes } from '@angular/router';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { AdminUsersComponent } from './user-management/user-management.component';

export default [
  {
    path: 'user-management',
    component: AdminUsersComponent
  },
  {
    path: 'dictionary',
    component: DictionaryComponent
  }
] as Routes;
