import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DasboardModule } from './dashboard/dasboard.module';


@NgModule({
  declarations: [
    AppComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DasboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
