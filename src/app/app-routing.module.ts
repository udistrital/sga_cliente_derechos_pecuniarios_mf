import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmptyRouteComponent } from "./empty-route/empty-route.component";

export const routes: Routes = [
  {
    path: 'empty-route',
    component: EmptyRouteComponent
  },
  {
    path: '',
    loadChildren: () => import ('./derechos-pecuniarios/derechos-pecuniarios.module').then(m => m.DerechosPecuniariosModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/derechos-pecuniarios/" }],
})
export class AppRoutingModule {}
