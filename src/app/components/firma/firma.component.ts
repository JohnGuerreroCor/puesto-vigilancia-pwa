import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { UbicacionService } from '../../services/ubicacion.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PoliticaService } from '../../services/politica.service';
import { PoliticaEstamento } from '../../models/politica-estamento';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FotoAntigua } from 'src/app/models/foto-antigua';
import { FirmaDigitalService } from '../../services/firma-digital.service';
import { FirebaseFileService } from '../../services/firebase-file.service';
import { Rector } from '../../models/rector';
import { FirmaDigital } from '../../models/firma-digital';
import { Persona } from '../../models/persona';
import { AdministrativoService } from '../../services/administrativo.service';
import swal from 'sweetalert2';
import { PersonaService } from '../../services/persona.service';
import { Administrativo } from '../../models/administrativo';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.css'],
  providers: [DatePipe],
})
export class FirmaComponent implements OnInit {
  //Arreglos
  editar: boolean = false;
  politicas: PoliticaEstamento[] = [];
  rector: Rector[] = [];
  firma: FirmaDigital[] = [];
  firmaActiva: FirmaDigital[] = [];

  //Booleanos
  firmaExiste: boolean = true;

  //Complementos
  private perCodigo = this.authService.obtenerPerCodigo();
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['index', 'nombre', 'inicio', 'fin', 'firma', 'estado', 'opciones'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  formRector: FormGroup;
  myControl = new FormControl();
  estamento: String = "Estamento";
  estamentoCodigo: number = 0;
  fechaModificacion: Date = new Date();

  qrCodeTwo: string = null;
  nameFile = "Seleccione la firma";
  file: FileList;

  fotoCarnet: FotoAntigua = {
    url: "",
  };

  foto: FotoAntigua = {
    url: "",
  };

  persona: Persona[] = [];
  admin: Administrativo[] = [];

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
  //FILW FIREBAE

  politicaEstudiante: PoliticaEstamento[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public ubicacionService: UbicacionService,
    public politicaEstamentoService: PoliticaService,
    public firmaService: FirmaDigitalService,
    public administradorServices: AdministrativoService,
    public personaService: PersonaService,
    private authService: AuthService,
    public firebaseFileServie: FirebaseFileService,
    public dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe,
  ) {

    if (this.authService.validacionToken()) { }
    this.qrCodeTwo = "https://gaitana.usco.edu.co/sgd/";

  }

  ngOnInit() {
    this.crearFormularioRector();
    this.buscarPoliticaEstamento();
    this.buscarRectorActual();
    this.buscarFirmaActiva();
    this.buscarFirmas();
    this.datosAdministrador();
  }

  datosAdministrador() {
    this.personaService.obtenerPersonaPorPerCodigo(this.perCodigo).subscribe(data => {
      this.persona = data;
      this.administradorServices.getAdministrativo(data[0].identificacion).subscribe(data => {
        this.admin = data;
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalFirma, {
      data: { ruta: this.foto.url },
    });
  }

  obtenerFirma(ruta: number) {
    this.firmaService.mirarFirma(ruta).subscribe(data => {
      var blob = new Blob([data], { type: 'image/png' });
      const foto = blob;
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoCarnet.url = reader.result as string;
      }
      reader.readAsDataURL(foto);
    });
  }

  mostrarFirma(ruta: number) {
    this.firmaService.mirarFirma(ruta).subscribe(data => {
      var blob = new Blob([data], { type: 'image/png' });
      const foto = blob;
      const reader = new FileReader();
      reader.onload = () => {
        this.foto.url = reader.result as string;
        this.openDialog();
      }
      reader.readAsDataURL(foto);
    });
  }

  buscarFirmas() {
    this.buscarRectorActual();
    this.firmaService.obtenerFirma().subscribe(data => {
      this.firma = data;
      this.dataSource = new MatTableDataSource<FirmaDigital>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  buscarFirmaActiva() {
    this.buscarRectorActual();
    this.firmaService.obtenerFirmaActiva().subscribe(data => {
      if (JSON.stringify(data) !== '[]') {
        this.firmaActiva = data;
        this.obtenerFirma(+data[0].ruta);
        this.firmaExiste = false;
      } else {
        this.firmaExiste = true;
      }
    });
  }

  buscarRectorActual() {
    this.firmaService.obtenerRectorActual().subscribe(data => {
      this.rector = data;
      this.formRector.get('nombre').setValue(data[0].persona.nombre + ' ' + data[0].persona.apellido);
      this.formRector.get('cargo').setValue(data[0].uaaCargoNombre);
      this.formRector.get('fechaInicio').setValue(data[0].fechaInicio);
      this.formRector.get('fechaFin').setValue(data[0].fechaFin);
      this.formRector.get('dependencia').setValue(data[0].uaaNombre);
    });
  }

  buscarPoliticaEstamento() {
    this.politicaEstamentoService.obtenerPoliticaEstamento().subscribe(data => {
      this.politicaEstudiante = data;
    });
  }

  private crearFormularioRector(): void {
    this.formRector = this.formBuilder.group({
      codigo: new FormControl(''),
      nombre: new FormControl({ value: '', disabled: true }),
      apellido: new FormControl(''),
      email: new FormControl(''),
      fechaInicio: new FormControl({ value: '', disabled: true }),
      fechaFin: new FormControl({ value: '', disabled: true }),
      dependencia: new FormControl({ value: '', disabled: true }),
      cargo: new FormControl({ value: '', disabled: true }),
      rutaFirma: new FormControl('', Validators.required),
    });
  }

  parametrosFirmaRegistrar(): void {
    let firma: FirmaDigital = new FirmaDigital();
    firma.codigo = this.formRector.get('codigo').value;
    firma.nombreFirma = this.rector[0].persona.nombre + ' ' + this.rector[0].persona.apellido + ' - ' + this.rector[0].uaaCargoNombre;
    let persona: Persona = new Persona();
    persona.codigo = this.rector[0].persona.codigo;
    firma.persona = persona;
    firma.uaaPersonalCodigo = this.rector[0].uaaPersonalCodigo
    firma.fechaInicio = new Date();
    firma.fechaFin = null;
    let file: File = this.file.item(0);
    this.registrar(file, firma);
    this.cancelar();
    this.buscarPoliticaEstamento();
  }

  registrar(archivo: File, firma: FirmaDigital) {
    const arch = new File([archivo], this.nameFile, { type: archivo.type });
    this.firmaService.registrarFirma(arch, firma).subscribe(data => {
      this.mensajeSuccses();
      this.enviarEmailRector();
      this.enviarEmailRectoria();
      this.buscarFirmaActiva();
      this.buscarFirmas();
    }, err => this.fError(err));
  }

  actualizar(element: FirmaDigital) {
    this.foto.url = '';
    let firma: FirmaDigital = new FirmaDigital();
    firma.codigo = element.codigo;
    firma.estado = 0;
    firma.fechaFin = new Date();
    this.firmaService.actualizarFirma(firma).subscribe(data => {
      if (data > 0) {
        this.mensajeError();
        this.buscarFirmas();
        this.buscarFirmaActiva();
      } else {
        this.mensajeExitoActualizar();
        this.buscarFirmas();
        this.buscarFirmaActiva();
      }

    }, err => this.fError(err));
  }

  enviarEmailRector() {
    let nombreFirma = this.rector[0].persona.nombre + ' ' + this.rector[0].persona.apellido + ' - ' + this.rector[0].uaaCargoNombre;
    let fecha: String = this.datePipe.transform(new Date(), 'dd-MM-yyyy  h:mm:ss aaa');
    let nombre = this.persona[0].nombre + ' ' + this.persona[0].apellido;
    this.firmaService.enviarEmailRector(this.rector[0].persona.emailInterno, this.foto.url, nombreFirma, fecha, nombre, this.persona[0].emailInterno, this.admin[0].cargoNombre).subscribe(data => {
      if (data.estado == true) {
        this.mensajeSuccsesEmail();
      } else {
        this.mensajeError();
      }
    }, err => this.fError(err));
  }

  enviarEmailRectoria() {
    let nombreFirma = this.rector[0].persona.nombre + ' ' + this.rector[0].persona.apellido + ' - ' + this.rector[0].uaaCargoNombre;
    let fecha: String = this.datePipe.transform(new Date(), 'dd-MM-yyyy  h:mm:ss aaa');
    let nombre = this.persona[0].nombre + ' ' + this.persona[0].apellido;
    this.firmaService.enviarEmailRector(this.rector[0].uaaEmail, this.foto.url, nombreFirma, fecha, nombre, this.persona[0].emailInterno, this.admin[0].cargoNombre).subscribe(data => {
      if (data.estado == true) {
        this.mensajeSuccsesEmail();
      } else {
        this.mensajeError();
      }
    }, err => this.fError(err));
  }

  cancelar() {
    this.formRector.reset();
    this.editar = false;
    this.estamento = "Estamento";
    this.estamentoCodigo = 0;
    this.fechaModificacion = new Date();
  }

  change(file: FileList): void {
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
      });
    } else {
      this.file = file;
      swal.fire({
        icon: 'success',
        title: 'Foto cargada, recuerde guardar los cambios realizados.',
        showConfirmButton: true,
        confirmButtonColor: '#8f141b',
      });
    }
  }

  // Función para subir el archivo a Cloud Storage referenciado con la ruta de acceso
  subirArchivo() {
    this.nombreArchivo = "CARNETIZACION/FIRMADIGITAL/" + this.nombreArchivo;
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
        this.foto.url = this.foto.url.replace('https://firebasestorage.googleapis.com/v0/b/doctoradocienciasdelasaludusco.appspot.com/o/CARNETIZACION%2FFIRMADIGITAL%2F', '').replace('?alt=media&token=', 'url');
        this.formRector.get('rutaFirma').setValue(this.foto.url);
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

  scroll(page: HTMLElement) {
    page.scrollIntoView();
  }

  mensajeError() {
    swal.fire({
      icon: 'error', title: 'Error', text: 'Algo salió mal',
      toast: true,
      position: 'top-right',
      timer: 2500
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
      icon: 'success', title: 'Registrado', text: '¡Operación exitosa!',
      toast: true,
      position: 'top-right',
      timer: 2500
    })
  }

  mensajeExitoActualizar() {
    swal.fire({
      icon: 'success', title: 'Actualizado', text: '¡Operación exitosa!',
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

}



//// MODAL


@Component({
  selector: 'modal-firma',
  templateUrl: 'modal-firma.html',
  styleUrls: ['./firma.component.css'],
})
export class ModalFirma implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalFirma>,
    public firmaService: FirmaDigitalService,
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