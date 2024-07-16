import { NgModule } from '@angular/core';
import { NbLayoutModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PrivilegesModule } from './privileges/privileges.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesComponent } from './pages.component';
import { LoginModule } from '../login/login.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbLayoutModule,
    UsersModule,
    PrivilegesModule,
    LoginModule,
    DashboardModule
  ],
  declarations: [
    PagesComponent
  ]
})
export class PagesModule {
}
