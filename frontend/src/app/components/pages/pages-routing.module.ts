import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { UsersComponent } from './users/users.component';
import { DeepfakeDetectionComponent } from './deepfake/deepfake-detection/deepfake-detection.component';
import { TitlesComponent } from './titles/titles.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'deepfake',
      loadChildren: () => import('./deepfake/deepfake.module')
        .then(m => m.DeepfakeModule),
    },
    {
      path: 'titles',
      component: TitlesComponent,
    },
    {
      path: 'users',
      component: UsersComponent,
    },
    {
      path: 'privileges',
      component: PrivilegesComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
