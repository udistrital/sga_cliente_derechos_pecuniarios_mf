import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class PopUpManager {
    constructor(private translate: TranslateService) { }

    confirmColor: string = '#3085d6';
    cancelColor: string = '#aaa';

    public showAlert(status: string | HTMLElement | JQuery, text: string): void {
        Swal.fire({
            icon: 'info',
            title: status,
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            confirmButtonColor: this.confirmColor,
            cancelButtonColor: this.cancelColor
        });
    }

    public showSuccessAlert(text: string): Promise<any> {
        return Swal.fire({
            icon: 'success',
            title: this.translate.instant('GLOBAL.operacion_exitosa'),
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            confirmButtonColor: this.confirmColor,
        });
    }

    public showErrorAlert(text: string): void {
        Swal.fire({
            icon: 'error',
            title: this.translate.instant('GLOBAL.error'),
            text: text,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            confirmButtonColor: this.confirmColor,
        });
    }

    public showConfirmAlert(text: string, title = this.translate.instant('GLOBAL.atencion')): Promise<any> {
        const options: any = {
            title: title,
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
            confirmButtonColor: this.confirmColor,
            cancelButtonColor: this.cancelColor
        };
        return Swal.fire(options);
    }

    public showPopUpGeneric(title: string, text: string, type: SweetAlertIcon, cancelar: boolean): Promise<any> {
        const opt: SweetAlertOptions = {
            title: title,
            html: text,
            icon: type,
            showCancelButton: cancelar,
            allowOutsideClick: !cancelar,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
            confirmButtonColor: this.confirmColor,
            cancelButtonColor: this.cancelColor
        };
        return Swal.fire(opt);
    }

    public showPopUpForm(title: string, form: any, cancelar: boolean): Promise<any> {
        const opt: SweetAlertOptions = {
            title: title,
            html: form.html,
            showCancelButton: cancelar,
            allowOutsideClick: !cancelar,
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
            confirmButtonColor: this.confirmColor,
            cancelButtonColor: this.cancelColor,
            preConfirm: () => {
                const results = {};
                form.ids.forEach((id: string) => {
                    const element = <HTMLInputElement>Swal.getPopup().querySelector('#' + id)
                    results[id] = element.value;
                });
                return results;
            },
        };
        return Swal.fire(opt);
    }

}