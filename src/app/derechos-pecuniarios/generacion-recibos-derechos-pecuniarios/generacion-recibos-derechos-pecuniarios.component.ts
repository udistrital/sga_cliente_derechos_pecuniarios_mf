import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import * as momentTimezone from 'moment-timezone';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReciboPago } from 'src/data/models/recibo_pago';
import { Periodo } from 'src/data/models/periodo';
import { InstitucionEnfasis } from 'src/data/models/institucion_enfasis';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { NewNuxeoService } from 'src/data/services/new_nuxeo.service';
import { UserService } from 'src/data/services/users.service';
import { ParametrosService } from 'src/data/services/parametros.service';
import { InfoPersona } from 'src/data/models/info_persona';
import { Concepto } from 'src/data/models/concepto';
import { DialogoDocumentosComponent } from 'src/app/dialogo-documentos/dialogo-documentos.component';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SgaDerechoPecunarioMidService } from 'src/data/services/sga_derecho_pecunario_mid.service';
import { SgaInscripcionMidService } from 'src/data/services/sga_inscripcion_mid.service';

@Component({
  selector: 'generacion-recibos-derechos-pecuniarios',
  templateUrl: './generacion-recibos-derechos-pecuniarios.component.html',
  styleUrls: ['./generacion-recibos-derechos-pecuniarios.component.scss'],
})
export class GeneracionRecibosDerechosPecuniarios {
  info_persona_id: number;
  persona_id: number;
  recibo_id: number;
  data: any[] = [];
  vigencias: any = [];
  vigenciaActual: any;
  conceptos: any[];

  new_pecuniario = false;
  info_info_persona: any;
  recibo_pago: ReciboPago;
  clean: boolean;
  estudiante: number;
  periodo: Periodo;
  periodos = [];
  selectedProject: any;
  tipo_derecho_selected: any;
  calendarioId: string = '0';
  parametro: string;
  recibo_generado: any;
  recibos_pendientes: number;
  parametros_pago: any;
  userData: any = null;

  arr_proyecto: InstitucionEnfasis[] = [];
  proyectos = [];

  CampoControl = new FormControl('', [Validators.required]);
  Campo1Control = new FormControl('', [Validators.required]);
  Campo2Control = new FormControl('', [Validators.required]);
  gen_recibo: boolean;
  generacion_recibo = null;
  formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = [
    'Periodo',
    'Id',
    'FechaCreacion',
    'Valor',
    'Concepto',
    'FechaOrdinaria',
    'ValorPagado',
    'FechaPago',
    'Estado',
    'VerRecibo',
    'Pagar',
    'AdjuntarPago',
    'Solicitar',
    'VerRespuesta',
  ];
  priceColumns: string[] = ['Valor', 'ValorPagado'];
  actionColumns: string[] = [
    'VerRecibo',
    'Pagar',
    'AdjuntarPago',
    'Solicitar',
    'VerRespuesta',
  ];
  nombresColumnas = [];

  constructor(
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private nuxeo: NewNuxeoService,
    private dialog: MatDialog,
    private userService: UserService,
    private parametrosService: ParametrosService,
    private sgaDerechoPecunarioMidService: SgaDerechoPecunarioMidService,
    private sgaInscripcionMidService:SgaInscripcionMidService
  ) {
    this.nombresColumnas['Periodo'] = 'derechos_pecuniarios.periodo';
    this.nombresColumnas['Id'] = 'derechos_pecuniarios.id';
    this.nombresColumnas['FechaCreacion'] =
      'derechos_pecuniarios.fecha_generacion';
    this.nombresColumnas['Valor'] = 'derechos_pecuniarios.valor';
    this.nombresColumnas['Concepto'] = 'derechos_pecuniarios.concepto';
    this.nombresColumnas['FechaOrdinaria'] =
      'derechos_pecuniarios.fecha_ordinaria';
    this.nombresColumnas['ValorPagado'] = 'derechos_pecuniarios.valor_pagado';
    this.nombresColumnas['FechaPago'] = 'derechos_pecuniarios.fecha_pago';
    this.nombresColumnas['Estado'] = 'derechos_pecuniarios.estado';
    this.nombresColumnas['VerRecibo'] = 'derechos_pecuniarios.ver_recibo';
    this.nombresColumnas['Pagar'] = 'derechos_pecuniarios.pagar';
    this.nombresColumnas['AdjuntarPago'] = 'derechos_pecuniarios.adjuntar_pago';
    this.nombresColumnas['Solicitar'] = 'derechos_pecuniarios.solicitar';
    this.nombresColumnas['VerRespuesta'] = 'derechos_pecuniarios.ver_respuesta';

    this.generacion_recibo = {
      code: '* Códígo seleccionado',
      documentId: '* Documento de identificacion',
      username: '* Nombre de estudiante',
      curricularProgram: '* Programa curricular',
      concept: '* Concepto del derecho pecuniario elegido',
      value: '* Valor del derecho elegido',
    };

    this.info_persona_id = this.userService.getPersonaId();
    this.userService.tercero$.subscribe((user) => {
      this.userData = user;
    });
    this.loadInfoPersona();
  }

