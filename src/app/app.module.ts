import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JsonFormComponent } from './components/json-form/json-form.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicFormBuilderComponent } from './components/dynamic-form-builder/dynamic-form-builder.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpProxyService } from './services/http-proxy.service';
import { DynmicFormProxyService } from './services/dynmic-form-proxy.service';
import { AppConfigService } from './services/app-config.service';

@NgModule({
  declarations: [
    AppComponent,
    JsonFormComponent,
    DynamicFormComponent,
    DynamicFormBuilderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [AppConfigService, HttpProxyService, DynmicFormProxyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
