import { PuestoVigilancia } from './puesto-vigilancia';
import { Dia } from './dia';
export class Horario {

  codigo: number;
	puestoVigilancia: PuestoVigilancia;
	horaApertura: String;
	horaCierre: String;
	fechaCreacion: Date;
	fechaCierre: Date;
	dia: Dia;
	estado: number;

}