  return() {
    sessionStorage.setItem('EstadoRecibo', 'false');
  }

  public cargarDatosTabla(datos): void {
    this.dataSource = new MatTableDataSource(datos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public async loadInfoPersona(): Promise<void> {
    this.info_persona_id = await this.userService.getPersonaId();
    if (
      this.info_persona_id !== undefined &&
      this.info_persona_id !== 0 &&
      this.info_persona_id.toString() !== '' &&
      this.info_persona_id.toString() !== '0'
    ) {
      this.sgaDerechoPecunarioMidService
        .get('derechos-pecuniarios/personas/' + this.info_persona_id)
        .subscribe(
          async (res: any) => {
            if (res.success) {
              const temp = <InfoPersona>res.data;
              this.info_info_persona = temp;
              const files = [];
            }
            await this.cargarPeriodo();
            this.loadInfoRecibos();
          },
          (error: HttpErrorResponse) => {
            this.popUpManager.showErrorAlert(
              this.translate.instant('ERROR.' + error.status),
              this.translate.instant('GLOBAL.cargar') +
                '-' +
                this.translate.instant('GLOBAL.info_persona')
            );
          }
        );
    } else {
      this.info_info_persona = undefined;
      this.clean = !this.clean;
      this.popUpManager.showAlert(
        this.translate.instant('GLOBAL.info'),
        this.translate.instant('GLOBAL.no_info_persona')
      );
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
    this.parametros_pago = {
      recibo: '',
      REFERENCIA: '',
      NUM_DOC_IDEN: '',
      TIPO_DOC_IDEN: '',
    };

    this.selectedProject = parseInt(
      sessionStorage.getItem('ProgramaAcademicoId'),
      10
    );
  }

  async loadInfoRecibos() {
    // Función del MID que retorna el estado del recibo
    const PeriodoActual = localStorage.getItem('IdPeriodo');

    this.cargarDatosTabla([]);
    if (this.info_persona_id != null && PeriodoActual != null) {
      this.sgaDerechoPecunarioMidService
        .get(
          `derechos-pecuniarios/personas/${this.info_persona_id}/periodos/${PeriodoActual}/recibos`
        )
        .subscribe(
          (response: any) => {
            if (!response.success) {
              this.popUpManager.showErrorToast(
                this.translate.instant('derechos_pecuniarios.error')
              );
              this.cargarDatosTabla([]);
            } else if (!response.success) {
              this.popUpManager.showAlert(
                this.translate.instant('GLOBAL.info'),
                this.translate.instant('derechos_pecuniarios.no_recibo')
              );
              this.cargarDatosTabla([]);
            } else {
              const data = <Array<any>>response.data;
              console.log(response)
              console.log(data)
              const dataInfo = <Array<any>>[];
              this.recibos_pendientes = 0;
              data.forEach((element) => {
                const docRespuesta = element.VerRespuesta;

                element.VerRecibo = {
                  icon: 'visibility',
                  label: 'Visualizar recibo',
                  class: 'icon-primary',
                };

                element.Pagar = {
                  icon: 'credit_card',
                  label: 'Pago en línea',
                  class: 'icon-primary',
                };

                element.AdjuntarPago = {
                  icon: 'attach_money',
                  label: 'Adjuntar',
                  class: 'icon-primary',
                };

                element.Solicitar = {
                  icon: 'share',
                  label: 'Solicitar',
                  class: 'icon-primary',
                };

                element.VerRespuesta = {
                  icon: 'preview',
                  label: 'Descargar',
                  class: 'icon-primary',
                  documento: docRespuesta,
                };

                element.Pagar.disabled = true;
                element.AdjuntarPago.disabled = true;
                element.Solicitar.disabled = true;
                element.VerRespuesta.disabled = true;

                switch (element.Estado) {
                  case 'Pago':
                    delete element.Solicitar.disabled;
                    break;
                  case 'Pendiente pago':
                    delete element.Pagar.disabled;
                    delete element.AdjuntarPago.disabled;
                    break;
                  case 'Ejecutada':
                    delete element.VerRespuesta.disabled;
                    break;
                }

                element.FechaCreacion = momentTimezone
                  .tz(element.FechaCreacion, 'America/Bogota')
                  .format('YYYY-MM-DD');
                element.FechaOrdinaria = momentTimezone
                  .tz(element.FechaOrdinaria, 'America/Bogota')
                  .format('YYYY-MM-DD');
                if (element.FechaPago) {
                  element.FechaPago = momentTimezone
                    .tz(element.FechaPago, 'America/Bogota')
                    .format('YYYY-MM-DD');
                }

                dataInfo.push(element);
              });
              this.cargarDatosTabla(dataInfo);
            }
          },
          () => {
            this.popUpManager.showErrorToast(
              this.translate.instant('ERROR.general')
            );
          }
        );
    }
  }

  generar_recibo() {
    if (this.recibos_pendientes >= 3) {
      this.popUpManager.showErrorAlert(
        this.translate.instant('recibo_pago.maximo_recibos')
      );
    } else {
      this.popUpManager
        .showConfirmAlert(
          this.translate.instant('derechos_pecuniarios.seguro_nuevo_recibo')
        )
        .then(async (ok) => {
          if (ok.value) {
            const recibo = {
              Id: this.info_info_persona.Id,
              Nombre: `${this.info_info_persona.PrimerNombre}${this.info_info_persona.SegundoNombre}`,
              Apellido: `${this.info_info_persona.PrimerApellido}${this.info_info_persona.SegundoApellido}`,
              Correo: JSON.parse(
                atob(localStorage.getItem('id_token').split('.')[1])
              ).email,
              ProgramaAcademicoId: this.generacion_recibo.IdProyecto,
              DerechoPecuniarioId: this.generacion_recibo.DerechoPecuniarioId,
              CodigoEstudiante: this.generacion_recibo.CodigoEstudiante,
              Year: this.periodo.Year,
              Periodo: this.periodo.Id,
              FechaPago: '',
            };
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + 90);
            recibo.FechaPago = moment(
              `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`,
              'YYYY-MM-DD'
            ).format('DD/MM/YYYY');
            this.sgaDerechoPecunarioMidService
              .post('derechos-pecuniarios/derechos', recibo)
              .subscribe(
                (response: any) => {
                  if (response.status === 200) {
                    this.loadInfoRecibos();
                    this.popUpManager.showSuccessAlert(
                      this.translate.instant('recibo_pago.generado')
                    );
                    this.new_pecuniario = false;
                    this.gen_recibo = false;
                  } else if (response.status === 204) {
                    this.popUpManager.showErrorAlert(
                      this.translate.instant('recibo_pago.recibo_duplicado')
                    );
                  } else if (response.status === 404) {
                    this.popUpManager.showErrorToast(
                      this.translate.instant('recibo_pago.no_generado')
                    );
                  }
                },
                (error: HttpErrorResponse) => {
                  this.popUpManager.showErrorToast(
                    this.translate.instant(`ERROR.${error.status}`)
                  );
                }
              );
          }
        });
    }
  }

  descargarReciboPago(data) {
    if (this.info_info_persona != null) {
      this.selectedProject = parseInt(
        sessionStorage.getItem('ProgramaAcademicoId'),
        10
      );
      this.recibo_pago = new ReciboPago();
      this.recibo_pago.NombreDelEstudiante =
        this.info_info_persona.PrimerNombre +
        ' ' +
        this.info_info_persona.SegundoNombre +
        ' ' +
        this.info_info_persona.PrimerApellido +
        ' ' +
        this.info_info_persona.SegundoApellido;
      this.recibo_pago.Periodo = this.periodo.Nombre;
      this.recibo_pago.Comprobante = data.Id;

      this.recibo_pago.ProyectoEstudiante = data.ProgramaAcademico;
      this.recibo_pago.Descripcion = data.Concepto;
      this.recibo_pago.DocumentoDelEstudiante = data.Cedula_estudiante;

      this.recibo_pago.Codigo = data.Codigo;
      this.recibo_pago.CodigoDelEstudiante = data.Codigo_estudiante;
      this.recibo_pago.ValorDerecho = parseInt(data.Valor);
      this.recibo_pago.Fecha_pago = moment(
        data.FechaOrdinaria,
        'YYYY-MM-DD'
      ).format('DD/MM/YYYY');
      // this.sgaMidService.post('generar_recibo/recibo_estudiante/', this.recibo_pago)
      this.sgaInscripcionMidService
        .post('recibos/estudiantes/', this.recibo_pago)
        .subscribe(
          (response) => {
            const reciboData = new Uint8Array(
              atob(response['data'])
                .split('')
                .map((char) => char.charCodeAt(0))
            );
            this.recibo_generado = window.URL.createObjectURL(
              new Blob([reciboData], { type: 'application/pdf' })
            );
            window.open(this.recibo_generado);
          },
          (error) => {
            this.popUpManager.showErrorToast(
              this.translate.instant('recibo_pago.no_generado')
            );
          }
        );
    }
  }

  abrirPago(data) {
    this.parametros_pago.NUM_DOC_IDEN =
      this.info_info_persona.NumeroIdentificacion;
    this.parametros_pago.REFERENCIA = data.Id;
    this.parametros_pago.TIPO_DOC_IDEN =
      this.info_info_persona.TipoIdentificacion.CodigoAbreviacion;
    const url = new URLSearchParams(this.parametros_pago).toString();
    const ventanaPSE = window.open(
      environment.PSE_SERVICE + url,
      'PagosPSE',
      'width=600,height=800,resizable,scrollbars,status'
    );
    ventanaPSE.focus();
    const timer = window.setInterval(() => {
      if (ventanaPSE.closed) {
        window.clearInterval(timer);
        this.loadInfoRecibos();
      }
    }, 5000);
  }

  cargarPeriodo() {
    this.vigencias = [];

    return new Promise((resolve, reject) => {
      this.parametrosService
        .get(
          'periodo?query=Activo:true,CodigoAbreviacion:VG&sortby=Id&order=desc&limit=0'
        )
        .subscribe(
          (res) => {
            const r = <any>res;
            if (res !== null && r.Status === '200') {
              const periodos = <any[]>res['Data'];
              periodos.forEach((element) => {
                this.periodo = element;
                window.localStorage.setItem(
                  'IdPeriodo',
                  String(this.periodo['Id'])
                );
                this.vigenciaActual = this.periodo.Id;

                resolve(this.periodo);
                this.vigencias.push(element);
              });
            }
          },
          (error: HttpErrorResponse) => {
            reject([]);
          }
        );
    });
  }

  cargarDatos(event) {
    this.generacion_recibo.curricularProgram = event.value.Proyecto.slice(28);
    this.generacion_recibo.CodigoEstudiante = event.value.Dato;
    this.generacion_recibo.IdProyecto = event.value.IdProyecto;
    this.generacion_recibo.code = '* Códígo seleccionado';
    this.generacion_recibo.concept =
      '* Concepto del derecho pecuniario elegido';
    this.generacion_recibo.value = '* Valor del derecho elegido';
    this.generacion_recibo.DerechoPecuniarioId = '';
    this.gen_recibo = false;
    this.cargarConceptos(!event.value.Activo);
  }

  cargarConceptos(egresado: boolean) {
    this.conceptos = [];
    this.sgaDerechoPecunarioMidService
      .get('derechos-pecuniarios/vigencias/' + this.vigenciaActual)
      .subscribe(
        (response) => {
          const data: any[] = response.data;
          if (Object.keys(data).length > 0 && Object.keys(data[0]).length > 0) {
            data.forEach((obj) => {
              // 40 -> CERTIFICADO DE NOTAS
              // 49 -> COPIAS DE ACTAS DE GRADO
              // 51 -> DUPLICADO DE DIPLOMAS
              if (
                (!egresado &&
                  ['31', '40', '41', '42', '44', '50'].includes(
                    obj.ParametroId.CodigoAbreviacion
                  )) ||
                (egresado &&
                  ['40', '49', '51'].includes(
                    obj.ParametroId.CodigoAbreviacion
                  ))
              ) {
                const concepto = new Concepto();
                concepto.Id = obj.ParametroId.Id;
                concepto.Codigo = obj.ParametroId.CodigoAbreviacion;
                concepto.Nombre = obj.ParametroId.Nombre;
                concepto.FactorId = obj.Id;
                concepto.Factor = JSON.parse(obj.Valor).NumFactor;
                if (JSON.parse(obj.Valor).Costo !== undefined) {
                  concepto.Costo = JSON.parse(obj.Valor).Costo;
                }
                this.conceptos.push(concepto);
              }
            });
          } else {
            this.popUpManager.showAlert(
              'info',
              this.translate.instant('derechos_pecuniarios.no_conceptos')
            );
          }
        },
        (error) => {
          this.popUpManager.showErrorToast(
            this.translate.instant('ERROR.general')
          );
        }
      );
  }

  loadConcepto(event) {
    this.tipo_derecho_selected = event.value;
    this.generacion_recibo.code = event.value.Codigo;
    this.generacion_recibo.concept = event.value.Nombre;
    this.generacion_recibo.value = event.value.Costo;
    this.generacion_recibo.DerechoPecuniarioId = event.value.Id;
    this.gen_recibo = true;
  }

  nuevoDerecho() {
    this.generacion_recibo.username = this.userData.NombreCompleto;
    this.generacion_recibo.documentId = this.userData.Documento;
    this.new_pecuniario = true;
  }

  formatearPrecio(precio: number): string {
    return precio != null
      ? precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
      : '';
  }

  pagar(data: any) {
    if (data.Estado === 'Pendiente pago') {
      this.abrirPago(data);
    }
  }

  adjuntarPago(data: any) {
    if (data.Estado === 'Pendiente pago') {
      Swal.fire({
        title: 'Adjunte recibo',
        input: 'file',
        inputAttributes: {
          accept: 'pdf/*',
          'aria-label': 'Upload your profile picture',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const comprobanteRecibo = result.value;

          let files: Array<any> = [];

          let dataAux = data;
          delete data.Solicitar.disabled;

          const file = {
            file: this.nuxeo.fileToBase64(comprobanteRecibo),
            IdTipoDocumento: 58,
            metadatos: {
              NombreArchivo: comprobanteRecibo.name,
              Tipo: 'Archivo',
              Observaciones: 'Comprobante de pago de derecho pecuniario',
              'dc:title': comprobanteRecibo.name,
            },
            descripcion: comprobanteRecibo.name,
            nombre: comprobanteRecibo.name,
            key: 'Documento',
          };
          files.push(file);
          data.comprobanteRecibo = file;
          data.SolicitanteId = this.info_persona_id;
        }
      });
    } else {
      this.popUpManager.showAlert(
        this.translate.instant('derechos_pecuniarios.adjuntar_pago'),
        this.translate.instant('derechos_pecuniarios.pago_ya_adjuntado')
      );
    }
  }

  solicitar(data: any) {
    console.log(data)
    if (data.comprobanteRecibo) {
      this.sgaDerechoPecunarioMidService
        .post('derechos-pecuniarios/solicitudes', data)
        .subscribe(
          (response: any) => {
            if (response.status === '200') {
              this.loadInfoRecibos();
              this.popUpManager.showSuccessAlert(
                this.translate.instant(
                  'derechos_pecuniarios.solicitud_generada'
                )
              );
            } else if (response.status === '400') {
              this.popUpManager.showErrorToast(
                this.translate.instant(
                  'derechos_pecuniarios.error_solicitud_generada'
                )
              );
            }
          },
          (error: HttpErrorResponse) => {
            this.popUpManager.showErrorToast(
              this.translate.instant(`ERROR.${error.status}`)
            );
          }
        );
    }
  }

  verRespuesta(data: any) {
    this.nuxeo
      .get([data.VerRespuesta.documento.DocRespuesta[0]])
      .subscribe((documentos) => {
        const assignConfig = new MatDialogConfig();
        assignConfig.width = '1300px';
        assignConfig.height = '800px';
        const aux = {
          ...documentos[0],
          observacion: data.VerRespuesta.documento.Observacion,
          aprobado: false,
        };
        assignConfig.data = { documento: aux, observando: true };
        const dialogo = this.dialog.open(
          DialogoDocumentosComponent,
          assignConfig
        );
      });
  }
}
