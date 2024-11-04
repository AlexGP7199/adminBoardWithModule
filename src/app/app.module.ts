import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DasboardModule } from './dashboard/dasboard.module';
import { LoginComponent } from './login/login.component';
import { AgentesComponent } from './agentes/agentes.component';
import { HorariosComponent } from './horarios/horarios.component';
import { HttpClientModule } from '@angular/common/http';
import { CedulaFilterPipe } from './pipes/cedula-filter.pipe';
import { NombreFilterPipe } from './pipes/nombre-filter.pipe';
import { FormsModule } from '@angular/forms';
import { PersonaDetalleComponent } from './persona-detalle/persona-detalle.component'; // Importa FormsModule aquí

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AgentesComponent,
    CedulaFilterPipe,
    NombreFilterPipe,
    PersonaDetalleComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DasboardModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
