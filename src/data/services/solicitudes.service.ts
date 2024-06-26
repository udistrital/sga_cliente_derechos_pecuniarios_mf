import { Injectable } from '@angular/core';
import { RequestManager } from 'src/app/managers/request_manager';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesService {
  constructor(private requestManager: RequestManager) {}

  get(endpoint: string) {
    this.requestManager.setPath('SOLICITUDES_SERVICE');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: string, element: any) {
    this.requestManager.setPath('SOLICITUDES_SERVICE');
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint: string, element: any) {
    this.requestManager.setPath('SOLICITUDES_SERVICE');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint: string, elementId: string) {
    this.requestManager.setPath('SOLICITUDES_SERVICE');
    return this.requestManager.delete(endpoint, elementId);
  }
}