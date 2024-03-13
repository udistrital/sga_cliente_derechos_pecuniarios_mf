import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Concepto } from 'src/data/models/concepto';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { ParametrosService } from 'src/data/services/parametros.service';
import { ConceptoPut } from 'src/data/models/concepto-put';
import { ConceptoPost } from 'src/data/models/concepto-post';
import { DialogoConceptosComponent } from '../dialogo-conceptos/dialogo-conceptos.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SgaDerechoPecunarioMidService } from 'src/data/services/sga_derecho_pecunario_mid.service';

@Component({
  selector: 'definir-conceptos',
  templateUrl: './definir-conceptos.component.html',
  styleUrls: ['../derechos-pecuniarios.component.scss'],
})
export class DefinirConceptosComponent implements OnInit, OnChanges {
  vigencias: any[];
  tablaConceptos: any;
  salario: string;
  salarioValor: number;
  vigenciaActual: FormControl;
  guardable: boolean = false;
  loading: boolean = false;

  @Input()
  mostrarCalcular: boolean = false;

  @Input()
  datosCargados: Concepto[] = [];

  dataSource: MatTableDataSource<Concepto>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = [
    'Id',
    'Codigo',
    'Nombre',
    'Factor',
    'Costo',
    'acciones',
  ];
  nombresColumnas = [];

  mostrarTabla: boolean = false;

  constructor(
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private dialog: MatDialog,
    private parametrosService: ParametrosService,
    private activatedRoute: ActivatedRoute,
    private sgaDerechoPecunarioMidService: SgaDerechoPecunarioMidService
  ) {
    this.vigenciaActual = new FormControl('');
    this.nombresColumnas['Id'] = 'derechos_pecuniarios.id';
    this.nombresColumnas['Codigo'] = 'derechos_pecuniarios.codigo';
    this.nombresColumnas['Nombre'] = 'derechos_pecuniarios.nombre';
    this.nombresColumnas['Factor'] = 'derechos_pecuniarios.factor';
    this.nombresColumnas['Costo'] = 'derechos_pecuniarios.costo';
    this.nombresColumnas['acciones'] = 'GLOBAL.acciones';
  }

  ngOnInit() {
    this.parametrosService
      .get('periodo?query=CodigoAbreviacion:VG&limit=0&sortby=Id&order=desc')
      .subscribe(
        (response) => {
          this.vigencias = response['Data'];
          this.activatedRoute.paramMap.subscribe((params) => {
            if (params.get('Id') !== null) {
              this.vigenciaActual.setValue(parseInt(params.get('Id')));
              this.cargarSalario();
            }
          });
        },
        () => {
          this.popUpManager.showErrorAlert(
            this.translate.instant('ERROR.general')
          );
        }
      );
  }

  ngOnChanges() {
    this.cargarDatosTabla(this.datosCargados);
  }

  cargarDatosTabla(datosCargados: Concepto[]) {
    this.mostrarTabla = datosCargados.length > 0;

    this.dataSource = new MatTableDataSource(datosCargados);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  calcularValores() {
    if (this.datosCargados.length === 0) {
      this.popUpManager.showAlert(
        this.translate.instant('GLOBAL.info'),
        this.translate.instant('derechos_pecuniarios.no_conceptos_valores')
      );
    } else {
      const totalConcepto = this.datosCargados.length;
      const datosAntiguos = [];
      const smldv = this.salarioValor / 30;
      for (let i = 0; i < totalConcepto; i++) {
        datosAntiguos[i] = this.datosCargados[i];
        switch (this.datosCargados[i].Codigo) {
          case '43':
            this.datosCargados[i].Costo =
              Math.round(
                (this.salarioValor * this.datosCargados[i].Factor) / 100
              ) * 100;
            break;
          case '15':
            this.datosCargados[i].Costo =
              Math.round((smldv * this.datosCargados[i].Factor) / 50) * 50;
            break;
          default:
            this.datosCargados[i].Costo =
              Math.round((smldv * this.datosCargados[i].Factor) / 100) * 100;
        }
        this.cargarDatosTabla(this.datosCargados);
      }
      this.guardable = true;
    }
  }

  guardarValores() {
    if (this.datosCargados.length === 0) {
      this.popUpManager.showAlert(
        this.translate.instant('GLOBAL.info'),
        this.translate.instant('derechos_pecuniarios.no_conceptos_valores')
      );
    } else {
      this.popUpManager
        .showConfirmAlert(
          this.translate.instant('derechos_pecuniarios.confirmar_guardar')
        )
        .then((willSave) => {
          if (willSave.value) {
            this.loading = true;
            this.sgaDerechoPecunarioMidService
              .post(
                'derechos-pecuniarios/conceptos/costo/',
                this.datosCargados
              )
              .subscribe(
                () => {
                  this.guardable = false;
                  this.loading = false;
                  this.popUpManager.showSuccessAlert(
                    this.translate.instant(
                      'derechos_pecuniarios.registro_costo'
                    )
                  );
                },
                () => {
                  this.popUpManager.showErrorAlert(
                    this.translate.instant(
                      'derechos_pecuniarios.error_registro_costo'
                    )
                  );
                }
              );
          }
        });
    }
  }

  cargarSalario() {
    this.parametrosService
      .get(
        'parametro_periodo?limit=0&query=PeriodoId__Id:' +
          this.vigenciaActual.value
      )
      .subscribe(
        (response) => {
          const data: any[] = response['Data'];
          if (Object.keys(data[0]).length > 0) {
            const conceptoSalario = data.filter(
              (obj) => obj['ParametroId']['TipoParametroId']['Id'] === 1
            )[0]; // identificador de Salario Minimo
            this.salarioValor = JSON.parse(conceptoSalario['Valor']).Valor; // puede cambiar
            this.salario = this.salarioValor.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
            });
          } else {
            this.salarioValor = 0;
            this.salario = '';
            this.popUpManager.showErrorAlert(
              this.translate.instant('derechos_pecuniarios.no_salario')
            );
          }
        },
        () => {
          this.salarioValor = 0;
          this.salario = '';
          this.popUpManager.showErrorAlert(
            this.translate.instant('ERROR.general')
          );
        }
      );

