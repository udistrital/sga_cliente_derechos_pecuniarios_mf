import { NgModule } from '@angular/core';
import { DerechosPecuniariosComponent } from './derechos-pecuniarios.component';
import { DerechosPecuniariosRoutingComponent, routedComponents } from './derechos-pecuniarios-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultarConceptosComponent } from './consultar-conceptos/consultar-conceptos.component';
import { PopUpManager } from '../managers/popup_manager';
import { ParametrosService } from 'src/data/services/parametros.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../utils/custom-mat-paginator-intl';
import { CrudDerechosPecuniariosComponent } from './crud-derechos-pecuniarios/crud-derechos-pecuniarios.component';
import { ListDerechosPecuniariosComponent } from './list-derechos-pecuniarios/list-derechos-pecuniarios.component';
import { CopiarConceptosComponent } from './copiar-conceptos/copiar-conceptos.component';
import { DefinirConceptosComponent } from './definir-conceptos/definir-conceptos.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GeneracionRecibosDerechosPecuniarios } from './generacion-recibos-derechos-pecuniarios/generacion-recibos-derechos-pecuniarios.component';
import { DocumentoService } from 'src/data/services/documento.service';
import { NewNuxeoService } from 'src/data/services/new_nuxeo.service';
import { ConsultarSolicitudesDerechosPecuniarios } from './consultar-solicitudes/consultar-solicitudes.component';

@NgModule({
  declarations: [
    routedComponents,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DerechosPecuniariosRoutingComponent,
  ],
  exports: [
    DerechosPecuniariosComponent,
    ConsultarConceptosComponent,
    CrudDerechosPecuniariosComponent,
    ListDerechosPecuniariosComponent,
    CopiarConceptosComponent,
    DefinirConceptosComponent,
    GeneracionRecibosDerechosPecuniarios,
    ConsultarSolicitudesDerechosPecuniarios
  ],
  providers: [
    PopUpManager,
    ParametrosService,
    NewNuxeoService,
    DocumentoService,
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    }
  ],
})
export class DerechosPecuniariosModule { }
