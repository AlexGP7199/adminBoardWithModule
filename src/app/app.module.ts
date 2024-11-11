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
import { PersonaDetalleComponent } from './persona-detalle/persona-detalle.component';
import { WeeklyCalendarComponent } from './weekly-calendar/weekly-calendar.component';
import { AgentesRegionalesComponent } from './agentes-regionales/agentes-regionales.component';
import { AgentesNacionalesComponent } from './agentes-nacionales/agentes-nacionales.component';
import { SolicitudPermisosColaboradoresComponent } from './solicitud-permisos-colaboradores/solicitud-permisos-colaboradores.component'; // Importa FormsModule aquí
import { ReactiveFormsModule } from '@angular/forms';
import { TableroConflictosComponent } from './tablero-conflictos/tablero-conflictos.component'; // Importa ReactiveFormsModule

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AgentesComponent,
    CedulaFilterPipe,
    NombreFilterPipe,
    PersonaDetalleComponent,
    WeeklyCalendarComponent,
    AgentesRegionalesComponent,
    AgentesNacionalesComponent,
    SolicitudPermisosColaboradoresComponent,
    TableroConflictosComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DasboardModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
