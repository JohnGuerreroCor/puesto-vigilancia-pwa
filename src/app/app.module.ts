import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
//import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTreeModule } from '@angular/material/tree';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule, MatDialogModule, MatGridListModule, MatNativeDateModule, MatTableModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatRadioModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import { ZXingScannerModule } from "@zxing/ngx-scanner";

//INICIO INTEGRACION FIREBASE PARA IMAGENES LINEALES EMAIL - REMPLAZO DE DATA URI BASE64

import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthGuardModule } from "@angular/fire/auth-guard";

//FIN INTEGRACION FIREBASE PARA IMAGENES LINEALES EMAIL - REMPLAZO DE DATA URI BASE64

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { DocentesComponent } from './components/docentes/docentes.component';
import { AdministrativosComponent } from './components/administrativos/administrativos.component';
import { GraduadosComponent } from './components/graduados/graduados.component';
import { PuestoComponent, ModalInformacion } from './components/puesto/puesto.component';
import { SuperiorComponent } from './components/superior/superior.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ExternosInvitadosComponent, ModalTiqueteInvitado } from './components/externos/externos-invitados/externos-invitados.component';
import { ExternosVisitantesComponent, ModalTiqueteVisitante } from './components/externos/externos-visitantes/externos-visitantes.component';
import { PoliticaComponent } from './components/politica/politica.component';
import { FirmaComponent, ModalFirma } from './components/firma/firma.component';
import { PoliticasComponent } from './components/inicio/politicas/politicas.component';
import { CarnetsComponent } from './components/inicio/carnets/carnets.component';
import { PuestosComponent } from './components/inicio/puestos/puestos.component';
import { ExternosComponent } from './components/inicio/externos/externos.component';
import { EscanerComponent } from './components/escaner/escaner.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    TokenComponent,
    InicioComponent,
    EstudiantesComponent,
    DocentesComponent,
    AdministrativosComponent,
    GraduadosComponent,
    PuestoComponent,
    SuperiorComponent,
    HorariosComponent,
    ReportesComponent,
    ExternosInvitadosComponent,
    ExternosVisitantesComponent,
    PoliticaComponent,
    FirmaComponent,
    ModalFirma,
    ModalInformacion,
    ModalTiqueteVisitante,
    ModalTiqueteInvitado,
    PoliticasComponent,
    CarnetsComponent,
    PuestosComponent,
    ExternosComponent,
    EscanerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatPaginatorModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    MatGridListModule,
    MatNativeDateModule,
    MatTableModule,
    MatExpansionModule,
    MatTreeModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatDatepickerModule,
    FormsModule,
    QRCodeModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireDatabaseModule,
    NgxPrintModule,
    ZXingScannerModule
  ],
  entryComponents: [
    ModalFirma,
    ModalInformacion,
    ModalTiqueteVisitante,
    ModalTiqueteInvitado
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
