import { Injectable } from '@angular/core';
import { RequestManager } from 'src/app/managers/request_manager';

@Injectable({
  providedIn: 'root',
})
export class SgaInscripcionMidService {
  constructor(private requestManager: RequestManager) {}

  get(endpoint: string) {
    this.requestManager.setPath('SGA_INSCRIPCION_MID');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: string, element: any) {
    this.requestManager.setPath('SGA_INSCRIPCION_MID');
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint: string, element: any) {
    this.requestManager.setPath('SGA_INSCRIPCION_MID');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint: string, elementId: string) {
    this.requestManager.setPath('SGA_INSCRIPCION_MID');
    return this.requestManager.delete(endpoint, elementId);
  }
}
