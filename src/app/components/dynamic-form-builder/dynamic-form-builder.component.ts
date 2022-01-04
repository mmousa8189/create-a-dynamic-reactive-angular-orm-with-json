import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-dynamic-form-builder',
  templateUrl: './dynamic-form-builder.component.html',
  styleUrls: ['./dynamic-form-builder.component.css'],
})
export class DynamicFormBuilderComponent implements OnInit {
  formControlTypes = JsonFormControlTypes;
  jsonFormControlTypesMapping = JsonFormControlTypesMapping;
  jsonFormData: JsonFormData | undefined;
  controls: JsonFormControls[] = [];
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
  constructor() {
    this.selectOptionsTemp = Array<JsonFormControlSelectOptions>();
    this.selectoption = {} as JsonFormControlSelectOptions;
    this.validators = {} as JsonFormValidators;
  }

  ngOnInit(): void {}

  onCheckboxChange(event: Event) {
    if((event.target as HTMLInputElement).id == 'required'){
      this.isHaveRequired =(event.target as HTMLInputElement).checked ;
    }
    if((event.target as HTMLInputElement).id == 'min'){
      this.isHaveMin =(event.target as HTMLInputElement).checked ;
    }
    if((event.target as HTMLInputElement).id == 'max'){
      this.isHaveMax =(event.target as HTMLInputElement).checked ;
    }
    if((event.target as HTMLInputElement).id == 'minLength'){
      this.isHaveMinLength =(event.target as HTMLInputElement).checked ;
    }
    if((event.target as HTMLInputElement).id == 'maxLength'){
      this.isHaveMaxLength =(event.target as HTMLInputElement).checked ;
    }
    if((event.target as HTMLInputElement).id == 'email'){
      this.isHaveEmail =(event.target as HTMLInputElement).checked ;
    }
  }
  onSelectType(event: Event) {
    this.controlModel.type = (event.target as HTMLInputElement).value;
    if(this.controlModel.type != this.formControlTypes.Text){
      this.isHaveMinLength = false;
      this.isHaveMaxLength =false;
    }
    if(this.controlModel.type != this.formControlTypes.TextArea){
      this.isHaveMinLength = false;
      this.isHaveMaxLength =false;
    }
    if(this.controlModel.type != this.formControlTypes.Number){
      this.isHaveMin = false;
      this.isHaveMax =false;
    }
    if(this.controlModel.type != this.formControlTypes.Email){
      this.isHaveEmail = false;
    }
    if(this.controlModel.type != this.formControlTypes.Select){
      this.selectOptionsTemp = [];
    }
  }

  addSelectOption(){
    if(Object.keys(this.selectoption).length != 0){
      this.selectOptionsTemp.push(this.selectoption);
      this.selectoption={} as JsonFormControlSelectOptions;
    }

    //this.selectoptions
  }
  addControle() {
    if(!this.checkIfControleIsExist()){
      this.prepareControlObject();
      this.controls.push(this.controlModel);
      this.clearUiInputs();
    }else{
      alert('Already Exist!!!!');
      this.clearUiInputs();
    }
  }

  private clearUiInputs():void {
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

  private prepareControlObject():void{
    if(this.controlModel.type == this.formControlTypes.Select){
      this.controlModel.selectoptions = this.selectOptionsTemp;
    }
    this.setValidators();
  }
  private setValidators():void{
    let validatorsPartial = this.validators as Partial<JsonFormValidators>;
    if(this.isHaveRequired){
      validatorsPartial.required = this.isHaveRequired;
    }
    if(!this.isHaveMin && validatorsPartial.min){
      delete validatorsPartial.min;
    }
    if(!this.isHaveMin && validatorsPartial.max){
      delete validatorsPartial.max;
    }
    if(!this.isHaveMin && validatorsPartial.minLength){
      delete validatorsPartial.minLength;
    }
    if(!this.isHaveMin && validatorsPartial.maxLength){
      delete validatorsPartial.maxLength;
    }
    if(!this.isHaveEmail && validatorsPartial.email){
      delete validatorsPartial.email;
    }

    this.validators = validatorsPartial;
    this.controlModel.validators = this.validators;

  }


}
