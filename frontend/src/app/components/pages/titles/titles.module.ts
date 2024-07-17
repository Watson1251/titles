import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbIconModule, NbInputModule, NbPopoverModule, NbSelectModule, NbTabsetModule, NbTooltipModule, NbTreeGridModule, NbWindowModule } from '@nebular/theme';
import { AngularMaterialModule } from '../../../angular-material.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { PaginatorModule } from '../../shared/paginator/paginator.module';
import { TitlesComponent } from './titles.component';
import { FormsModule } from '@angular/forms';
import { TitleDialogComponent } from './title-dialog/title-dialog.component';


const MODULES = [
  FormsModule,
  ThemeModule,
  NbDialogModule.forChild(),
  NbWindowModule.forChild(),
  NbCardModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbPopoverModule,
  NbButtonModule,
  NbInputModule,
  NbSelectModule,
  NbTooltipModule,
];

@NgModule({
  imports: [
    NbTreeGridModule,
    NbIconModule,
    MODULES,
    AngularMaterialModule,
    PaginatorModule
  ],
  declarations: [
    TitlesComponent,
    TitleDialogComponent
  ],
})
export class TitlesModule { }
