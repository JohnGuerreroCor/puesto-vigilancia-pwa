import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { TokenComponent } from './components/token/token.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { DocentesComponent } from './components/docentes/docentes.component';
import { AdministrativosComponent } from './components/administrativos/administrativos.component';
import { GraduadosComponent } from './components/graduados/graduados.component';
import { PuestoComponent } from './components/puesto/puesto.component';
import { SuperiorComponent } from './components/superior/superior.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ExternosInvitadosComponent } from './components/externos/externos-invitados/externos-invitados.component';
import { ExternosVisitantesComponent } from './components/externos/externos-visitantes/externos-visitantes.component';
import { PoliticaComponent } from './components/politica/politica.component';
import { FirmaComponent } from './components/firma/firma.component';
import { CarnetsComponent } from './components/inicio/carnets/carnets.component';
import { PoliticasComponent } from './components/inicio/politicas/politicas.component';
import { PuestosComponent } from './components/inicio/puestos/puestos.component';
import { ExternosComponent } from './components/inicio/externos/externos.component';
import { EscanerComponent } from './components/escaner/escaner.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },

  { path: 'inicio', component: InicioComponent },
  { path: 'carnets', component: CarnetsComponent },
  { path: 'politicas', component: PoliticasComponent },
  { path: 'puestos', component: PuestosComponent },
  { path: 'externos', component: ExternosComponent },

  { path: 'escaner', component: EscanerComponent },

  { path: 'estudiantes', component: EstudiantesComponent },
  { path: 'docentes', component: DocentesComponent },
  { path: 'administrativos', component: AdministrativosComponent },
  { path: 'graduados', component: GraduadosComponent },
  { path: 'externos-invitados', component: ExternosInvitadosComponent },
  { path: 'externos-visitantes', component: ExternosVisitantesComponent },
  { path: 'puesto', component: PuestoComponent },
  { path: 'superior', component: SuperiorComponent },
  { path: 'horarios', component: HorariosComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'politica', component: PoliticaComponent },
  { path: 'firma', component: FirmaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', redirectTo: '/login' }

];

// {useHash: true, onSameUrlNavigation: 'reload'} parametros para recargar (F5) ruta con ID o variables

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
