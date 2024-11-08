import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './dashboard/components/content/content.component';
import { HorariosComponent } from './horarios/horarios.component';
import { AgentesComponent } from './agentes/agentes.component';
import { PersonaDetalleComponent } from './persona-detalle/persona-detalle.component';
import { WeeklyCalendarComponent } from './weekly-calendar/weekly-calendar.component';
import { AgentesRegionalesComponent } from './agentes-regionales/agentes-regionales.component';
import { AgentesNacionalesComponent } from './agentes-nacionales/agentes-nacionales.component';
import { SolicitudPermisosColaboradoresComponent } from './solicitud-permisos-colaboradores/solicitud-permisos-colaboradores.component';
import { AuthGuard } from './services/Guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { loginAuthGuard } from './services/Guard/login-auth.guard';

const routes: Routes = [
  // Ruta de login
  { path: 'login', component: LoginComponent, canActivate: [loginAuthGuard] },

  // Redirección inicial a Dashboard si el usuario está autenticado
  { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },

  // Rutas de Dashboard y sus subcomponentes (protegidas con AuthGuard)
  { path: 'Dashboard', component: ContentComponent, canActivate: [AuthGuard] },
  { path: 'CargarHorario', component: HorariosComponent, canActivate: [AuthGuard] },
  { path: 'Colaboradores', component: AgentesComponent, canActivate: [AuthGuard] },
  { path: 'detalle/:cedula', component: PersonaDetalleComponent, canActivate: [AuthGuard] },
  { path: 'horarioSemanal', component: WeeklyCalendarComponent, canActivate: [AuthGuard] },
  { path: 'ColaboradoresProvinciales', component: AgentesRegionalesComponent, canActivate: [AuthGuard] },
  { path: 'AgentesNacionalesComponent', component: AgentesNacionalesComponent, canActivate: [AuthGuard] },
  { path: 'FormularioSolicitud', component: SolicitudPermisosColaboradoresComponent, canActivate: [AuthGuard] },

  // Ruta comodín para manejar cualquier URL no encontrada
  { path: '**', redirectTo: 'Dashboard' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
