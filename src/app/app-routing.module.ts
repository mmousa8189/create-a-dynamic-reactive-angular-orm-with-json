import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';


const routes: Routes = [
  { path: 'showdynamicform', component: DynamicFormComponent },
  //{ path: 'buildform', component: HeroesComponent },
  {path: '**', redirectTo: '/' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
