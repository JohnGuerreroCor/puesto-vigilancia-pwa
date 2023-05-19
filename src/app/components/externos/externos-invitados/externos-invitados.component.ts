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
import { fromEvent, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Ticket } from '../../../models/ticket';
import { DatePipe } from '@angular/common';
import { FotoAntigua } from 'src/app/models/foto-antigua';
import { Persona } from '../../../models/persona';
import swal from 'sweetalert2';


@Component({
  selector: 'app-externos-invitados',
  templateUrl: './externos-invitados.component.html',
  styleUrls: ['./externos-invitados.component.css'],
  providers: [DatePipe],
})
export class ExternosInvitadosComponent implements OnInit {

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
  displayedColumns: string[] = ['index', 'nombre', 'lugar', 'inicio', 'fin', 'opciones'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  qrCodeTwo: String = null;
  formTercero: FormGroup;
  selectDateInicio: Date | null;
  selectDateVigencia: Date | null;
  dateInicio = new FormControl(new Date());
  dateVigencia = new FormControl(new Date());
  filteredOptions: Observable<Oficina[]>;
  myControl = new FormControl();
  oficinaCodigo: number;
  carnetLugar: String = 'Lugar';
  carnetNombre: String = 'Nombre';
  carnetId: String = '********';
  carnetCorreo: String = '@email.com'
  carnetInicio: String = '';
  carnetVigencia: String = '';
  fotoCarnet: FotoAntigua = {
    url: "",
  };
  fechaLimiteMinima: String;
  fechaLimiteMinimaVigencia: String;
  nameFile = "Seleccione la foto";
  codigoTercero: number;
  file: FileList;
  foto: FotoAntigua = {
    url: "",
  };
  mobile: boolean = false;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  //FILE FIREBASE
  // CARGA DE ARCHIVOS A FIRESTORE
  public mensajeArchivo = "No hay un archivo";
  public datosFormulario = new FormData();
  public nombreArchivo = "";
  public URLPublica = "";
  public finalizado = false;
  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });

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
    this.fechaLimiteMinima = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + 'T00:00';
    this.fechaLimiteMinimaVigencia = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + 'T00:00';
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
      fechaInicio: new FormControl('', Validators.required),
      fechaVigencia: new FormControl('', Validators.required),
    });
  }

  limiteVigencia() {
    this.fechaLimiteMinimaVigencia = this.datePipe.transform(this.formTercero.get('fechaInicio').value, 'yyyy-MM-dd') + 'T00:00';
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
    ticket.fechaCreacion = new Date(this.formTercero.get('fechaInicio').value);
    ticket.fechaVigencia = new Date(this.formTercero.get('fechaVigencia').value);
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
    ticket.tipo = 1;
    ticket.emailGraduado = 0;
    this.resgistrarTicket(ticket);
    this.carnetNombre = this.formTercero.get('nombre').value + ' ' + this.formTercero.get('apellido').value;
    this.carnetCorreo = this.formTercero.get('email').value;
    this.carnetId = this.formTercero.get('identificacion').value;
    this.carnetInicio = '' + this.datePipe.transform(this.formTercero.get('fechaInicio').value, 'dd-MM-yyyy h:mm:ss aaa');
    this.carnetVigencia = '' + this.datePipe.transform(this.formTercero.get('fechaVigencia').value, 'dd-MM-yyyy h:mm:ss aaa');
    this.enviarTicketEmailPersona(ticket);
  }


  resgistrarTicket(ticket: Ticket) {
    

  }

  enviarTicketEmailTercero(ticket: Ticket) {
    
  }

  enviarTicketEmailPersona(ticket: Ticket) {
    
  }

  //FILTRO AUTOCOMPLETAR OFICINA
  private _filter(value: String): Oficina[] {
    const filterValue = value.toLowerCase();
    return this.oficinas.filter(oficina => oficina.uaaNombre.toLowerCase().includes(filterValue));
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalTiqueteInvitado, {
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

  change(file: FileList): void {
    //this.getBase64(file);
    this.nameFile = file[0].name.replace(/\s/g, "");
    const foto = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.fotoCarnet.url = reader.result as string;
    }
    reader.readAsDataURL(foto)
    if (file[0].size > 8100000) {
      swal.fire({
        title: 'El archivo supera el limite de tamaño que es de 8mb',
        confirmButtonText: 'Entiendo',
        confirmButtonColor: '#8f141b',

      })

    } else {
      this.file = file;
      swal.fire({
        icon: 'success',
        title: 'Foto cargada, recuerde guardar los cambios realizados.',
        showConfirmButton: true,
        confirmButtonColor: '#8f141b',
      })
    }
  }

  base64(event) {
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.foto.url = '' + reader.result;
      this.foto.url = this.foto.url.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '').replace(';', 'foto');
    };
    reader.readAsDataURL(file);
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


  // Función para subir el archivo a Cloud Storage referenciado con la ruta de acceso
  subirArchivo() {
    this.nombreArchivo = "CARNETIZACION/FOTOS/" + this.nombreArchivo;
    const archivo = this.datosFormulario.get("archivo");
  
   
    // Cambia el porcentaje
    
  }
  // Evento que gatilla cuando el input de tipo archivo cambia
  //https://firebasestorage.googleapis.com/v0/b/doctoradocienciasdelasaludusco.appspot.com/o/CARNETIZACION%2FFIRMADIGITALunnamed.png?alt=media&token=2837ef64-53be-43ee-9486-98dfe1527776
  public cambioArchivo(event) {
    if (event.target.files.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < event.target.files.length; i++) {
        this.mensajeArchivo = `Archivo: ${event.target.files[i].name}`;
        this.nombreArchivo = event.target.files[i].name;
        this.datosFormulario.delete("archivo");
        this.datosFormulario.append(
          "archivo",
          event.target.files[i],
          event.target.files[i].name
        );
      }
      this.subirArchivo();
    } else {
      this.mensajeArchivo = "No hay un archivo seleccionado";
    }
  }

}


//// MODAL


@Component({
  selector: 'modal-tiquete-invitado',
  templateUrl: 'modal-tiquete-invitado.html',
  styleUrls: ['./externos-invitados.component.css'],
})
export class ModalTiqueteInvitado implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalTiqueteInvitado>,
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