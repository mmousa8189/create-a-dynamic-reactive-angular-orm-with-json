import { Component, OnInit } from '@angular/core';
import { Location,ViewportScroller } from '@angular/common';
import { Router } from "@angular/router";
import { JsonFormControlTypes, JsonFormControlTypesMapping } from 'src/app/models/json-form-control-types.enum';

@Component({
  selector: 'app-dynamic-form-builder',
  templateUrl: './dynamic-form-builder.component.html',
  styleUrls: ['./dynamic-form-builder.component.css']
})
export class DynamicFormBuilderComponent implements OnInit {

  formControlTypes = JsonFormControlTypes;
  jsonFormControlTypesMapping =JsonFormControlTypesMapping;
  public controleTypes=Object.values(JsonFormControlTypes);;
  constructor() {
   }

  ngOnInit(): void {
  }


}
