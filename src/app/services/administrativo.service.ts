import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Persona } from '../models/persona';
import { AuthService } from './auth.service';
import swal from 'sweetalert2';
import { Administrativo } from '../models/administrativo';

@Injectable({
  providedIn: 'root'
})
export class AdministrativoService {
  private url: string = `${environment.URL_BACKEND}/administrativo`;
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


  getAdministrativo(id): Observable<Administrativo[]> {
    return this.http.get<Administrativo[]>(`${this.url}/administrativo-get/${id}/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() });
  }
}