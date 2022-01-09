export enum JsonFormControlTypes {
Text= 'text',
TextArea= 'textarea',
Password= 'password',
Email= 'email',
Number= 'number',
Search= 'search',
Tel= 'tel',
Url= 'url',
Select= 'select',
Checkbox= 'checkbox',
RadioButton= 'radio',
}

export const JsonFormControlTypesMapping: Record<JsonFormControlTypes, string> = {
  [JsonFormControlTypes.Text]: 'text',
  [JsonFormControlTypes.TextArea]: 'textarea',
  [JsonFormControlTypes.Password]: 'password',
  [JsonFormControlTypes.Email]: 'email',
  [JsonFormControlTypes.Number]: 'number',
  [JsonFormControlTypes.Search]: 'search',
  [JsonFormControlTypes.Tel]: 'tel',
  [JsonFormControlTypes.Url]: 'url',
  [JsonFormControlTypes.Select]: 'select',
  [JsonFormControlTypes.Checkbox]: 'checkbox',
  [JsonFormControlTypes.RadioButton]: 'radio',
};
