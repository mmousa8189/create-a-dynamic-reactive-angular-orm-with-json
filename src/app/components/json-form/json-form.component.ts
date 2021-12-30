import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnChanges,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: boolean;
  maxLength?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}
interface JsonFormControlOptions {
  min?: string;
  max?: string;
  step?: string;
  icon?: string;
}
interface JsonFormControlSelectOptions{
  key?:string;
  value?:string;
}
interface JsonFormControls {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  type: string;
  options?: JsonFormControlOptions;
  required: boolean;
  rows:string;
  selectoptions?:JsonFormControlSelectOptions[];
  validators: JsonFormValidators;
}
export interface JsonFormData {
  controls: JsonFormControls[];
}

@Component({
  selector: 'app-json-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './json-form.component.html',
  styleUrls: ['./json-form.component.css']
})
export class JsonFormComponent implements OnInit,OnChanges  {
  @Input() jsonFormData : JsonFormData | undefined;
  public dynamicForm: FormGroup = this.fb.group({});
  public payLoad:string|undefined;
  constructor(private fb: FormBuilder,private http: HttpClient) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.jsonFormData.firstChange) {
      console.log(this.jsonFormData);
      if(this.jsonFormData)
        this.createForm(this.jsonFormData.controls);
    }
  }

  createForm(controls: JsonFormControls[]) {
    for (const control of controls) {
      const validatorsToAdd = [];

      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }

      this.dynamicForm.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );
    }
  }

  onSubmit() {
    alert('Form valid: '+ this.dynamicForm.valid)
    this.payLoad = JSON.stringify(this.dynamicForm.getRawValue());
    console.log('Form valid: ', this.dynamicForm.valid);
    console.log('Form values: ', this.dynamicForm.value);
    console.log('Form Raw value: ', this.payLoad);
  }
}
