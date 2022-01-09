import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnChanges,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JsonFormControlTypes } from 'src/app/models/json-form-control-types.enum';
import { JsonFormControls } from 'src/app/models/json-form-controls';
import { JsonFormData } from 'src/app/models/json-form-data';







@Component({
  selector: 'app-json-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './json-form.component.html',
  styleUrls: ['./json-form.component.css']
})
export class JsonFormComponent implements OnInit, OnChanges  {
  @Input() jsonFormData: JsonFormData | undefined;
  public dynamicForm: FormGroup = this.fb.group({});
  public formRowValue: string|undefined;
  formControlTypes = JsonFormControlTypes;
   checkboxControleNameTempo = '';
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.jsonFormData.firstChange) {
      console.log(this.jsonFormData);
      if (this.jsonFormData) {
        this.createForm(this.jsonFormData.controls);
      }
    }
  }

  createForm(controls: JsonFormControls[]): void {
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

      if (control.type  !== this.formControlTypes.Checkbox) {
      this.dynamicForm.addControl( control.name, this.fb.control(control.value, validatorsToAdd) );
      }else {
        this.checkboxControleNameTempo = control.name;
        this.dynamicForm.addControl( control.name, this.fb.array([], validatorsToAdd));
        control.checkboxoptions.forEach(() => this.checkBoxesFormArray.push(new FormControl()));
      }
    }
  }


   get checkBoxesFormArray(): FormArray {
     const name = this.checkboxControleNameTempo as string;
     return this.dynamicForm.controls[name] as FormArray;
  }

  mapCheckBoxValue(): void{
      const checkboxoptions  = (this.jsonFormData?.controls
        .find(e => e.name === this.checkboxControleNameTempo) as JsonFormControls).checkboxoptions;
      const selectedKeys = this.dynamicForm.value[this.checkboxControleNameTempo]
      .map((checked: any, i: any) => {
        if(checked){
        return checkboxoptions[i].key;
        }else{
          return null;
        }
      })
      .filter((v: any) => v !== null);
      this.dynamicForm.controls[this.checkboxControleNameTempo].patchValue(selectedKeys);

  }
  onSubmit(): void {
    this.mapCheckBoxValue();
    alert('Form valid: ' + this.dynamicForm.valid);
    this.formRowValue = JSON.stringify(this.dynamicForm.getRawValue());
    console.log('Form valid: ', this.dynamicForm.valid);
    console.log('Form values: ', this.dynamicForm.value);
    console.log('Form Raw value: ', this.formRowValue);
  }
}
