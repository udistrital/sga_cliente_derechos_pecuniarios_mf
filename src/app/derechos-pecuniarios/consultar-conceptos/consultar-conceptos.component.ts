import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { Concepto } from 'src/data/models/concepto';
import { ParametrosService } from 'src/data/services/parametros.service';
import { SgaMidService } from 'src/data/services/sga_mid.service';

@Component({
  selector: 'consultar-conceptos',
  templateUrl: './consultar-conceptos.component.html',
  styleUrls: ['../derechos-pecuniarios.component.scss']
})
export class ConsultarConceptosComponent implements OnInit {

  vigencias: any[];
  vigenciaActual: number;

  dataSource: MatTableDataSource<Concepto>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = ['Codigo', 'Nombre', 'Factor', 'Costo'];
  nombresColumnas = []

  constructor(
    private translate: TranslateService,
    private parametrosService: ParametrosService,
    private popUpManager: PopUpManager,
    private sgaMidService: SgaMidService,
    ) {
      this.nombresColumnas["Codigo"] = "derechos_pecuniarios.codigo";
      this.nombresColumnas["Nombre"] = "derechos_pecuniarios.nombre";
      this.nombresColumnas["Factor"] = "derechos_pecuniarios.factor";
      this.nombresColumnas["Costo"] = "derechos_pecuniarios.costo";
  }

  ngOnInit() {
    this.parametrosService.get('periodo?query=CodigoAbreviacion:VG&limit=0&sortby=Id&order=desc').subscribe(
      response => {
        this.vigencias = response["Data"];
      },
      () => {
        this.popUpManager.showErrorAlert(this.translate.instant('ERROR.general'));
      },
    );
  }

  cargarDatos(event) {
    this.vigenciaActual = event.value;
    let datosCargados = [];
    this.sgaMidService.get('derechos_pecuniarios/' + this.vigenciaActual).subscribe(
      response => {
        var data: any[] = response.Data;
        if (Object.keys(data).length > 0 && Object.keys(data[0]).length > 0) {
          data.forEach(obj => {
            var concepto = new Concepto();
            concepto.Id = obj.ParametroId.Id;
            concepto.Codigo = obj.ParametroId.CodigoAbreviacion;
            concepto.Nombre = obj.ParametroId.Nombre;
            concepto.FactorId = obj.Id
            concepto.Factor = JSON.parse(obj.Valor).NumFactor;
            if (JSON.parse(obj.Valor).Costo !== undefined) {
              concepto.Costo = JSON.parse(obj.Valor).Costo;
            }
            datosCargados.push(concepto);
          });

          this.dataSource = new MatTableDataSource(datosCargados);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.popUpManager.showAlert('info', this.translate.instant('derechos_pecuniarios.no_conceptos'));
        }
      },
      () => {
        this.popUpManager.showErrorAlert(this.translate.instant('ERROR.general'));
      },
    );
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CO', {style: 'currency', currency: 'COP'});
  }

}
