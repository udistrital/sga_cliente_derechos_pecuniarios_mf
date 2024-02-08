import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultarConceptosComponent } from './consultar-conceptos/consultar-conceptos.component';
import { DerechosPecuniariosComponent } from './derechos-pecuniarios.component';

const routes: Routes = [{
    path: '',
    component: DerechosPecuniariosComponent,
    children: [
        {
            path: 'consultar-conceptos',
            component: ConsultarConceptosComponent,
//            canActivate: [AuthGuard],
        },
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
]
