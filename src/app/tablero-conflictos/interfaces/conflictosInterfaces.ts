export interface Conflicto {
  id: number;  // Agregar esta línea para incluir el campo 'id'
  usuarioId: number;
  usuarioNombre: string;
  fechaGeneracion: string;
  estatus: string;
}

export interface ConflictoResponse {
  Message?: string;
  conflictos?: Conflicto[];
}

// respuesta 2
export interface ConflictoDetalle {
  fechaConflicto: string;
  motivo: string;
  detallesAdicionales: string;
}

export interface ConflictoAg {
  usuarioId: number;
  usuarioNombre: string;
  cedula: string;
  cargo: string;
  provincia: string;
  region: string;
  conflictoId: number;
  fechaGeneracion: string;
  estatus: string;
  detalles: ConflictoDetalle[];
}

export interface Team {
  teamId: number;
  teamNombre: string;
  conflictos: ConflictoAg[];
  expanded?: boolean; // Propiedad opcional
}


export interface TipoAmbulancia {
  tipoAmbulanciaId: number;
  tipoAmbulanciaNombre: string;
  teams: Team[];
  expanded?: boolean;
}

export interface ConflictosAgrupadosResponse {
  Message?: string; // Para el caso en que no haya resultados
  agrupados?: TipoAmbulancia[]; // Para los datos agrupados
}

export interface Provincia {
  provinciaNombre: string;
  tiposAmbulancia: TipoAmbulancia[];
  expanded?: boolean;
}

