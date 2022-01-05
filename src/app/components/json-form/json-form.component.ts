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
  constructor(private fb: FormBuilder, private http: HttpClient) { }

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

      this.dynamicForm.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );
    }
  }

  onSubmit(): void {
    alert('Form valid: ' + this.dynamicForm.valid);
    this.formRowValue = JSON.stringify(this.dynamicForm.getRawValue());
    console.log('Form valid: ', this.dynamicForm.valid);
    console.log('Form values: ', this.dynamicForm.value);
    console.log('Form Raw value: ', this.formRowValue);
  }
}
