import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import swal from 'sweetalert2'
import { Correo } from 'src/app/models/correo';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  correo: Correo = null;
  codigo: String;
  codioCorrecto: String;
  today = new Date();
  cargando: boolean = false;
  @Output() rolEvent = new EventEmitter<any>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  validarToken() {
    swal.fire({
      icon: "success",
      title: "Inicio de sesión ",
      text: "Codigo de verificación correcto.",
    });
  }


  fError(er): void {
    this.cargando = false;
    let err = er.error.error_description;
    let arr: string[] = err.split(":");
    if (arr[0] == "Access token expired") {
      this.router.navigate(['/login']);
      this.cargando = false;
    } else {
      this.cargando = false;
    }

  }

}