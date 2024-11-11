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
