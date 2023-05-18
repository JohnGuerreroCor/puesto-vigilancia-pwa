import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { TipoDocumento } from '../../models/tipo-documento';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { Sede } from '../../models/sede';
import { SubSede } from '../../models/sub-sede';
import { UbicacionService } from '../../services/ubicacion.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  selector: 'app-superior',
  templateUrl: './superior.component.html',
  styleUrls: ['./superior.component.css'],
  providers: [DatePipe]
})
export class SuperiorComponent implements OnInit {

  //Arreglos
  tipoDocumentos: TipoDocumento[] = [];
  sedes: Sede[] = [];
  subsedes: SubSede[] = [];

  //Booleanos
  tipoLugar: boolean = true;
  terceroExiste: boolean;
  ticket: boolean = false;
  botonesTickets: boolean = false;

  //Complementos

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['index', 'nombre', 'lugar', 'inicio', 'fin', 'opciones'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  qrCodeTwo: String = null;
  formTercero: FormGroup;
  selectDateInicio: Date | null;
  selectDateFin: Date | null;
  dateInicio = new FormControl(new Date());
  dateFin = new FormControl(new Date());
  myControl = new FormControl();
  oficinaCodigo: number;
  carnetLugar:String = 'Lugar';
  carnetNombre:String = 'Nombre';
  carnetId: String = '********';
  carnetCorreo: String = '@email.com'
  carnetInicio: String = '';
  carnetVigencia: String = '';

  constructor(
    private formBuilder: FormBuilder,
    public tipoDocumentoService: TipoDocumentoService,
    public ubicacionService: UbicacionService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    ) {

    if (this.authService.validacionToken()) {
      this.qrCodeTwo = "https://gaitana.usco.edu.co/sgd/";
      this.obtenerSede();
      this.obtenerTipoDocumento();
    }
  }

  ngOnInit() {
    this.crearFormularioTercero();
  }

  private crearFormularioTercero(): void {
    this.formTercero = this.formBuilder.group({
      //Vaiables Entidad Tercero
      codigo: new FormControl(''),
      tipoDocumento: new FormControl({ value: '', disabled: true }, Validators.required),
      identificacion: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      nombreCompleto: new FormControl(''),
      nombre1: new FormControl(''),
      nombre2: new FormControl(''),
      apellido1: new FormControl(''),
      apellido2: new FormControl(''),
      email: new FormControl({ value: '', disabled: true }, Validators.required),
      //Variables Entidad TicketVisitante
      terceroCodigo: new FormControl(''),
      nombre: new FormControl(''),
      apellido: new FormControl({ value: '', disabled: true }, Validators.required),
      sede: new FormControl(''),
      subsede: new FormControl(''),
      bloque: new FormControl(''),
      oficina: new FormControl(''),
      sedeCodigo: new FormControl(''),
      subsedeCodigo: new FormControl(''),
      bloqueCodigo: new FormControl(''),
      oficinaCodigo: new FormControl(''),
      tipoUbicacion: new FormControl('', Validators.required),
    });
  }

  obtenerSede() {
    this.ubicacionService.obtenerSedes().subscribe(data => {
      this.sedes = data;
      console.log(this.sedes);
    });

  }

  obtenerTipoDocumento() {
    this.tipoDocumentoService.getTiposDocumentos().subscribe(data => {
      this.tipoDocumentos = data;
    });
  }

}
