import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavbarHiddenService } from 'src/app/services/navbar-hidden.service';
import { FotoService } from 'src/app/services/foto.service';
import swal from 'sweetalert2'
import { FotoAntigua } from '../../../models/foto-antigua';
import { EstamentoService } from 'src/app/services/estamento.service';
import { Estamento } from 'src/app/models/estamento';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  public perCodigo: number = this.auth.user.per_codigo;
  public perCodigoAntigua: String = '' + this.auth.user.per_codigo;
  public nombre: String = this.auth.user.nombre;
  public apellido: String = this.auth.user.apellido;
  public uaa: String[] = this.auth.user.uaa.split(" ");
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
    public auth: AuthService,
    private router: Router,
    public estamentoService: EstamentoService,
    public navbarHiddenService: NavbarHiddenService,
    public fotoService: FotoService
  ) {
    this.fotoService.mirarFoto('' + this.perCodigo).subscribe(data => {
      var gg = new Blob([data], { type: 'application/json' })
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
        }
        reader.readAsDataURL(foto)

      } else {
        this.fotoService.mirarFotoAntigua('' + this.perCodigo).subscribe(data => {
          this.foto = data;
        });
      }
    });
  }


  scroll(page: HTMLElement) {
    page.scrollIntoView();
  }

  logout(): void {
    this.auth.logout();
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
    this.estamentoService.obtenerCarnets(this.perCodigo).subscribe(data => {
      this.carnets = data;
      for (let index = 0; index < this.carnets.length; index++) {
        switch (this.carnets[index].codigo) {
          case 1://ADMINISTRATIVO
            this.carnetAdministrativo = true;
            break;
          case 2://ESTUDIANTE
            this.carnetEstudiante = true;
            break;
          case 3://DOCENTE
            this.carnetDocente = true;
            break;
          case 4://GRADUADO
            this.carnetGraduado = true;
            break;
        }
      }
    });

  }

  toggle() {
    this.navbarHiddenService.toggleSideBar();
  }

}