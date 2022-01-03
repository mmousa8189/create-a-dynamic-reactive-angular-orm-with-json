import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JsonFormData } from 'src/app/models/json-form-data';
import { ResponseModel } from 'src/app/models/response-model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  public response: ResponseModel |undefined;
  public formData: JsonFormData | undefined;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<ResponseModel[]>('https://localhost:44367/api/DynamicRegisterForm/GetAll?eventName=testPOC')
    .subscribe(
      (response) => {                           //Next callback
        console.log('response received')
        console.log(response);
        this.response = response[0];
        this.formData = JSON.parse(this.response.formJsonStructure);
      },
      (error) => {                              //Error callback
        console.error('Request failed with error')
        alert(error);
      },
      () => {                                   //Complete callback
        console.log('Request completed')
      })
}

}
