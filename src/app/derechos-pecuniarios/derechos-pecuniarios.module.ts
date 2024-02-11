import { NgModule } from '@angular/core';
import { DerechosPecuniariosComponent } from './derechos-pecuniarios.component';
import { DerechosPecuniariosRoutingComponent, routedComponents } from './derechos-pecuniarios-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultarConceptosComponent } from './consultar-conceptos/consultar-conceptos.component';
import { PopUpManager } from '../managers/popup_manager';
import { ParametrosService } from 'src/data/services/parametros.service';
import { SgaMidService } from 'src/data/services/sga_mid.service';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CustomMatPaginatorIntl } from '../utils/custom-mat-paginator-intl';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    routedComponents,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    DerechosPecuniariosRoutingComponent,
  ],
  exports: [
    DerechosPecuniariosComponent,
    ConsultarConceptosComponent,
  ],
  providers: [
    PopUpManager,
    ParametrosService,
    SgaMidService,
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    }
  ],
})
export class DerechosPecuniariosModule { }
