import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppConfig } from '../models/iapp-config';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  static settings: IAppConfig;

  private http: HttpClient;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  public load(): Promise<any> {
    const jsonFileUrl = `/assets/config/config.json`;

    return new Promise<any>((resolve, reject) => {
      this.http.get(jsonFileUrl).toPromise().then((response: any) => {
          AppConfigService.settings = (response as IAppConfig);

          resolve(response);
        })
        .catch((response: any) => {
          reject(`Could not load file '${jsonFileUrl}`);
        });
    });
  }
}
