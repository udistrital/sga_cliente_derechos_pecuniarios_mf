import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListPeriodoComponent } from "./periodo/list-periodo/list-periodo.component";
import { CrudPeriodoComponent } from "./periodo/crud-periodo/crud-periodo.component";

const routes: Routes = [
  {
    path: "list-periodo",
    component: ListPeriodoComponent
//    canActivate: [AuthGuard],
  },
  {
    path: "crud-periodo",
    component: CrudPeriodoComponent
//    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/periodo/" }],
})
export class AppRoutingModule {}
