import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as momentTimezone from 'moment-timezone';
import { InstitucionEnfasis } from 'src/data/models/institucion_enfasis';
import { UserService } from 'src/data/services/users.service';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { NewNuxeoService } from 'src/data/services/new_nuxeo.service';
import { ImplicitAutenticationService } from 'src/data/services/implicit_autentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DocumentoService } from 'src/data/services/documento.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogPreviewFileComponent } from 'src/app/dialog-preview-file/dialog-preview-file.component';
import { SgaDerechoPecunarioMidService } from 'src/data/services/sga_derecho_pecunario_mid.service';

@Component({
  selector: 'consultar-solicitudes',
  templateUrl: './consultar-solicitudes.component.html',
  styleUrls: ['./consultar-solicitudes.component.scss'],
})
export class ConsultarSolicitudesDerechosPecuniarios {
  data: any[] = [];
  solicitudData: any = null;
  userResponse: any;
  loading: boolean;

  InfoDocumentos: any;
  arr_proyecto: InstitucionEnfasis[] = [];
  proyectos = [];
  gestion = false;
  CampoControl = new FormControl('', [Validators.required]);
  Campo1Control = new FormControl('', [Validators.required]);
  Campo2Control = new FormControl('', [Validators.required]);
  settings: any;
  Respuesta: any;

  formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = [
    'Id',
    'FechaCreacion',
    'Codigo',
    'Nombre',
    'Identificacion',
    'Estado',
    'VerSoporte',
    'Gestionar',
  ];
  actionsColumns: string[] = ['VerSoporte', 'Gestionar'];

  nombresColumnas = [];

  formGestion: FormGroup;
  file: any;
  url_temp: any;