    this.datosCargados = [];
    this.sgaDerechoPecunarioMidService
      .get('derechos-pecuniarios/vigencias/' + this.vigenciaActual.value)
      .subscribe(
        (response) => {
          const data: any[] = response.data;
          if (Object.keys(data).length > 0 && Object.keys(data[0]).length > 0) {
            data.forEach((obj) => {
              const concepto = new Concepto();
              concepto.Id = obj.ParametroId.Id;
              concepto.Codigo = obj.ParametroId.CodigoAbreviacion;
              concepto.Nombre = obj.ParametroId.Nombre;
              concepto.FactorId = obj.Id;
              concepto.Factor = JSON.parse(obj.Valor).NumFactor;
              if (JSON.parse(obj.Valor).Costo !== undefined) {
                concepto.Costo = JSON.parse(obj.Valor).Costo;
              }
              this.datosCargados.push(concepto);
            });
          } else {
            this.popUpManager.showAlert(
              'info',
              this.translate.instant('derechos_pecuniarios.no_conceptos')
            );
          }
          this.cargarDatosTabla(this.datosCargados);
        },
        () => {
          this.popUpManager.showErrorAlert(
            this.translate.instant('ERROR.general')
          );
        }
      );
  }

  agregarConcepto() {
    const configDialogo = new MatDialogConfig();
    configDialogo.width = '900px';
    configDialogo.height = '350px';
    const conceptoDialogo = this.dialog.open(
      DialogoConceptosComponent,
      configDialogo
    );
    conceptoDialogo.afterClosed().subscribe((concepto: Concepto) => {
      if (concepto !== undefined) {
        const nuevoConcepto = new ConceptoPost();
        nuevoConcepto.Concepto = {
          Nombre: concepto.Nombre,
          CodigoAbreviacion: concepto.Codigo.toString(),
          Activo: true,
          TipoParametroId: { Id: 2 }, // Identificador que agrupa los parametros de derechos pecuniarios
        };
        nuevoConcepto.Factor = {
          Valor: { NumFactor: concepto.Factor },
        };
        nuevoConcepto.Vigencia = {
          Id: this.vigenciaActual.value,
        };
        this.sgaDerechoPecunarioMidService
          .post('derechos-pecuniarios/conceptos/', nuevoConcepto)
          .subscribe(
            (response) => {
              concepto.Id = response['Data']['Concepto']['Id'];
              concepto.FactorId = response['Data']['Factor']['Id'];
              this.datosCargados.push(concepto);
              this.cargarDatosTabla(this.datosCargados);
              this.popUpManager.showSuccessAlert(
                this.translate.instant('derechos_pecuniarios.concepto_exito')
              );
            },
            () => {
              this.popUpManager.showErrorAlert(
                this.translate.instant('ERROR.general')
              );
            }
          );
      }
    });
  }

  editarConcepto(data: Concepto) {
    const configDialogo = new MatDialogConfig();
    configDialogo.width = '900px';
    configDialogo.height = '350px';
    configDialogo.data = data;
    const conceptoDialogo = this.dialog.open(
      DialogoConceptosComponent,
      configDialogo
    );
    conceptoDialogo.afterClosed().subscribe((concepto: Concepto) => {
      if (concepto !== undefined) {
        const updateConcepto = new ConceptoPut();
        updateConcepto.Concepto = {
          Id: concepto.Id,
          Nombre: concepto.Nombre,
          CodigoAbreviacion: concepto.Codigo,
          Activo: true,
          TipoParametroId: { Id: 2 }, // Identificador que agrupa los parametros de derechos pecuniarios
        };
        updateConcepto.Factor = {
          Id: configDialogo.data.FactorId,
          Valor: { NumFactor: concepto.Factor },
        };
        updateConcepto.Vigencia = {
          Id: this.vigenciaActual.value,
        };
        this.sgaDerechoPecunarioMidService
          .put('derechos-pecuniarios/conceptos/' + data.Id, updateConcepto)
          .subscribe(
            () => {
              this.popUpManager.showSuccessAlert(
                this.translate.instant('derechos_pecuniarios.actualizado')
              );
              this.cargarSalario();
            },
            () => {
              this.popUpManager.showErrorAlert(
                this.translate.instant('ERROR.general')
              );
            }
          );
      }
    });
  }

  inactivarConcepto(data: Concepto) {
    this.popUpManager
      .showConfirmAlert(
        this.translate.instant('derechos_pecuniarios.inactivar_concepto')
      )
      .then((willDelete) => {
        if (willDelete.value) {
          this.sgaDerechoPecunarioMidService
            .delete('derechos-pecuniarios/conceptos', data.Id.toString())
            .subscribe(
              () => {
                this.popUpManager.showSuccessAlert(
                  this.translate.instant('derechos_pecuniarios.inactivo')
                );
                this.cargarSalario();
              },
              () => {
                this.popUpManager.showErrorAlert(
                  this.translate.instant('ERROR.general')
                );
              }
            );
        }
      });
  }

  formatearPrecio(precio: number): string {
    return precio != null
      ? precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
      : '';
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
