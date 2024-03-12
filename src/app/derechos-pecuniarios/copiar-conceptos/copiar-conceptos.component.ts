import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { Concepto } from 'src/data/models/concepto';
import { ParametrosService } from 'src/data/services/parametros.service';
import { SgaMidService } from 'src/data/services/sga_mid.service';

@Component({
  selector: 'copiar-conceptos',
  templateUrl: './copiar-conceptos.component.html',
  styleUrls: ['../derechos-pecuniarios.component.scss'],
})
export class CopiarConceptosComponent implements OnInit {
  vigenciaElegida: FormControl;
  vigencias: any[];
  tablaConceptos: any;

  dataSource: MatTableDataSource<Concepto>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = ['Codigo', 'Nombre', 'Factor'];
  nombresColumnas = []

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private parametrosService: ParametrosService,
    private sgaMidService: SgaMidService,
    private popUpManager: PopUpManager,
  ) {
    this.vigenciaElegida = new FormControl('');
    this.nombresColumnas["Codigo"] = "derechos_pecuniarios.codigo";
    this.nombresColumnas["Nombre"] = "derechos_pecuniarios.nombre";
    this.nombresColumnas["Factor"] = "derechos_pecuniarios.factor";
  }

  ngOnInit() {
    this.parametrosService
      .get('periodo?query=CodigoAbreviacion:VG&limit=0&sortby=Id&order=desc')
      .subscribe(
        response => {
          this.vigencias = response['Data'];
        },
        error => {
          this.popUpManager.showErrorAlert(
            this.translate.instant('ERROR.general'),
          );
        },
      );
  }

  copiarConceptos() {
    // copiar conceptos
    // redirige a la de definir con los datos copiados
    const vigenciaClonar = {
      VigenciaActual: this.vigencias.filter(vig => vig.Activo === true)[0].Id,
      VigenciaAnterior: this.vigenciaElegida.value,
    };
//CAMBIAR 
    this.sgaMidService
      .post('derechos_pecuniarios/clonar', vigenciaClonar)
      .subscribe(
        () => {
          this.router.navigate(
            ['../definir-conceptos', { Id: vigenciaClonar.VigenciaActual }],
            { relativeTo: this.route },
          );
        },
        () => {
          this.popUpManager.showErrorAlert(
            this.translate.instant('ERROR.general'),
          );
        },
      );
  }

  cambiarVigencia() {
    let datosCargados: Concepto[] = [];
    //CAMBIAR
    this.sgaMidService
      .get('derechos_pecuniarios/' + this.vigenciaElegida.value)
      .subscribe(
        response => {
          const data: any[] = response.Data;
          if (Object.keys(data).length > 0 && Object.keys(data[0]).length > 0) {
            data.forEach(obj => {
              const concepto = new Concepto();
              concepto.Id = obj.ParametroId.Id;
              concepto.Codigo = obj.ParametroId.CodigoAbreviacion;
              concepto.Nombre = obj.ParametroId.Nombre;
              concepto.Factor = JSON.parse(obj.Valor).NumFactor;
              datosCargados.push(concepto);
            });

            this.dataSource = new MatTableDataSource(datosCargados);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this.popUpManager.showAlert(
              'info',
              this.translate.instant('derechos_pecuniarios.no_conceptos'),
            );
          }
        },
        () => {
          this.popUpManager.showErrorAlert(
            this.translate.instant('ERROR.general'),
          );
        },
      );
  }
}
