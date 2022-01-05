import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpProxyService {

  constructor(private _http: HttpClient) { }

  public post<T>(url: string, body: any, options?: object): Observable<any> {
    return this._http.post<T>(url, body, this._getOptions(options));
  }

  public get<T>(url: string, options?: object): Observable<any> {
    return this._http.get<T>(url, this._getOptions(options));
  }

  public getWithoutHeaders<T>(url: string, options?: object): Observable<any> {
    return this._http.get<T>(url, this._getOptionsWithoutHeaders(options));

  }

  public delete<T>(url: string, options?: object): Observable<any> {
    return this._http.delete<T>(url, this._getOptions(options));
  }

  public put<T>(url: string, body: any, options?: object): Observable<any> {
    return this._http.put<T>(url, body, this._getOptions(options));
  }


  private _getOptions(options: any) {

    if (options == null) {
      options = {};
    }

    if (options.headers == null) {
      options.headers = {};
    }

    options.headers["Accept-Language"] = 'ar-eg';

    return options;
  }

  private _getOptionsWithoutHeaders(options: any) {

    if (options == null) {
      options = {};
    }

    if (options.headers == null) {
      options.headers = {};
    }

    options.headers["Accept-Language"] = 'en';

    return options;
  }
}
