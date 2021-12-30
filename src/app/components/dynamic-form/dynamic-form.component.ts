import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JsonFormData } from '../json-form/json-form.component';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  public formData: JsonFormData | undefined;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<JsonFormData>('/assets/my-form.json')
    .subscribe(
      (response) => {                           //Next callback
        console.log('response received')
        console.log(response);
        this.formData = response;
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
