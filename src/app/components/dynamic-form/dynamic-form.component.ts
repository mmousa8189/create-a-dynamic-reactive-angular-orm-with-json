import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JsonFormData } from 'src/app/models/json-form-data';
import { ResponseModel } from 'src/app/models/response-model';
import { DynmicFormProxyService } from 'src/app/services/dynmic-form-proxy.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  public response: ResponseModel |undefined;
  public formData: JsonFormData | undefined;
  private ngUnsubscribe = new Subject();
  constructor(private dynmicFormProxyService: DynmicFormProxyService) {}

  ngOnInit(): void {
    this.GetFormByEvent();
}
ngOnDestroy(): void {
  this.ngUnsubscribe.next();
  this.ngUnsubscribe.unsubscribe();
}

private GetFormByEvent(): void{
  this.dynmicFormProxyService.GetFormByEvent('testPOC2')
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe(
    (response) => {
    console.log('response received');
    console.log(response);
    this.response = response;
    this.formData = JSON.parse(this.response.formJsonStructure);
  },
  (error) => {                              // Error callback
    console.error('Request failed with error');
    alert(error);
  },
  () => {                                   // Complete callback
    console.log('Request completed');
  });
}
}
