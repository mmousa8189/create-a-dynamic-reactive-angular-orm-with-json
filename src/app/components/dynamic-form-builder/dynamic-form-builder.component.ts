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
  isHaveMin = false;
  isHaveMax = false;
  isHaveRequired = false;
  isHaveRequiredTrue = false;
  isHaveEmail = false;
  isHaveMinLength = false;
  isHaveMaxLength = false;
  isHavePattern = false;
  //#endregion validators checkbox values
  constructor(private dynmicFormProxyService: DynmicFormProxyService) {
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

  onCheckboxChange(event: Event): void {
    if ((event.target as HTMLInputElement).id === 'required'){
      this.isHaveRequired = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id === 'min'){
      this.isHaveMin = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id === 'max'){
      this.isHaveMax = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id === 'minLength'){
      this.isHaveMinLength = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id === 'maxLength'){
      this.isHaveMaxLength = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id === 'email'){
      this.isHaveEmail = (event.target as HTMLInputElement).checked ;
    }
    if ((event.target as HTMLInputElement).id === 'pattern'){
      this.isHavePattern = (event.target as HTMLInputElement).checked ;
    }
  }
  onSelectType(event: Event): void {
    this.controlModel.type = (event.target as HTMLInputElement).value;
    if (this.controlModel.type !== this.formControlTypes.Text){
      this.isHaveMinLength = false;
      this.isHaveMaxLength = false;
      this.isHavePattern = false;
    }
    if (this.controlModel.type !== this.formControlTypes.Tel){
      this.isHaveMinLength = false;
      this.isHaveMaxLength = false;
      this.isHavePattern = false;
    }
    if (this.controlModel.type !== this.formControlTypes.TextArea){
      this.isHaveMinLength = false;
      this.isHaveMaxLength = false;

    }
    if (this.controlModel.type !== this.formControlTypes.Number){
      this.isHaveMin = false;
      this.isHaveMax = false;
    }
    if (this.controlModel.type !== this.formControlTypes.Email){
      this.isHaveEmail = false;
    }
    if (this.controlModel.type !== this.formControlTypes.Select){
      this.selectOptionsTemp = [];
    }
  }

  addSelectOption(): void{
    if (Object.keys(this.selectoption).length !== 0){
      this.selectOptionsTemp.push(this.selectoption);
      this.selectoption = {} as JsonFormControlSelectOptions;
    }

    // this.selectoptions
  }
  addControle(): void {
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
  saveForm(): void{
    this.saveFormData();
  }
  private saveFormData(): void {
    this.controlsJson = {controls: this.controls};
    const requestBody: RequestModel = {
    eventId: 'testPOC2',
    eventName: 'testPOC2',
    formJsonStructure: JSON.stringify(this.controlsJson)
   };
    this.dynmicFormProxyService.Save(requestBody)
    .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe(
    (response) => {
    console.log('response received');
    console.log(response);
  },
  (error) => {                              // Error callback
    console.error('Request failed with error');
    alert(error);
  },
  () => {                                   // Complete callback
    console.log('Request completed');
  });
  }

  private clearUiInputs(): void {
    this.controlModel = {} as JsonFormControls;
    this.isHaveRequired = false;
    const select = document.getElementById('controletype') as HTMLSelectElement;
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
    if (this.controlModel.type === this.formControlTypes.Select){
      this.controlModel.selectoptions = this.selectOptionsTemp;
    }

    this.setValidators();
  }
  private setValidators(): void{
    const validatorsPartial = this.validators as Partial<JsonFormValidators>;
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
    this.controls.push(this.addCountryControle());
    this.controls.push(this.addMobileControle());
    this.controls.push(this.addEmailControle());
    // this.controls.push(this.addCheckBoxControle());

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
  private  addCountryControle(): JsonFormControls {
    return {
      id: 'country',
      name : 'country',
      label : 'country:',
      placeholder : 'country',
      type : this.formControlTypes.Select,
      selectoptions : [
    {key: 'AF', value: 'Afghanistan'},
    {key: 'AL', value: 'Albania'},
    {key: 'DZ', value: 'Algeria'},
    {key: 'AS', value: 'American Samoa'},
    {key: 'AD', value: 'Andorra'},
    {key: 'AO', value: 'Angola'},
    {key: 'AI', value: 'Anguilla'},
    {key: 'AQ', value: 'Antarctica'},
    {key: 'AG', value: 'Antigua and Barbuda'},
    {key: 'AR', value: 'Argentina'},
    {key: 'AM', value: 'Armenia'},
    {key: 'AW', value: 'Aruba'},
    {key: 'AU', value: 'Australia'},
    {key: 'AT', value: 'Austria'},
    {key: 'AZ', value: 'Azerbaijan'},
    {key: 'BS', value: 'Bahamas (the)'},
    {key: 'BH', value: 'Bahrain'},
    {key: 'BD', value: 'Bangladesh'},
    {key: 'BB', value: 'Barbados'},
    {key: 'BY', value: 'Belarus'},
    {key: 'BE', value: 'Belgium'},
    {key: 'BZ', value: 'Belize'},
    {key: 'BJ', value: 'Benin'},
    {key: 'BM', value: 'Bermuda'},
    {key: 'BT', value: 'Bhutan'},
    {key: 'BO', value: 'Bolivia (Plurinational State of)'},
    {key: 'BQ', value: 'Bonaire, Sint Eustatius and Saba'},
    {key: 'BA', value: 'Bosnia and Herzegovina'},
    {key: 'BW', value: 'Botswana'},
    {key: 'BV', value: 'Bouvet Island'},
    {key: 'BR', value: 'Brazil'},
    {key: 'IO', value: 'British Indian Ocean Territory (the)'},
    {key: 'BN', value: 'Brunei Darussalam'},
    {key: 'BG', value: 'Bulgaria'},
    {key: 'BF', value: 'Burkina Faso'},
    {key: 'BI', value: 'Burundi'},
    {key: 'CV', value: 'Cabo Verde'},
    {key: 'KH', value: 'Cambodia'},
    {key: 'CM', value: 'Cameroon'},
    {key: 'CA', value: 'Canada'},
    {key: 'KY', value: 'Cayman Islands (the)'},
    {key: 'CF', value: 'Central African Republic (the)'},
    {key: 'TD', value: 'Chad'},
    {key: 'CL', value: 'Chile'},
    {key: 'CN', value: 'China'},
    {key: 'CX', value: 'Christmas Island'},
    {key: 'CC', value: 'Cocos (Keeling) Islands (the)'},
    {key: 'CO', value: 'Colombia'},
    {key: 'KM', value: 'Comoros (the)'},
    {key: 'CD', value: 'Congo (the Democratic Republic of the)'},
    {key: 'CG', value: 'Congo (the)'},
    {key: 'CK', value: 'Cook Islands (the)'},
    {key: 'CR', value: 'Costa Rica'},
    {key: 'HR', value: 'Croatia'},
    {key: 'CU', value: 'Cuba'},
    {key: 'CW', value: 'Curaçao'},
    {key: 'CY', value: 'Cyprus'},
    {key: 'CZ', value: 'Czechia'},
    {key: 'CI', value: 'Côte dIvoire'},
    {key: 'DK', value: 'Denmark'},
    {key: 'DJ', value: 'Djibouti'},
    {key: 'DM', value: 'Dominica'},
    {key: 'DO', value: 'Dominican Republic (the)'},
    {key: 'EC', value: 'Ecuador'},
    {key: 'EG', value: 'Egypt'},
    {key: 'SV', value: 'El Salvador'},
    {key: 'GQ', value: 'Equatorial Guinea'},
    {key: 'ER', value: 'Eritrea'},
    {key: 'EE', value: 'Estonia'},
    {key: 'SZ', value: 'Eswatini'},
    {key: 'ET', value: 'Ethiopia'},
    {key: 'FK', value: 'Falkland Islands (the) [Malvinas]'},
    {key: 'FO', value: 'Faroe Islands (the)'},
    {key: 'FJ', value: 'Fiji'},
    {key: 'FI', value: 'Finland'},
    {key: 'FR', value: 'France'},
    {key: 'GF', value: 'French Guiana'},
    {key: 'PF', value: 'French Polynesia'},
    {key: 'TF', value: 'French Southern Territories (the)'},
    {key: 'GA', value: 'Gabon'},
    {key: 'GM', value: 'Gambia (the)'},
    {key: 'GE', value: 'Georgia'},
    {key: 'DE', value: 'Germany'},
    {key: 'GH', value: 'Ghana'},
    {key: 'GI', value: 'Gibraltar'},
    {key: 'GR', value: 'Greece'},
    {key: 'GL', value: 'Greenland'},
    {key: 'GD', value: 'Grenada'},
    {key: 'GP', value: 'Guadeloupe'},
    {key: 'GU', value: 'Guam'},
    {key: 'GT', value: 'Guatemala'},
    {key: 'GG', value: 'Guernsey'},
    {key: 'GN', value: 'Guinea'},
    {key: 'GW', value: 'Guinea-Bissau'},
    {key: 'GY', value: 'Guyana'},
    {key: 'HT', value: 'Haiti'},
    {key: 'HM', value: 'Heard Island and McDonald Islands'},
    {key: 'VA', value: 'Holy See (the)'},
    {key: 'HN', value: 'Honduras'},
    {key: 'HK', value: 'Hong Kong'},
    {key: 'HU', value: 'Hungary'},
    {key: 'IS', value: 'Iceland'},
    {key: 'IN', value: 'India'},
    {key: 'ID', value: 'Indonesia'},
    {key: 'IR', value: 'Iran (Islamic Republic of)'},
    {key: 'IQ', value: 'Iraq'},
    {key: 'IE', value: 'Ireland'},
    {key: 'IM', value: 'Isle of Man'},
    {key: 'IL', value: 'Israel'},
    {key: 'IT', value: 'Italy'},
    {key: 'JM', value: 'Jamaica'},
    {key: 'JP', value: 'Japan'},
    {key: 'JE', value: 'Jersey'},
    {key: 'JO', value: 'Jordan'},
    {key: 'KZ', value: 'Kazakhstan'},
    {key: 'KE', value: 'Kenya'},
    {key: 'KI', value: 'Kiribati'},
    {key: 'KP', value: 'Korea (the Democratic Peoples Republic of)'},
    {key: 'KR', value: 'Korea (the Republic of)'},
    {key: 'KW', value: 'Kuwait'},
    {key: 'KG', value: 'Kyrgyzstan'},
    {key: 'LA', value: 'Lao Peoples Democratic Republic (the)'},
    {key: 'LV', value: 'Latvia'},
    {key: 'LB', value: 'Lebanon'},
    {key: 'LS', value: 'Lesotho'},
    {key: 'LR', value: 'Liberia'},
    {key: 'LY', value: 'Libya'},
    {key: 'LI', value: 'Liechtenstein'},
    {key: 'LT', value: 'Lithuania'},
    {key: 'LU', value: 'Luxembourg'},
    {key: 'MO', value: 'Macao'},
    {key: 'MG', value: 'Madagascar'},
    {key: 'MW', value: 'Malawi'},
    {key: 'MY', value: 'Malaysia'},
    {key: 'MV', value: 'Maldives'},
    {key: 'ML', value: 'Mali'},
    {key: 'MT', value: 'Malta'},
    {key: 'MH', value: 'Marshall Islands (the)'},
    {key: 'MQ', value: 'Martinique'},
    {key: 'MR', value: 'Mauritania'},
    {key: 'MU', value: 'Mauritius'},
    {key: 'YT', value: 'Mayotte'},
    {key: 'MX', value: 'Mexico'},
    {key: 'FM', value: 'Micronesia (Federated States of)'},
    {key: 'MD', value: 'Moldova (the Republic of)'},
    {key: 'MC', value: 'Monaco'},
    {key: 'MN', value: 'Mongolia'},
    {key: 'ME', value: 'Montenegro'},
    {key: 'MS', value: 'Montserrat'},
    {key: 'MA', value: 'Morocco'},
    {key: 'MZ', value: 'Mozambique'},
    {key: 'MM', value: 'Myanmar'},
    {key: 'NA', value: 'Namibia'},
    {key: 'NR', value: 'Nauru'},
    {key: 'NP', value: 'Nepal'},
    {key: 'NL', value: 'Netherlands (the)'},
    {key: 'NC', value: 'New Caledonia'},
    {key: 'NZ', value: 'New Zealand'},
    {key: 'NI', value: 'Nicaragua'},
    {key: 'NE', value: 'Niger (the)'},
    {key: 'NG', value: 'Nigeria'},
    {key: 'NU', value: 'Niue'},
    {key: 'NF', value: 'Norfolk Island'},
    {key: 'MP', value: 'Northern Mariana Islands (the)'},
    {key: 'NO', value: 'Norway'},
    {key: 'OM', value: 'Oman'},
    {key: 'PK', value: 'Pakistan'},
    {key: 'PW', value: 'Palau'},
    {key: 'PS', value: 'Palestine, State of'},
    {key: 'PA', value: 'Panama'},
    {key: 'PG', value: 'Papua New Guinea'},
    {key: 'PY', value: 'Paraguay'},
    {key: 'PE', value: 'Peru'},
    {key: 'PH', value: 'Philippines (the)'},
    {key: 'PN', value: 'Pitcairn'},
    {key: 'PL', value: 'Poland'},
    {key: 'PT', value: 'Portugal'},
    {key: 'PR', value: 'Puerto Rico'},
    {key: 'QA', value: 'Qatar'},
    {key: 'MK', value: 'Republic of North Macedonia'},
    {key: 'RO', value: 'Romania'},
    {key: 'RU', value: 'Russian Federation (the)'},
    {key: 'RW', value: 'Rwanda'},
    {key: 'RE', value: 'Réunion'},
    {key: 'BL', value: 'Saint Barthélemy'},
    {key: 'SH', value: 'Saint Helena, Ascension and Tristan da Cunha'},
    {key: 'KN', value: 'Saint Kitts and Nevis'},
    {key: 'LC', value: 'Saint Lucia'},
    {key: 'MF', value: 'Saint Martin (French part)'},
    {key: 'PM', value: 'Saint Pierre and Miquelon'},
    {key: 'VC', value: 'Saint Vincent and the Grenadines'},
    {key: 'WS', value: 'Samoa'},
    {key: 'SM', value: 'San Marino'},
    {key: 'ST', value: 'Sao Tome and Principe'},
    {key: 'SA', value: 'Saudi Arabia'},
    {key: 'SN', value: 'Senegal'},
    {key: 'RS', value: 'Serbia'},
    {key: 'SC', value: 'Seychelles'},
    {key: 'SL', value: 'Sierra Leone'},
    {key: 'SG', value: 'Singapore'},
    {key: 'SX', value: 'Sint Maarten (Dutch part)'},
    {key: 'SK', value: 'Slovakia'},
    {key: 'SI', value: 'Slovenia'},
    {key: 'SB', value: 'Solomon Islands'},
    {key: 'SO', value: 'Somalia'},
    {key: 'ZA', value: 'South Africa'},
    {key: 'GS', value: 'South Georgia and the South Sandwich Islands'},
    {key: 'SS', value: 'South Sudan'},
    {key: 'ES', value: 'Spain'},
    {key: 'LK', value: 'Sri Lanka'},
    {key: 'SD', value: 'Sudan (the)'},
    {key: 'SR', value: 'Suriname'},
    {key: 'SJ', value: 'Svalbard and Jan Mayen'},
    {key: 'SE', value: 'Sweden'},
    {key: 'CH', value: 'Switzerland'},
    {key: 'SY', value: 'Syrian Arab Republic'},
    {key: 'TW', value: 'Taiwan'},
    {key: 'TJ', value: 'Tajikistan'},
    {key: 'TZ', value: 'Tanzania, United Republic of'},
    {key: 'TH', value: 'Thailand'},
    {key: 'TL', value: 'Timor-Leste'},
    {key: 'TG', value: 'Togo'},
    {key: 'TK', value: 'Tokelau'},
    {key: 'TO', value: 'Tonga'},
    {key: 'TT', value: 'Trinidad and Tobago'},
    {key: 'TN', value: 'Tunisia'},
    {key: 'TR', value: 'Turkey'},
    {key: 'TM', value: 'Turkmenistan'},
    {key: 'TC', value: 'Turks and Caicos Islands (the)'},
    {key: 'TV', value: 'Tuvalu'},
    {key: 'UG', value: 'Uganda'},
    {key: 'UA', value: 'Ukraine'},
    {key: 'AE', value: 'United Arab Emirates (the)'},
    {key: 'GB', value: 'United Kingdom of Great Britain and Northern Ireland (the)'},
    {key: 'UM', value: 'United States Minor Outlying Islands (the)'},
    {key: 'US', value: 'United States of America (the)'},
    {key: 'UY', value: 'Uruguay'},
    {key: 'UZ', value: 'Uzbekistan'},
    {key: 'VU', value: 'Vanuatu'},
    {key: 'VE', value: 'Venezuela (Bolivarian Republic of)'},
    {key: 'VN', value: 'Viet Nam'},
    {key: 'VG', value: 'Virgin Islands (British)'},
    {key: 'VI', value: 'Virgin Islands (U.S.)'},
    {key: 'WF', value: 'Wallis and Futuna'},
    {key: 'EH', value: 'Western Sahara'},
    {key: 'YE', value: 'Yemen'},
    {key: 'ZM', value: 'Zambia'},
    {key: 'ZW', value: 'Zimbabwe'},
    {key: 'AX', value: 'Åland Islands'},
    ] as JsonFormControlSelectOptions[],
      validators : { required: true } as JsonFormValidators
    } as JsonFormControls;

  }
  // private  addCheckBoxControle(): JsonFormControls {
  //   return {
  //     id: 'CheckBo',
  //     name : 'CheckBo',
  //     label : 'CheckBo:',
  //     placeholder : 'CheckBo',
  //     type : this.formControlTypes.Checkbox,
  //     checkboxoptions : [
  //       { key: '100', value: 'order 1' },
  //       { key: '200', value: 'order 2' },
  //       { key: '300', value: 'order 3' },
  //       { key: '400', value: 'order 4' },
  //     ] as JsonFormControlSelectOptions[],
  //     validators : { required: true } as JsonFormValidators
  //   } as JsonFormControls;
  // }

}
