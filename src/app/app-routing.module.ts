import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormBuilderComponent } from './components/dynamic-form-builder/dynamic-form-builder.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';


const routes: Routes = [
  { path: 'showdynamicform', component: DynamicFormComponent },
  { path: 'dynamicFormBuilder', component: DynamicFormBuilderComponent },
  {path: '**', redirectTo: '/' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
