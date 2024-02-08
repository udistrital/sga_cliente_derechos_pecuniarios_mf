import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
    providedIn: 'root',
})
export class PopUpManager {
    constructor(
        private translate: TranslateService,
    ) { }

    public showAlert(status, text) {
        Swal.fire({
            icon: 'info',
            title: status,
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
    }

    public showSuccessAlert(text) {
        return Swal.fire({
            icon: 'success',
            title: this.translate.instant('GLOBAL.operacion_exitosa'),
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
    }

    public showErrorAlert(text) {
        Swal.fire({
            icon: 'error',
            title: this.translate.instant('GLOBAL.error'),
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
    }

    public showConfirmAlert(text, title = this.translate.instant('GLOBAL.atencion')): Promise<any> {
        const options: any = {
            title: title,
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
        };
        return Swal.fire(options);
    }

    public showPopUpGeneric(title, text, type, cancelar): Promise<any> {
        const opt: any = {
            title: title,
            html: text,
            icon: type,
            showCancelButton: cancelar,
            allowOutsideClick: !cancelar,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
        };
        return Swal.fire(opt);
    }

    public showPopUpForm(title, form, cancelar): Promise<any> {
        const opt: any = {
            title: title,
            html: form.html,
            showCancelButton: cancelar,
            allowOutsideClick: !cancelar,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
            preConfirm: () => {
                const results = {};
                form.ids.forEach(id => {
                    const element = <HTMLInputElement>Swal.getPopup().querySelector('#' + id)
                    results[id] = element.value;
                });
                return results;
            },
        };
        return Swal.fire(opt);
    }

}
