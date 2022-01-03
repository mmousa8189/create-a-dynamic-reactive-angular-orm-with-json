import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { DynamicFormBuilderComponent } from './components/dynamic-form-builder/dynamic-form-builder.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';


const routes: Routes = [
  { path: 'showdynamicform', component: DynamicFormComponent },
  { path: 'dynamicFormBuilder', component: DynamicFormBuilderComponent },
  {path: '**', redirectTo: '/' },
];

const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled",
  // ...any other options you'd like to use
};
@NgModule({
  imports: [RouterModule.forRoot(routes,routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
