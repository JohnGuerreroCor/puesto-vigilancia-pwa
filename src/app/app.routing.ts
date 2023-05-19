import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { TokenComponent } from './components/token/token.component';
import { ExternosInvitadosComponent } from './components/externos/externos-invitados/externos-invitados.component';
import { ExternosVisitantesComponent } from './components/externos/externos-visitantes/externos-visitantes.component';
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

  { path: 'externos-invitados', component: ExternosInvitadosComponent },
  { path: 'externos-visitantes', component: ExternosVisitantesComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', redirectTo: '/login' }

];

// {useHash: true, onSameUrlNavigation: 'reload'} parametros para recargar (F5) ruta con ID o variables

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
