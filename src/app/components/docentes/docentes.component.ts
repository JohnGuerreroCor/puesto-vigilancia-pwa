import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocenteService } from '../../services/docente.service';
import { Docente } from '../../models/docente';
import { FotoService } from 'src/app/services/foto.service';
import { FotoAntigua } from '../../models/foto-antigua';
import { PoliticaService } from '../../services/politica.service';
import { PoliticaEstamento } from '../../models/politica-estamento';
import { FirmaDigitalService } from '../../services/firma-digital.service';
import { fromEvent, Observable, Subscription } from "rxjs";
import { FirmaDigital } from '../../models/firma-digital';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.css']
})
export class DocentesComponent implements OnInit {

  //Booleanos
  alert: boolean = true;
  cargaFoto: boolean = false;
  mobile: boolean = false;

  //Objetos
  docente: Docente[] = [];
  politicaDocente: PoliticaEstamento[] = [];
  firmaDigital: FirmaDigital[] = [];

  //Complementos
  resizeObservable: Observable<Event>
  resizeSubscription: Subscription
  vistaMobile: String = '';

  codigoQr: string = null;
  busqueda: String;
  url: string = environment.URL_BACKEND;
  nameFile = "Seleccione la foto a cargar...";
  file: FileList;
  foto: FotoAntigua = {
    url: "",
  };
  firma: FotoAntigua = {
    url: "",
  };

  constructor(
    public docenteService: DocenteService,
    public fotoService: FotoService,
    public politicaService: PoliticaService,
    public firmaService: FirmaDigitalService,
    private auth: AuthService,
    private router: Router
  ) {
    this.codigoQr = 'https://www.usco.edu.co/';
  }

  find(id: String) {
    if (window.screen.width <= 1360) { // 768px portrait
      this.mobile = true;
    }
    this.docenteService.getDocente(id).subscribe(data => {
      if (JSON.stringify(data) !== "[]") {
        this.docente = data;
        this.codigoQr = 'https://sanagustin.usco.edu.co/planes_academicos/obtenerFoto/' + this.docente[0].persona.codigo;
        this.mostrarFoto('' + this.docente[0].persona.codigo);
      } else {
        this.docente = [];
        this.codigoQr = 'Sin resultado';
        Swal.fire({
          icon: 'warning',
          title: 'No existe',
          text: 'La cédula digitada no encontró ningún Docente asociado, por favor rectifique el documento.',
        });
      }
    });
  }

  ngOnInit() {
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
    })
    this.vistaMobile = '' + window.screen.width;

    this.buscarPoliticaEstamento();
    this.buscarFirmaActiva();
  }

  buscarFirmaActiva() {
    this.firmaService.obtenerFirmaActiva().subscribe(data => {
      if (JSON.stringify(data) !== '[]') {
        this.obtenerFirma(+data[0].ruta);
      }
    });
  }

  obtenerFirma(ruta: number) {
    this.firmaService.mirarFirma(ruta).subscribe(data => {
      var blob = new Blob([data], { type: 'image/png' });
      const foto = blob;
      const reader = new FileReader();
      reader.onload = () => {
        this.firma.url = reader.result as string;
      }
      reader.readAsDataURL(foto);
    });
  }

  buscarPoliticaEstamento() {
    this.politicaService.obtenerPoliticaPorCodigoEstamento(3).subscribe(data => {
      this.politicaDocente = data;
    });
  }

  subirFoto() {
    let file: File = this.file.item(0);
    const foto = new File([file], this.docente[0].persona.codigo + '.png', { type: file.type });
    this.fotoService.subirFoto(foto).subscribe(data => {
      this.mensajeRealizado();
    });
  }

  mostrarFoto(perCodigo: String) {
    this.fotoService.mirarFoto(perCodigo).subscribe(data => {
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
        this.fotoService.mirarFotoAntigua('' + this.docente[0].persona.codigo).subscribe(data => {
          this.foto = data;
        });
      }
    });
  }


  change(file: FileList): void {
    this.nameFile = file[0].name.replace(/\s/g, "");
    const foto = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.foto.url = reader.result as string;
    }
    reader.readAsDataURL(foto)
    if (file[0].size > 8100000) {
      Swal.fire({
        title: 'El archivo supera el limite de tamaño que es de 8mb',
        confirmButtonText: 'Entiendo',
        confirmButtonColor: '#8f141b',

      })

    } else {
      this.file = file;
      this.cargaFoto = true;
      Swal.fire({
        icon: 'success',
        title: 'Foto cargada, recuerde guardar los cambios realizados.',
        showConfirmButton: true,
        confirmButtonColor: '#8f141b',
      })
    }
  }

  mensajeRealizado() {
    Swal.fire({

      icon: 'success',
      title: 'Proceso Realizado',
      showConfirmButton: false,
      timer: 1500
    })
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ocurrio Un Error!',
    })

  }

  fError(er): void {

    let err = er.error.error_description;
    let arr: string[] = err.split(":");
    this.mensajeError()
    if (arr[0] == "Access token expired") {

      this.auth.logout();
      this.router.navigate(['login']);

    } else {
      this.mensajeError();
    }

  }
}