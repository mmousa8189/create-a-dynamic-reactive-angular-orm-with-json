export enum JsonFormControlTypes {
Text="text",
Password="password",
Email="email",
Number="number",
Search="search",
Tel="tel",
Url="url",
Select="select",
Checkbox="checkbox",
}

export const JsonFormControlTypesMapping: Record<JsonFormControlTypes, string> = {
  [JsonFormControlTypes.Text]: "text",
  [JsonFormControlTypes.Password]: "password",
  [JsonFormControlTypes.Email]: "email",
  [JsonFormControlTypes.Number]: "number",
  [JsonFormControlTypes.Search]: "search",
  [JsonFormControlTypes.Tel]: "tel",
  [JsonFormControlTypes.Url]: "url",
  [JsonFormControlTypes.Select]: "select",
  [JsonFormControlTypes.Checkbox]: "checkbox",
};
