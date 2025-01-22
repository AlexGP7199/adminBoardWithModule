import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DasboardModule } from './dashboard/dasboard.module';
import { LoginComponent } from './login/login.component';
import { AgentesComponent } from './agentes/agentes.component';
import { HorariosComponent } from './horarios/horarios.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CedulaFilterPipe } from './pipes/cedula-filter.pipe';
import { NombreFilterPipe } from './pipes/nombre-filter.pipe';
import { FormsModule } from '@angular/forms';
import { PersonaDetalleComponent } from './persona-detalle/persona-detalle.component';
import { WeeklyCalendarComponent } from './weekly-calendar/weekly-calendar.component';
import { AgentesRegionalesComponent } from './agentes-regionales/agentes-regionales.component';
import { AgentesNacionalesComponent } from './agentes-nacionales/agentes-nacionales.component';
import { SolicitudPermisosColaboradoresComponent } from './solicitud-permisos-colaboradores/solicitud-permisos-colaboradores.component'; // Importa FormsModule aquí
import { ReactiveFormsModule } from '@angular/forms';
import { TableroConflictosComponent } from './tablero-conflictos/tablero-conflictos.component';
import { FiltroConflictosPipe } from './tablero-conflictos/pipes/filtro-conflictos.pipe';
import { TableroUsuariosComponent } from './tablero-usuarios/tablero-usuarios.component';
import { FiltroUsuarioPipe  } from './tablero-usuarios/pipes/filtro-cedula.pipe'; // Importa ReactiveFormsModule
import { loginAuthGuard } from './services/Guard/login-auth.guard';
import { AuthGuard } from './services/Guard/auth.guard';
import { PiboteScreenComponent } from './pibote-screen/pibote-screen.component';
import { FormSolicitudValidacionFechasComponent } from './form-solicitud-validacion-fechas/form-solicitud-validacion-fechas.component';
import { SolicitudPermisoComponent } from './solicitud-permiso/solicitud-permiso.component';
import { NewUsuarioComponent } from './new-usuario/new-usuario.component';
import { NewAmbulanciaComponent } from './new-ambulancia/new-ambulancia.component';
import { AmbulanciasExcelUploadComponent } from './ambulancias-excel-upload/ambulancias-excel-upload.component';
import { ColaboradoresExcelCargaComponent } from './colaboradores-excel-carga/colaboradores-excel-carga.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HttpRequestInterceptor } from './services/interceptors/http.interceptor';
import { FechaFormatPipe } from './pipes/fecha-format.pipe';

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
    FiltroConflictosPipe,
    TableroUsuariosComponent,
    FiltroUsuarioPipe,
    PiboteScreenComponent,
    FormSolicitudValidacionFechasComponent,
    SolicitudPermisoComponent,
    NewUsuarioComponent,
    NewAmbulanciaComponent,
    AmbulanciasExcelUploadComponent,
    ColaboradoresExcelCargaComponent,
    SpinnerComponent,
    FechaFormatPipe,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DasboardModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [loginAuthGuard, AuthGuard,  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
