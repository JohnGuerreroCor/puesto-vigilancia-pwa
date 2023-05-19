import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TipoDocumento } from '../../../models/tipo-documento';
import { Tercero } from '../../../models/tercero';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Sede } from '../../../models/sede';
import { SubSede } from '../../../models/sub-sede';
import { Bloque } from '../../../models/bloque';
import { Oficina } from '../../../models/oficina';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Ticket } from '../../../models/ticket';
import { DatePipe } from '@angular/common';
import { Persona } from '../../../models/persona';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-externos-visitantes',
  templateUrl: './externos-visitantes.component.html',
  styleUrls: ['./externos-visitantes.component.css'],
  providers: [DatePipe]
})
export class ExternosVisitantesComponent implements OnInit {

  //Arreglos
  listaTickets: Ticket[] = [];
  tipoDocumentos: TipoDocumento[] = [];
  tercero: Tercero[] = [];
  sedes: Sede[] = [];
  subsedes: SubSede[] = [];
  bloques: Bloque[] = [];
  oficinas: Oficina[] = [];
  persona: Persona[] = [];
  emails = [];

  //Booleanos
  tipoLugar: boolean = true;
  terceroExiste: boolean;
  ipuntEmailPersona: boolean = false;
  personaExiste: boolean = false;
  graduadoExiste: boolean;
  correoGraduado: boolean = false;
  ticket: boolean = false;
  botonesTickets: boolean = false;
  enviarTicketPersona: boolean = true;

  //Complementos

