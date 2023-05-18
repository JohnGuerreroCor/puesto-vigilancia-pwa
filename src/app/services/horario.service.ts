import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import swal from 'sweetalert2';
import { Dia } from '../models/dia';
import { Hora } from '../models/hora';
import { Horario } from '../models/horario';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private url: string = `${environment.URL_BACKEND}/horario`;
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

  obtenerHorario(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.url}/obtener-horarios/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  registrarHorario(horario: Horario): Observable<number> {
    console.log('Servicio Registrar:: ', horario);
    return this.http.post<number>(`${this.url}/registrar-horario/${this.userLogeado}`, horario, { headers: this.aggAutorizacionHeader() });
  }

  actualizarHorario(horario: Horario): Observable<number> {
    console.log('Servicio Actualziar:: ', horario);
    return this.http.put<number>(`${this.url}/actualizar-horario/${this.userLogeado}`, horario, { headers: this.aggAutorizacionHeader() });
  }

}
