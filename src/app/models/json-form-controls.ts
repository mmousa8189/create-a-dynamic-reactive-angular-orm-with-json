import { JsonFormControlOptions } from "./json-form-control-options";
import { JsonFormControlSelectOptions } from "./json-form-control-select-options";
import { JsonFormValidators } from "./json-form-validators";

export interface JsonFormControls {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  type: string;
  options?: JsonFormControlOptions;
  rows:string;
  selectoptions?:JsonFormControlSelectOptions[];
  validators: JsonFormValidators;
}
