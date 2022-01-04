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
  selectoptions?: JsonFormControlSelectOptions[] = [];
  validators!: JsonFormValidators;
  public controleTypes = Object.values(JsonFormControlTypes);
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
  constructor() {}

  ngOnInit(): void {}

  onCheckboxChange(event: Event) {
    console.log((event.target as HTMLInputElement).checked);
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
  }

  addControle() {

  }
}
