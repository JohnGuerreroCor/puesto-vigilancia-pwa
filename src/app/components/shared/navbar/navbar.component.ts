import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2'
import { FotoAntigua } from '../../../models/foto-antigua';
import { Estamento } from 'src/app/models/estamento';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  //public roles: String[] = this.auth.user.roles;
  //public rol: String = this.roles.toString();
  carnetEstudiante: boolean = false;
  carnetGraduado: boolean = false;
  carnetAdministrativo: boolean = false;
  carnetDocente: boolean = false;

  carnets: Estamento[] = [];

  url: string = environment.URL_BACKEND;
  panelOpenState = false;
  foto: FotoAntigua = {
    url: "",
  };

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
  ) {
    
  }


  scroll(page: HTMLElement) {
    page.scrollIntoView();
  }

  logout(): void {
    swal.fire({
      icon: 'success', title: 'Login',
      text: 'Sesión cerrada correctamente.',
      toast: true,
      position: 'top-right',
      timer: 1500
    })
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  

  }

  toggle() {
  
  }

}