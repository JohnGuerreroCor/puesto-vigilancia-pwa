import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoDocumento } from '../../../models/tipo-documento';
import { TerceroService } from '../../../services/tercero.service';
import { Tercero } from '../../../models/tercero';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Sede } from '../../../models/sede';
import { SubSede } from '../../../models/sub-sede';
import { Bloque } from '../../../models/bloque';
import { UbicacionService } from '../../../services/ubicacion.service';
import { Oficina } from '../../../models/oficina';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Ticket } from '../../../models/ticket';
import { TicketService } from '../../../services/ticket.service';
import { DatePipe } from '@angular/common';
import { FotoAntigua } from 'src/app/models/foto-antigua';
import { Persona } from '../../../models/persona';
import { PersonaService } from '../../../services/persona.service';
import { GraduadoService } from '../../../services/graduado.service';
import { FirebaseFileService } from '../../../services/firebase-file.service';
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
    public tipoDocumentoService: TipoDocumentoService,
    public terceroService: TerceroService,
    public ticketService: TicketService,
    public ubicacionService: UbicacionService,
    public personaService: PersonaService,
    public graduadoService: GraduadoService,
    public dialog: MatDialog,
    public firebaseFileServie: FirebaseFileService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
  ) {

    if (this.authService.validacionToken()) {
      this.obtenerSede();
      this.obtenerTipoDocumento();
    }
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
    this.ticketService.obtenerTickets(1).subscribe(data => {
      this.dataSource = new MatTableDataSource<Ticket>(data);
      this.listaTickets = data;
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  tipoRegistro() {
    this.correoGraduado = !this.correoGraduado;
    this.ipuntEmailPersona = !this.ipuntEmailPersona;
  }

  obtenerSede() {
    this.ubicacionService.obtenerSedes().subscribe(data => {
      this.sedes = data;
    });

  }

  obtenerTipoDocumento() {
    this.tipoDocumentoService.getTiposDocumentos().subscribe(data => {
      this.tipoDocumentos = data;
    });
  }

  buscarPersona() {
    this.enviarTicketPersona = true;
    this.ipuntEmailPersona = false;
    this.emails = [];
    this.personaService.obtenerPersonaPorIdentificacion(this.formTercero.get('identificacion').value).subscribe(data => {
      if (JSON.stringify(data) !== '[]') {
        this.personaExiste = true;
        this.graduadoService.obtenerGraduado(data[0].identificacion).subscribe(data => {
          if (JSON.stringify(data) !== '[]') {
            this.graduadoExiste = true;
            swal.fire({
              icon: 'warning',
              title: 'El invitado es un Graduado',
              text: 'Si el graduado no posee un correo electrónico vigente, por favor active el botón de la esquina superior derecha de este formulario, el sistema notificará a la Oficina de Graduados para su respectiva actualización, gracias.',
            });
          } else {
            this.graduadoExiste = false;
          }
        });
        this.persona = data;
        this.personaExiste = true;//Cambia input email por un select email
        this.emails.push(this.persona[0].emailPersonal, this.persona[0].emailInterno);
        this.terceroExiste = true;
        this.formTercero.controls['email'].enable();
        this.formTercero.controls['sede'].enable();
        this.formTercero.controls['subsede'].enable();
        this.obtenerSede();
        this.obtenerTipoDocumento();
        this.formTercero.get('codigo').setValue(this.persona[0].codigo);
        this.formTercero.get('tipoDocumento').setValue(this.persona[0].tipoDocumento);
        this.formTercero.get('nombre').setValue(this.persona[0].nombre);
        this.formTercero.get('apellido').setValue(this.persona[0].apellido);
        this.formTercero.get('email').setValue(this.persona[0].emailInterno);
      } else {
        this.buscarTercero();
      }
    });
  }

  buscarTercero() {
    this.graduadoExiste = false;
    this.terceroService.getTerceroId(this.formTercero.get('identificacion').value).subscribe(data => {
      if (JSON.stringify(data) !== '[]') {
        this.terceroExiste = true;
        this.ipuntEmailPersona = true;
        this.formTercero.controls['email'].enable();
        this.formTercero.controls['sede'].enable();
        this.formTercero.controls['subsede'].enable();
        this.obtenerSede();
        this.obtenerTipoDocumento();
        this.formTercero.get('codigo').setValue(data[0].codigo);
        this.formTercero.get('terceroCodigo').setValue(data[0].codigo);
        this.formTercero.get('tipoDocumento').setValue(data[0].tipoDocumento);
        this.formTercero.get('nombreCompleto').setValue(data[0].nombre1 + ' ' + data[0].nombre2 + ' ' + data[0].apellido1 + ' ' + data[0].apellido2);
        this.formTercero.get('nombre').setValue(data[0].nombre1 + ' ' + data[0].nombre2);
        this.formTercero.get('nombre1').setValue(data[0].nombre1);
        this.formTercero.get('nombre2').setValue(data[0].nombre1);
        this.formTercero.get('apellido').setValue(data[0].apellido1 + ' ' + data[0].apellido2);
        this.formTercero.get('apellido1').setValue(data[0].apellido1);
        this.formTercero.get('apellido2').setValue(data[0].apellido2);
        this.formTercero.get('email').setValue(data[0].email);
        this.tercero = data;
      } else {
        this.terceroExiste = false;
        this.graduadoExiste = false;
        this.ipuntEmailPersona = true;
        this.personaExiste = false;
        let id = this.formTercero.get('identificacion').value;
        this.formTercero.controls['tipoDocumento'].enable();
        this.formTercero.controls['nombre'].enable();
        this.formTercero.controls['apellido'].enable();
        this.formTercero.controls['email'].enable();
        this.formTercero.controls['sede'].enable();
        this.formTercero.controls['subsede'].enable();
        this.mensajeAdvertencia();
        this.formTercero.reset();
        this.formTercero.get('identificacion').setValue(id);
        this.obtenerTipoDocumento();
      }
    });
  }

  buscarSubsede(codigo: number) {
    this.formTercero.get('subsede').reset;
    this.ubicacionService.buscarSubSedes(codigo).subscribe(data => {
      this.subsedes = data;
    });
    this.formTercero.get('oficina').reset;
    this.ubicacionService.buscarOficinas(codigo).subscribe(data => {
      this.oficinas = data;
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  buscarOficina(codigo: number) {
    this.formTercero.get('oficina').reset;
    this.ubicacionService.buscarOficinas(codigo).subscribe(data => {
      this.oficinas = data;
    });
  }

  buscarBloque(codigo: number) {
    this.formTercero.get('bloque').reset;
    this.ubicacionService.buscarBloques(codigo).subscribe(data => {
      this.bloques = data;
    });
  }

  generarTercero(): void {
    this.terceroService.getTerceroId(this.formTercero.get('identificacion').value).subscribe(data => {
      if (JSON.stringify(data) !== '[]') {
        this.terceroExiste = true;
        let tercero: Tercero = new Tercero();
        let nombres = this.formTercero.get('nombre').value.split(" ", 2)
        let apellidos = this.formTercero.get('apellido').value.split(" ", 2)
        tercero.codigo = data[0].codigo;
        tercero.tipoDocumento = this.formTercero.get('tipoDocumento').value;
        tercero.identificacion = this.formTercero.get('identificacion').value;
        tercero.nombreCompleto = '';
        for (let index = 0; index < nombres.length; index++) {
          tercero.nombreCompleto = tercero.nombreCompleto + nombres[index].toUpperCase() + ' ';
          if (index == 0) {
            tercero.nombre1 = '' + nombres[index].toUpperCase();
          }
          if (index == 1) {
            tercero.nombre2 = '' + nombres[index].toUpperCase();
          }
        }
        for (let index = 0; index < apellidos.length; index++) {
          tercero.nombreCompleto = tercero.nombreCompleto + apellidos[index].toUpperCase() + ' ';
          if (index == 0) {
            tercero.apellido1 = '' + apellidos[index].toUpperCase();
          }
          if (index == 1) {
            tercero.apellido2 = '' + apellidos[index].toUpperCase();
          }
        }
        tercero.email = this.formTercero.get('email').value;
        tercero.estado = '0';
        tercero.fechaRegistro = new Date();
        this.tercero[0] = tercero;
        this.carnetNombre = nombres[0].toUpperCase() + ' ' + nombres[1].toUpperCase() + ' ' + apellidos[0].toUpperCase() + ' ' + apellidos[1].toUpperCase();
        this.carnetCorreo = this.formTercero.get('email').value;
        this.carnetId = this.formTercero.get('identificacion').value;
        this.carnetInicio = this.datePipe.transform(this.formTercero.get('fechaInicio').value, 'dd-MM-yyyy');
        this.carnetVigencia = this.datePipe.transform(this.formTercero.get('fechaVigencia').value, 'dd-MM-yyyy');
        if (this.terceroExiste) {
          this.actualizarTercero(tercero);
        } else {
          this.resgistrarTercero(tercero);
        }
      } else {
        this.terceroExiste = false;
        let tercero: Tercero = new Tercero();
        let nombres = this.formTercero.get('nombre').value.split(" ", 2)
        let apellidos = this.formTercero.get('apellido').value.split(" ", 2)
        tercero.codigo = this.formTercero.get('codigo').value;
        tercero.tipoDocumento = this.formTercero.get('tipoDocumento').value;
        tercero.identificacion = this.formTercero.get('identificacion').value;
        tercero.nombreCompleto = '';
        for (let index = 0; index < nombres.length; index++) {
          tercero.nombreCompleto = tercero.nombreCompleto + nombres[index].toUpperCase() + ' ';
          if (index == 0) {
            tercero.nombre1 = '' + nombres[index].toUpperCase();
          }
          if (index == 1) {
            tercero.nombre2 = '' + nombres[index].toUpperCase();
          }
        }
        for (let index = 0; index < apellidos.length; index++) {
          tercero.nombreCompleto = tercero.nombreCompleto + apellidos[index].toUpperCase() + ' ';
          if (index == 0) {
            tercero.apellido1 = '' + apellidos[index].toUpperCase();
          }
          if (index == 1) {
            tercero.apellido2 = '' + apellidos[index].toUpperCase();
          }
        }
        tercero.email = this.formTercero.get('email').value;
        tercero.estado = '0';
        tercero.fechaRegistro = new Date();
        this.tercero[0] = tercero;
        this.carnetNombre = nombres[0].toUpperCase() + ' ' + nombres[1].toUpperCase() + ' ' + apellidos[0].toUpperCase() + ' ' + apellidos[1].toUpperCase();
        this.carnetCorreo = this.formTercero.get('email').value;
        this.carnetId = this.formTercero.get('identificacion').value;
        this.carnetInicio = this.datePipe.transform(this.formTercero.get('fechaInicio').value, 'dd-MM-yyyy h:mm:ss aaa');
        this.carnetVigencia = this.datePipe.transform(this.formTercero.get('fechaVigencia').value, 'dd-MM-yyyy h:mm:ss aaa');
        if (this.terceroExiste) {
          this.actualizarTercero(tercero);
        } else {
          this.resgistrarTercero(tercero);
        }
      }
    });
  }

  resgistrarTercero(tercero: Tercero) {
    this.terceroService.registrarTercero(tercero).subscribe(data => {
      if (data > 0) {
        swal.fire({
          icon: 'success', title: 'Registrado', text: '¡Operación exitosa!',
          toast: true,
          position: 'top-right',
          timer: 2500
        });
        this.ticket = !this.ticket;
        //this.generarTicket();
      } else {
        this.mensajeError();
      }
    }, err => this.fError(err))

  }

  actualizarTercero(tercero: Tercero) {
    this.terceroService.actualizarEmailTercero(tercero).subscribe(data => {
      if (data > 0) {
        swal.fire({
          icon: 'success', title: 'Actualizado', text: '¡Operación exitosa!',
          toast: true,
          position: 'top-right',
          timer: 2500
        });
        this.ticket = !this.ticket;
        //this.generarTicket();
      } else {
        this.mensajeError();
      }

    }, err => this.fError(err))
  }

  generarTicketTercero(): void {
    this.terceroService.getTerceroId(this.formTercero.get('identificacion').value).subscribe(data => {
      this.codigoTercero = data[0].codigo;
      let ticket: Ticket = new Ticket();
      let sede: Sede = new Sede();
      let subSede: SubSede = new SubSede();
      let bloque: Bloque = new Bloque();
      let oficina: Oficina = new Oficina();
      let tercero: Tercero = new Tercero();
      let persona: Persona = new Persona();
      tercero.codigo = this.codigoTercero;
      ticket.tercero = tercero;
      persona.codigo = null;
      ticket.persona = persona;
      ticket.fechaCreacion = new Date(this.formTercero.get('fechaInicio').value);
      ticket.fechaVigencia = new Date(this.formTercero.get('fechaVigencia').value);
      ticket.qr = '7%20' + data[0].identificacion;
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
      if (this.correoGraduado === true) {
        ticket.emailGraduado = 1;
      } else {
        ticket.emailGraduado = 0;
      }
      this.resgistrarTicket(ticket);
      this.enviarTicketEmailTercero(ticket);
    });
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
    this.ticketService.registrarTicket(ticket).subscribe(data => {
      if (data > 0) {
        this.mensajeSuccses();
        this.obtenerTickets();
        //this.generarTicket();
      } else {
        this.mensajeError();
      }
    }, err => this.fError(err))

  }

  enviarTicketEmailTercero(ticket: Ticket) {
    this.terceroService.getTerceroId(this.formTercero.get('identificacion').value).subscribe(data => {
      let email = this.formTercero.get('email').value;
      let nombre = data[0].nombreCompleto;
      let identificacion = data[0].identificacion;
      this.ticketService.obtenerTicketTerCodigo(data[0].codigo, 2).subscribe(data => {
        let fechaInicioEmail: String = this.datePipe.transform(ticket.fechaCreacion, 'dd-MM-yyyy  h:mm:ss aaa');
        let fechaVigenciaEmail: String = this.datePipe.transform(ticket.fechaVigencia, 'dd-MM-yyyy  h:mm:ss aaa');
        let qr: String = 'size=150x150&data=' + '7%20' + identificacion;
        this.qrCodeTwo = '7%20' + identificacion;
        this.ticketService.enviarTicketInvitadoEmail(email, this.foto.url, '' + data[0].codigo, nombre, identificacion, this.carnetLugar, fechaInicioEmail, fechaVigenciaEmail, qr).subscribe(data => {
          if (data.estado == true) {
            this.mensajeSuccsesEmail();
          } else {
            this.mensajeError();
          }
        }, err => this.fError(err));
      });
    });
  }

  enviarTicketEmailPersona(ticket: Ticket) {
    this.enviarTicketPersona = false;
    this.personaService.obtenerPersonaPorIdentificacion(this.formTercero.get('identificacion').value).subscribe(data => {
      let email = this.formTercero.get('email').value;
      let nombre = data[0].nombre + ' ' + data[0].apellido;
      let identificacion = data[0].identificacion;
      this.ticketService.obtenerTicketPerCodigo(data[0].codigo, 2).subscribe(data => {
        let fechaInicioEmail: String = this.datePipe.transform(ticket.fechaCreacion, 'dd-MM-yyyy  h:mm:ss aaa');
        let fechaVigenciaEmail: String = this.datePipe.transform(ticket.fechaVigencia, 'dd-MM-yyyy  h:mm:ss aaa');
        let qr: String = 'size=150x150&data=' + '7%20' + identificacion;
        this.qrCodeTwo = '7%20' + identificacion;
        this.ticketService.enviarTicketInvitadoEmail(email, this.foto.url, '' + data[0].codigo, nombre, identificacion, this.carnetLugar, fechaInicioEmail, fechaVigenciaEmail, qr).subscribe(data => {
          if (data.estado == true) {
            this.mensajeSuccsesEmail();
          } else {
            this.mensajeError();
          }
        }, err => this.fError(err));
      });
    });
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

      this.authService.logout();
      this.router.navigate(['login']);

    } else {
      this.mensajeError();
    }

  }


  // Función para subir el archivo a Cloud Storage referenciado con la ruta de acceso
  subirArchivo() {
    this.nombreArchivo = "CARNETIZACION/FOTOS/" + this.nombreArchivo;
    const archivo = this.datosFormulario.get("archivo");
    const referencia = this.firebaseFileServie.referenciaCloudStorage(
      this.nombreArchivo
    );
    const cargar = this.firebaseFileServie.cargarCloudStorage(
      this.nombreArchivo,
      archivo
    );
    // Cambia el porcentaje
    cargar.percentageChanges().subscribe((porcentaje) => {
      referencia.getDownloadURL().subscribe((URL) => {
        this.URLPublica = URL;
        this.finalizado = true;
        this.foto.url = this.URLPublica;
        this.foto.url = this.foto.url.replace('https://firebasestorage.googleapis.com/v0/b/doctoradocienciasdelasaludusco.appspot.com/o/CARNETIZACION%2FFOTOS%2F', '').replace('?alt=media&token=', 'url');
        return [this.URLPublica, this.finalizado];
      });
    });
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