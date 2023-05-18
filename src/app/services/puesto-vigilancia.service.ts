import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Oficina } from '../models/oficina';
import { PuestoTipo } from '../models/puesto-tipo';
import { PuestoVigilancia } from '../models/puesto-vigilancia';
import swal from 'sweetalert2';
import { Dia } from '../models/dia';
import { Hora } from '../models/hora';

@Injectable({
  providedIn: 'root'
})
export class PuestoVigilanciaService {
  private url: string = `${environment.URL_BACKEND}/puestoVigilancia`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;

  constructor(private http: HttpClient, private router: Router,
    private authservice: AuthService) { }

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  obtenerPuestoTipo(): Observable<PuestoTipo[]> {
    return this.http.get<PuestoTipo[]>(`${this.url}/obtener-puesto-vigilancia-tipo/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  obtenerPuestoVigilanciaCodigo(codigo: number): Observable<PuestoVigilancia[]> {
    return this.http.get<PuestoVigilancia[]>(`${this.url}/obtener-puesto-vigilancia-codigo/${codigo}/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  obtenerPuestoVigilancia(): Observable<PuestoVigilancia[]> {
    return this.http.get<PuestoVigilancia[]>(`${this.url}/obtener-puesto-vigilancia/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  obtenerPuestoVigilanciaPorBloqueTipo(subsede: number, tipo: number): Observable<PuestoVigilancia[]> {
    return this.http.get<PuestoVigilancia[]>(`${this.url}/obtener-puesto-vigilancia-bloque-tipo/${subsede}/${tipo}/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  obtenerDia(): Observable<Dia[]> {
    return this.http.get<Dia[]>(`${this.url}/obtener-dias/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  obtenerHora(): Observable<Hora[]> {
    return this.http.get<Hora[]>(`${this.url}/obtener-horas/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  registrarPuestoVigilancia(puestoVigilancia: PuestoVigilancia): Observable<number> {
    console.log('Servicio Actualizar:: ', puestoVigilancia);
    return this.http.post<number>(`${this.url}/registrar-puesto-vigilancia/${this.userLogeado}`, puestoVigilancia, { headers: this.aggAutorizacionHeader() });
  }

  actualizarPuestoVigilancia(puestoVigilancia: PuestoVigilancia): Observable<number> {
    console.log('Servicio Actualziar:: ', puestoVigilancia);
    return this.http.put<number>(`${this.url}/actualizar-puesto-vigilancia/${this.userLogeado}`, puestoVigilancia, { headers: this.aggAutorizacionHeader() });
  }

}
