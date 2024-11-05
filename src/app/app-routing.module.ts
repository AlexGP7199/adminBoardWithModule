import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './dashboard/components/content/content.component';
import { HorariosComponent } from './horarios/horarios.component';
import { AgentesComponent } from './agentes/agentes.component';
import { PersonaDetalleComponent } from './persona-detalle/persona-detalle.component';
import { WeeklyCalendarComponent } from './weekly-calendar/weekly-calendar.component';
import { AgentesRegionalesComponent } from './agentes-regionales/agentes-regionales.component';
import { AgentesNacionalesComponent } from './agentes-nacionales/agentes-nacionales.component';
const routes: Routes = [
  // Redirección inicial a Dashboard
  { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },

  // Rutas de Dashboard y sus subcomponentes
  { path: 'Dashboard', component: ContentComponent },
  { path: 'CargarHorario', component: HorariosComponent },
  {path: 'Colaboradores', component: AgentesComponent},
  { path: 'detalle/:cedula', component: PersonaDetalleComponent }, // Ruta para el detalle
  {path: 'horarioSemanal', component: WeeklyCalendarComponent},
  {path: 'ColaboradoresProvinciales', component: AgentesRegionalesComponent},
  {path: 'AgentesNacionalesComponent', component : AgentesNacionalesComponent },

  // Carga perezosa de módulos de características
  {
    path: 'FormContent',
    loadChildren: () => import('./dashboard/pages/forms/forms-page.module').then(m => m.FormsPageModule)
  },
  {
    path: 'TablesContent',
    loadChildren: () => import('./dashboard/pages/tables/tables.module').then(m => m.TablesModule)
  },

  // Ruta comodín para manejar cualquier URL no encontrada
  { path: '**', redirectTo: 'Dashboard' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
