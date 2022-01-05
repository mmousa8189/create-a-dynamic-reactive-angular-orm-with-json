import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpProxyService } from './http-proxy.service';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { RequestModel } from '../models/request-model';

@Injectable({
  providedIn: 'root'
})
export class DynmicFormProxyService {

  private apiURL = 'https://localhost:44367/api/';
  constructor(private httpProxyService: HttpProxyService ) { }

  public GetFormByEvent(eventName: string): Observable<ResponseModel> {
    const url = this.apiURL + `DynamicRegisterForm/GetByEventName?eventName=${eventName}`;
    return this.httpProxyService.get<ResponseModel>(url);
  }

  public Save(requestModel: RequestModel): Observable<any>{
    const url = this.apiURL + 'DynamicRegisterForm/AddOrUpdateNewEvent';
    return this.httpProxyService.put<any>(url, requestModel);
  }

}