  dataSource = new MatTableDataSource<Ticket>([]);
  displayedColumns: string[] = ['index', 'nombre', 'lugar', 'fin', 'opciones'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  qrCodeTwo: String = null;
  formTercero: FormGroup;
  selectDateInicio: Date | null;
  selectDateFin: Date | null;
  dateInicio = new FormControl(new Date());
  dateFin = new FormControl(new Date());
  filteredOptions: Observable<Oficina[]>;
  myControl = new FormControl();
  oficinaCodigo: number;
  carnetLugar: String = 'Lugar';
  carnetNombre: String = 'Nombre';
  carnetId: String = '********';
  carnetCorreo: String = '@email.com'
  carnetInicio: String = '';
  carnetVigencia: String = '';
  codigoTercero: number;

  mobile: boolean = false;

  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe,
  ) {

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
    });
    this.crearFormularioTercero();
    this.obtenerTickets();
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
      emailPersona: new FormControl(''),
      //Variables Entidad TicketVisitante
      terceroCodigo: new FormControl(''),
      nombre: new FormControl({ value: '', disabled: true }, Validators.required),
      apellido: new FormControl({ value: '', disabled: true }, Validators.required),
      sede: new FormControl({ value: '', disabled: true }, Validators.required),
      subsede: new FormControl({ value: '', disabled: true }, Validators.required),
      bloque: new FormControl(''),
      oficina: new FormControl(''),
      sedeCodigo: new FormControl(''),
      subsedeCodigo: new FormControl(''),
      bloqueCodigo: new FormControl(''),
      oficinaCodigo: new FormControl(''),
      tipoUbicacion: new FormControl('', Validators.required),
    });
  }

  obtenerTickets() {
  }

  tipoRegistro() {
    this.correoGraduado = !this.correoGraduado;
    this.ipuntEmailPersona = !this.ipuntEmailPersona;
  }

  obtenerSede() {

  }

  obtenerTipoDocumento() {

  }

  buscarPersona() {
    this.enviarTicketPersona = true;
    this.ipuntEmailPersona = false;
    this.emails = [];
  }

  buscarTercero() {
    this.graduadoExiste = false;
  }

  buscarSubsede(codigo: number) {
    this.formTercero.get('subsede').reset;

    this.formTercero.get('oficina').reset;

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  buscarOficina(codigo: number) {
    this.formTercero.get('oficina').reset;

  }

  buscarBloque(codigo: number) {
    this.formTercero.get('bloque').reset;

  }

  generarTercero(): void {

  }

  resgistrarTercero(tercero: Tercero) {


  }

  actualizarTercero(tercero: Tercero) {

  }

  generarTicketTercero(): void {

  }

  generarTicketPersona(): void {
    this.ticket = !this.ticket;
    let ticket: Ticket = new Ticket();
    let sede: Sede = new Sede();
    let subSede: SubSede = new SubSede();
    let bloque: Bloque = new Bloque();
    let oficina: Oficina = new Oficina();
    let tercero: Tercero = new Tercero();
    let persona: Persona = new Persona();
    persona.codigo = this.persona[0].codigo;
    ticket.persona = persona;
    tercero.codigo = null;
    ticket.tercero = tercero;
    ticket.fechaCreacion = new Date();
    ticket.fechaVigencia = new Date();
    ticket.qr = '7%20' + this.persona[0].identificacion;
    sede.codigo = this.formTercero.get('sede').value;
    ticket.sede = sede;
    subSede.codigo = this.formTercero.get('subsede').value;
    ticket.subSede = subSede;
    if (+this.formTercero.get('tipoUbicacion').value === 1) {
      bloque.codigo = +this.formTercero.get('bloque').value;
      oficina.codigo = null;
    } else {
      oficina.codigo = +this.formTercero.get('oficinaCodigo').value;
      bloque.codigo = null;
    }
    ticket.bloque = bloque;
    ticket.oficina = oficina;
    ticket.tipoLugar = +this.formTercero.get('tipoUbicacion').value;
    ticket.tipo = 2;
    ticket.emailGraduado = 0;
    this.resgistrarTicket(ticket);
    this.carnetNombre = this.formTercero.get('nombre').value + ' ' + this.formTercero.get('apellido').value;
    this.carnetCorreo = this.formTercero.get('email').value;
    this.carnetId = this.formTercero.get('identificacion').value;
    this.carnetInicio = '' + this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm:ss aaa');
    this.carnetVigencia = '' + this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm:ss aaa');
    this.enviarTicketEmailPersona(ticket);
  }

  resgistrarTicket(ticket: Ticket) {


  }

  enviarTicketEmailTercero(ticket: Ticket) {

  }

  enviarTicketEmailPersona(ticket: Ticket) {
    this.enviarTicketPersona = false;

  }

  //FILTRO AUTOCOMPLETAR OFICINA
  private _filter(value: String): Oficina[] {
    const filterValue = value.toLowerCase();
    return this.oficinas.filter(oficina => oficina.uaaNombre.toLowerCase().includes(filterValue));
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalTiqueteVisitante, {
      data: { ticket: element },
    });
  }


  cargarLugar(lugar: string, codigo: number, condicion: number) {
    this.carnetLugar = lugar;
    if (condicion === 1) {
      this.formTercero.get('bloque').setValue(codigo);
      this.carnetLugar = lugar;
    } else {
      this.formTercero.get('oficinaCodigo').setValue(codigo);
      this.carnetLugar = lugar;
      this.oficinaCodigo = codigo;
    }
  }

  irArriba(page: HTMLElement) {
    page.scrollIntoView();
  }

  /* generarTicket() {
    this.ticket = !this.ticket;
  } */

  mensajeAdvertencia() {
    swal.fire({
      icon: 'warning',
      title: 'Sin Resultados',
      text: 'No se encontró ninguna persona relacionada con el documento, por favor completar los campos necesarios para el registro.',
    })

  }

  mensajeError() {
    swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar el proceso.',
    })

  }

  mensajeSuccsesEmail() {
    swal.fire({
      icon: 'success', title: 'Correo enviado', text: '¡Operación exitosa!',
      toast: true,
      position: 'top-right',
      timer: 2500
    })
  }

  mensajeSuccses() {
    swal.fire({
      icon: 'success', title: 'Proceso realizado', text: '¡Operación exitosa!',
      toast: true,
      position: 'top-right',
      timer: 2500
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



//// MODAL


@Component({
  selector: 'modal-tiquete-visitante',
  templateUrl: 'modal-tiquete-visitante.html',
  styleUrls: ['./externos-visitantes.component.css'],
})
export class ModalTiqueteVisitante implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalTiqueteVisitante>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}