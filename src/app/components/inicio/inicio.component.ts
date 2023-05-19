import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  mobile: boolean = false;

  anio: number;
  fecha = new Date();
  url: string = environment.URL_BACKEND;

  constructor(private router: Router) { }

  ngOnInit() {
    this.anio = this.fecha.getUTCFullYear();

    if (window.screen.width <= 950) { // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {
      if (window.screen.width <= 950) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    });
  }

  obtenerSedes() {

  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ocurrio Un Error!',
    })

  }

  mensajeSuccses() {
    Swal.fire({

      icon: 'success',
      title: 'Proceso Realizado',
      showConfirmButton: false,
      timer: 1500
    })
  }

  fError(er): void {

    let err = er.error.error_description;
    let arr: string[] = err.split(":");

    if (arr[0] == "Access token expired") {

      this.router.navigate(['login']);

    } else {
      this.mensajeError();
    }

  }

}