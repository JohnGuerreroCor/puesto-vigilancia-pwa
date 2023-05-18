import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;
  hide = true;
  ver = true;
  today = new Date();
  cargando: boolean = false;

  constructor(public authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      if (this.authService.codigoverificacion != null) {
        swal.fire({
          icon: 'info', title: 'Login Info', text: 'Ya se ha iniciado sesión',
          toast: true,
          position: 'top-right',
          timer: 1500
        })
        this.router.navigate(['inicio']);
      } else {
        this.router.navigate(['token']);
      }
    }
  }

  login(): void {
    this.cargando = true;
    if (this.usuario.username == null || this.usuario.password == null) {
      swal.fire({
        icon: 'error', title: 'Error de inicio de sesión', text: 'Usuario o contraseña vacía', toast: true,
        position: 'top-right',
        timer: 1500
      });
      this.cargando = false;
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      swal.fire({
        icon: 'success', title: 'inicio de sesión ', text: 'Inicio de sesión exitoso.', toast: true,
        position: 'top-right',
        timer: 1500
      });
      this.router.navigate(['/token']);
    }, err => this.fError(err));
  }

  fError(er): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(":");
    if (arr[0] == "Access token expired") {
      this.router.navigate(['login']);
      this.cargando = false;
    } else {
      this.cargando = false;
    }

  }

}