  constructor(
    private userService: UserService,
    private popUpManager: PopUpManager,
    private nuxeo: NewNuxeoService,
    private autenticationService: ImplicitAutenticationService,
    private sgaDerechoPecunarioMidService: SgaDerechoPecunarioMidService,
    private translate: TranslateService,
    private documentoService: DocumentoService,
    private builder: FormBuilder,
    private matDialog: MatDialog
  ) {
    this.nombresColumnas['Id'] = 'derechos_pecuniarios.id';
    this.nombresColumnas['FechaCreacion'] =
      'derechos_pecuniarios.fecha_generacion';
    this.nombresColumnas['Codigo'] = 'derechos_pecuniarios.codigo';
    this.nombresColumnas['Nombre'] = 'derechos_pecuniarios.nombre';
    this.nombresColumnas['Identificacion'] =
      'derechos_pecuniarios.identificacion';
    this.nombresColumnas['Estado'] = 'derechos_pecuniarios.estado';
    this.nombresColumnas['VerSoporte'] = 'derechos_pecuniarios.ver_recibo'; //renderComponent: LinkDownloadNuxeoComponent,
    this.nombresColumnas['Gestionar'] = 'derechos_pecuniarios.gestionar';

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.createTable();
    });

    this.loadInfoPersona();
    this.createTable();

    this.formGestion = this.builder.group({
      observacion: ['', Validators.required],
    });
  }

  return() {
    sessionStorage.setItem('EstadoRecibo', 'false');
  }

  public async loadInfoPersona(): Promise<void> {
    this.userService.tercero$.subscribe((user) => {
      this.userResponse = user;
      // this.userResponse.Rol = 'Coordinador'
    });

    this.autenticationService.getRole().then((rol: Array<String>) => {
      if (
        rol.includes('COORDINADOR') ||
        rol.includes('COORDINADOR_PREGADO') ||
        rol.includes('COORDINADOR_POSGRADO')
      ) {
        this.userResponse.Rol = 'Coordinador';
      }
    });
  }

  createTable() {
    this.loadInfoRecibos();
  }

  cargarDatosTabla(datosCargados: any[]) {
    this.dataSource = new MatTableDataSource(datosCargados);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  async loadInfoRecibos() {
    this.loading = true;
    this.sgaDerechoPecunarioMidService
      .get('derechos-pecuniarios/solicitudes')
      .subscribe(
        (response: any) => {
          if (response !== null && response.status === '400') {
            this.popUpManager.showErrorToast(
              this.translate.instant('derechos_pecuniarios.error')
            );
            this.cargarDatosTabla([]);
          } else if (
            (response != null && response.status === '404') ||
            response.data[0] === null
          ) {
            this.popUpManager.showAlert(
              this.translate.instant('GLOBAL.info'),
              this.translate.instant('derechos_pecuniarios.no_recibo')
            );
            this.cargarDatosTabla([]);
          } else {
            const data = <Array<any>>response.data;
            const dataInfo = <Array<any>>[];
            data.forEach((element) => {
              element.FechaCreacion = momentTimezone
                .tz(element.FechaCreacion, 'America/Bogota')
                .format('YYYY-MM-DD');

              element.Gestionar = {
                icon: 'edit_outline',
                label: 'Gestionar',
                class: 'icon-primary',
              };
              const idSoporte = element.VerSoporte;

              element.VerSoporte = {
                icon: 'download',
                label: 'VerSoporte',
                class: 'icon-primary',
                idSoporte: idSoporte,
              };

              dataInfo.push(element);
            });

            this.cargarDatosTabla(dataInfo);

            this.loading = false;
          }
        },
        () => {
          this.loading = false;
          this.popUpManager.showErrorToast(
            this.translate.instant('ERROR.general')
          );
        }
      );
  }

  async enviarSolicitud() {
    if (this.formGestion.valid) {
      let files: Array<any> = [];
      if (typeof this.file !== 'undefined' && this.file !== null) {
        let FORMULARIO_SOLICITUD = 'FORMULARIO_SOLICITUD';
        let tipoDocumento = 25;
        this.loading = true;
        const file = {
          file: await this.nuxeo.fileToBase64(this.file),
          IdTipoDocumento: tipoDocumento,
          metadatos: {
            NombreArchivo: FORMULARIO_SOLICITUD,
            Tipo: 'Archivo',
            Observaciones: FORMULARIO_SOLICITUD,
            'dc:title': FORMULARIO_SOLICITUD,
          },
          descripcion: FORMULARIO_SOLICITUD,
          nombre: FORMULARIO_SOLICITUD,
          key: 'Documento',
        };
        files.push(file);
      }

      const hoy = new Date();
      this.Respuesta = {
        DocRespuesta: files,
        FechaRespuesta: momentTimezone
          .tz(
            hoy.getFullYear() +
              '/' +
              (hoy.getMonth() + 1) +
              '/' +
              hoy.getDate(),
            'America/Bogota'
          )
          .format('YYYY-MM-DD HH:mm:ss'),
        Observacion: this.formGestion.controls['observacion'].value,
        TerceroResponasble: { Id: this.userResponse.Id },
      };

      this.sgaDerechoPecunarioMidService
        .post(
          `derechos-pecuniarios/solicitudes/${this.solicitudData.Id}/respuesta/`,
          this.Respuesta
        )
        .subscribe(
          (res: any) => {
            if (res !== null && res.Status === '200') {
              this.popUpManager.showSuccessAlert(
                this.translate.instant('GLOBAL.info_estado') +
                  ' ' +
                  this.translate.instant('GLOBAL.operacion_exitosa')
              );
              this.loadInfoRecibos();
              this.loading = false;
              this.gestion = false;
            } else {
              this.loading = false;
              this.popUpManager.showErrorAlert(
                this.translate.instant('GLOBAL.error_practicas_academicas')
              );
            }
          },
          () => {
            this.loading = false;
            this.popUpManager.showErrorToast(
              this.translate.instant('ERROR.general')
            );
          }
        );
    }
  }

  gestionar(data: any) {
    this.solicitudData = data;
    this.gestion = true;
  }

  descargar(data: any) {
    const value = data.VerSoporte.idSoporte;
    if (value) {
      this.documentoService.get('documento/' + value).subscribe((data) => {
        let documentoData = data;
        let errorDocument = false;

        this.nuxeo.getByUUID(documentoData.Enlace).subscribe((docFile: any) => {
          if (docFile.status) {
            errorDocument = true;
          } else {
            this.open(docFile);
          }
        });
      });
    }
  }

  async open(documentoFile?: string) {
    await this.sleep(100);
    const w = 500;
    const h = 500;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;
    window.open(
      documentoFile,
      documentoFile,
      'toolbar=no,' +
        'location=no, directories=no, status=no, menubar=no,' +
        'scrollbars=no, resizable=no, copyhistory=no, ' +
        'width=' +
        w +
        ', height=' +
        h +
        ', top=' +
        top +
        ', left=' +
        left
    );
  }

  preview(url, title, message?) {
    const dialogDoc = new MatDialogConfig();
    dialogDoc.width = '80vw';
    dialogDoc.height = '90vh';
    dialogDoc.data = { url, title, message };
    this.matDialog.open(DialogPreviewFileComponent, dialogDoc);
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  archivoSeleccionado(event: any) {
    this.file = event.target.files != null ? event.target.files[0] : null;
    this.url_temp = this.file != null ? URL.createObjectURL(this.file) : null;
  }
}
