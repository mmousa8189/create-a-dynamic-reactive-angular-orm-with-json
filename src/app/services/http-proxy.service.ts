import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpProxyService {

  constructor(private http: HttpClient) { }

  public post<T>(url: string, body: any, options?: object): Observable<any> {
    return this.http.post<T>(url, body, this.getOptions(options));
  }

  public get<T>(url: string, options?: object): Observable<any> {
    return this.http.get<T>(url, this.getOptions(options));
  }

  public getWithoutHeaders<T>(url: string, options?: object): Observable<any> {
    return this.http.get<T>(url, this.getOptionsWithoutHeaders(options));

  }

  public delete<T>(url: string, options?: object): Observable<any> {
    return this.http.delete<T>(url, this.getOptions(options));
  }

  public put<T>(url: string, body: any, options?: object): Observable<any> {
    return this.http.put<T>(url, body, this.getOptions(options));
  }


  private getOptions(options: any): any {

    if (options == null) {
      options = {};
    }

    if (options.headers == null) {
      options.headers = {};
    }

    options.headers['Accept-Language'] = 'ar-eg';

    return options;
  }

  private getOptionsWithoutHeaders(options: any): any {

    if (options == null) {
      options = {};
    }

    if (options.headers == null) {
      options.headers = {};
    }

    options.headers['Accept-Language'] = 'en';

    return options;
  }
}
