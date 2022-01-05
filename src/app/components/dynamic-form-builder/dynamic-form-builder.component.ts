import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location, ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import {
  JsonFormControlTypes,
  JsonFormControlTypesMapping,
} from 'src/app/models/json-form-control-types.enum';
import { JsonFormData } from 'src/app/models/json-form-data';
import { JsonFormControls } from 'src/app/models/json-form-controls';
import { JsonFormControlOptions } from 'src/app/models/json-form-control-options';
import { JsonFormControlSelectOptions } from 'src/app/models/json-form-control-select-options';
import { JsonFormValidators } from 'src/app/models/json-form-validators';
import { element } from 'protractor';
import { DynmicFormProxyService } from 'src/app/services/dynmic-form-proxy.service';
import { RequestModel } from 'src/app/models/request-model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dynamic-form-builder',
  templateUrl: './dynamic-form-builder.component.html',
  styleUrls: ['./dynamic-form-builder.component.css'],
})
export class DynamicFormBuilderComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  formControlTypes = JsonFormControlTypes;
  jsonFormControlTypesMapping = JsonFormControlTypesMapping;
  jsonFormData: JsonFormData | undefined;
  controls: JsonFormControls[] = [];
  controlsJson: any;
  controlModel: JsonFormControls = {} as JsonFormControls;
  options?: JsonFormControlOptions;
  selectoptions: JsonFormControlSelectOptions[] = [];
  validators;
  selectoption;
  public controleTypes = Object.values(JsonFormControlTypes);
  selectOptionsTemp;
  //#region validators checkbox values
  isHaveMin: boolean = false;
  isHaveMax: boolean = false;
  isHaveRequired: boolean = false;
  isHaveRequiredTrue: boolean = false;
  isHaveEmail: boolean = false;
  isHaveMinLength: boolean = false;
  isHaveMaxLength: boolean = false;
  isHavePattern: boolean = false;
  //#endregion validators checkbox values
  constructor(private _dynmicFormProxyService: DynmicFormProxyService) {
    this.selectOptionsTemp = Array<JsonFormControlSelectOptions>();
    this.selectoption = {} as JsonFormControlSelectOptions;
    this.validators = {} as JsonFormValidators;
  }

  ngOnInit(): void {
    this.addInitInputsToForm();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  onCheckboxChange(event: Event) {
    if ((event.target as HTMLInputElement).id == 'required'){
      this.isHaveRequired = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id == 'min'){
      this.isHaveMin = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id == 'max'){
      this.isHaveMax = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id == 'minLength'){
      this.isHaveMinLength = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id == 'maxLength'){
      this.isHaveMaxLength = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id == 'email'){
      this.isHaveEmail = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id == 'pattern'){
      this.isHavePattern = (event.target as HTMLInputElement).checked ;
    }
  }
  onSelectType(event: Event) {
    this.controlModel.type = (event.target as HTMLInputElement).value;
    if (this.controlModel.type != this.formControlTypes.Text){
      this.isHaveMinLength = false;
      this.isHaveMaxLength = false;
      this.isHavePattern = false;
    }
    if (this.controlModel.type != this.formControlTypes.Tel){
      this.isHaveMinLength = false;
      this.isHaveMaxLength = false;
      this.isHavePattern = false;
    }
    if (this.controlModel.type != this.formControlTypes.TextArea){
      this.isHaveMinLength = false;
      this.isHaveMaxLength = false;

    }
    if (this.controlModel.type != this.formControlTypes.Number){
      this.isHaveMin = false;
      this.isHaveMax = false;
    }
    if (this.controlModel.type != this.formControlTypes.Email){
      this.isHaveEmail = false;
    }
    if (this.controlModel.type != this.formControlTypes.Select){
      this.selectOptionsTemp = [];
    }
  }

  addSelectOption(){
    if (Object.keys(this.selectoption).length != 0){
      this.selectOptionsTemp.push(this.selectoption);
      this.selectoption = {} as JsonFormControlSelectOptions;
    }

    //this.selectoptions
  }
  addControle() {
    this.controlModel.label = this.controlModel.label + ':';
    if (!this.checkIfControleIsExist()){
      this.prepareControlObject();
      this.controls.push(this.controlModel);
      this.clearUiInputs();
    }else{
      alert('Already Exist!!!!');
      this.clearUiInputs();
    }
  }
  saveForm(){
    this.saveFormData();
  }
  private saveFormData() {
    this.controlsJson = {controls: this.controls};
    let requestBody: RequestModel = {
    eventName: 'testPOC2',
    formJsonStructure: JSON.stringify(this.controlsJson)
   };
    this._dynmicFormProxyService.Save(requestBody)
    .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe(
    (response) => {
    console.log('response received')
    console.log(response);
  },
  (error) => {                              //Error callback
    console.error('Request failed with error')
    alert(error);
  },
  () => {                                   //Complete callback
    console.log('Request completed')
  });
  }

  private clearUiInputs(): void {
    this.controlModel = {} as JsonFormControls;
    this.isHaveRequired = false;
    var select = document.getElementById("controletype") as HTMLSelectElement;
    select.selectedIndex = 0;
  }

  private checkIfControleIsExist(): boolean {
   return this.controls.some(e =>

        e.id === this.controlModel.id &&
        e.name === this.controlModel.name &&
        e.label === this.controlModel.label &&
        e.type === this.controlModel.type
      );
  }

  private prepareControlObject(): void{
    if (this.controlModel.type == this.formControlTypes.Select){
      this.controlModel.selectoptions = this.selectOptionsTemp;
    }

    this.setValidators();
  }
  private setValidators(): void{
    let validatorsPartial = this.validators as Partial<JsonFormValidators>;
    if (this.isHaveRequired){
      validatorsPartial.required = this.isHaveRequired;
    }
    if (!this.isHaveMin && validatorsPartial.min){
      delete validatorsPartial.min;
    }
    if (!this.isHaveMin && validatorsPartial.max){
      delete validatorsPartial.max;
    }
    if (!this.isHaveMin && validatorsPartial.minLength){
      delete validatorsPartial.minLength;
    }
    if (!this.isHaveMin && validatorsPartial.maxLength){
      delete validatorsPartial.maxLength;
    }
    if (!this.isHaveEmail && validatorsPartial.email){
      delete validatorsPartial.email;
    }

    this.validators = validatorsPartial;
    this.controlModel.validators = this.validators;

  }

  private addInitInputsToForm(): void{
    this.controls.push(this.addSalutationControle());
    this.controls.push(this.addFirstNameControle());
    this.controls.push(this.addLastNameControle());
    this.controls.push(this.addJobTitleControle());
    this.controls.push(this.addCompanyControle());
    this.controls.push(this.addMobileControle());
    this.controls.push(this.addEmailControle());
  }



  private  addSalutationControle(): JsonFormControls {
    return {
      id: 'salutation',
      name : 'salutation',
      label : 'Salutation:',
      placeholder : 'Salutation',
      type : this.formControlTypes.Select,
      selectoptions : [
        {key: 'MR', value: 'MR'},
        {key: 'MRS', value: 'MRS'},
        {key: 'MS', value: 'MS'},
        {key: 'MISS', value: 'MISS'},
        {key: 'DR', value: 'DR'},
        {key: 'PROF.', value: 'PROF.'},
        {key: 'ENG.', value: 'ENG.'},
      ] as JsonFormControlSelectOptions[],
      validators : { required: true } as JsonFormValidators
    } as JsonFormControls;
  }
  private  addFirstNameControle(): JsonFormControls {
    return {
      id: 'firstname',
      name : 'firstname',
      label : 'First Name:',
      placeholder : 'First name',
      type : this.formControlTypes.Text,
      validators : { required: true, minLength: 10, maxLength: 15 } as JsonFormValidators
    } as JsonFormControls;
  }
  private  addLastNameControle(): JsonFormControls {
    return {
      id: 'lastname',
      name : 'lastname',
      label : 'Last name:',
      placeholder : 'Last name',
      type : this.formControlTypes.Text,
      validators : { required: true, minLength: 10, maxLength: 15 } as JsonFormValidators
    } as JsonFormControls;
  }
  private  addJobTitleControle(): JsonFormControls {
    return {
      id: 'jobtitle',
      name : 'jobtitle',
      label : 'Job Title:',
      placeholder : 'JobTitle',
      type : this.formControlTypes.Text,
      validators : { required: true, minLength: 10, maxLength: 15 } as JsonFormValidators
    } as JsonFormControls;
  }
  private  addCompanyControle(): JsonFormControls {
    return {
      id: 'company',
      name : 'company',
      label : 'Company:',
      placeholder : 'Company',
      type : this.formControlTypes.Text,
      validators : { required: true, minLength: 10, maxLength: 15 } as JsonFormValidators
    } as JsonFormControls;
  }
  private  addEmailControle(): JsonFormControls {
    return {
      id: 'email',
      name : 'email',
      label : 'Email:',
      placeholder : 'Email',
      type : this.formControlTypes.Email,
      validators : { required: true, email: true } as JsonFormValidators
    } as JsonFormControls;
  }
  private  addMobileControle(): JsonFormControls {
    return {
      id: 'mobile',
      name : 'mobile',
      label : 'Mobile:',
      placeholder : 'Mobile',
      type : this.formControlTypes.Tel,
      validators : { required: true, minLength: 10, maxLength: 15, pattern: '^[0-9]*$'} as JsonFormValidators
    } as JsonFormControls;
  }
}
