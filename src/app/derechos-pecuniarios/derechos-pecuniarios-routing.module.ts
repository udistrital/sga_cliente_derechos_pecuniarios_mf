import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultarConceptosComponent } from './consultar-conceptos/consultar-conceptos.component';
import { DerechosPecuniariosComponent } from './derechos-pecuniarios.component';
import { CrudDerechosPecuniariosComponent } from './crud-derechos-pecuniarios/crud-derechos-pecuniarios.component';
import { CopiarConceptosComponent } from './copiar-conceptos/copiar-conceptos.component';
import { DefinirConceptosComponent } from './definir-conceptos/definir-conceptos.component';
import { DialogoConceptosComponent } from './dialogo-conceptos/dialogo-conceptos.component';
import { ListDerechosPecuniariosComponent } from './list-derechos-pecuniarios/list-derechos-pecuniarios.component';
import { AuthGuard } from 'src/_guards/auth.guard';
import { GeneracionRecibosDerechosPecuniarios } from './generacion-recibos-derechos-pecuniarios/generacion-recibos-derechos-pecuniarios.component';
import { ConsultarSolicitudesDerechosPecuniarios } from './consultar-solicitudes/consultar-solicitudes.component';

const routes: Routes = [{
    path: '',
    component: DerechosPecuniariosComponent,
    children: [
        {
            path: 'conceptos',
            canActivate: [AuthGuard],
            component: ConsultarConceptosComponent,
        },
        {
            path: 'conceptos/definir',
            canActivate: [AuthGuard],
            component: DefinirConceptosComponent,
        },
        {
            path: 'crud-derechos-pecuniarios',
            canActivate: [AuthGuard],
            component: CrudDerechosPecuniariosComponent,
        },
        {
            path: 'copiar-conceptos',
            canActivate: [AuthGuard],
            component: CopiarConceptosComponent,
        },
        
        {
            path: 'lista',
            canActivate: [AuthGuard],
            component: ListDerechosPecuniariosComponent,
        },
        {
            path: 'generar-recibo',
            canActivate: [AuthGuard],
            component: GeneracionRecibosDerechosPecuniarios,
        },
        {
            path: 'solicitudes',
            canActivate: [AuthGuard],
            component: ConsultarSolicitudesDerechosPecuniarios,
        }
    ],
}];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ],
})
export class DerechosPecuniariosRoutingComponent { }

export const routedComponents = [
    DerechosPecuniariosComponent,
    ConsultarConceptosComponent,
    CrudDerechosPecuniariosComponent,
    CopiarConceptosComponent,
    DefinirConceptosComponent,
    DialogoConceptosComponent,
    ListDerechosPecuniariosComponent,
    GeneracionRecibosDerechosPecuniarios,
    ConsultarSolicitudesDerechosPecuniarios
]
