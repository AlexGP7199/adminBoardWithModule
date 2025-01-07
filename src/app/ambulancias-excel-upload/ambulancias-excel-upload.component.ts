import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { AmbulanciasService } from '../new-ambulancia/services/ambulancias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ambulancias-excel-upload',
  templateUrl: './ambulancias-excel-upload.component.html',
  styleUrl: './ambulancias-excel-upload.component.css'
})
export class AmbulanciasExcelUploadComponent implements OnInit {

  data: any[] = []; // Datos leídos del Excel
  regiones: any[] = [];
  provincias: any[] = [];
  regionMap: { [key: string]: number } = {};
  provinciaMap: { [key: string]: number } = {};
  tiposAmbulancias: any[] = []; // Almacena los tipos de ambulancias obtenidos del backend
  constructor(private ambulanciaService: AmbulanciasService) {}

  ngOnInit(): void {
    this.cargarRegionesYProvincias();
    this.cargarTiposAmbulancias(); // Carga los tipos de ambulancias
  }

// Método para cargar los tipos de ambulancias
cargarTiposAmbulancias(): void {
  this.ambulanciaService.obtenerTiposAmbulancia().subscribe((tipos) => {
    ////console.log('Tipos de ambulancias cargados:', tipos);
    this.tiposAmbulancias = tipos;
  });
}

  // Cargar regiones y provincias
  cargarRegionesYProvincias(): void {
    this.ambulanciaService.obtenerRegiones().subscribe((regiones) => {
      this.regiones = regiones;
      this.regionMap = {};
      regiones.forEach((region) => {
        this.regionMap[region.nombre.toUpperCase()] = region.regionId;
      });
    });

    this.ambulanciaService.obtenerProvincias().subscribe((provincias) => {
      this.provincias = provincias;
      this.provinciaMap = {};
      provincias.forEach((provincia) => {
        this.provinciaMap[provincia.nombre.toUpperCase()] = provincia.provinciaId;
      });
    });
  }
  obtenerNombreTipo(codigo: string): string {
    if (!codigo) return 'Sin Tipo';
    const prefijo = codigo.split('-')[0]?.toUpperCase();
    const tipo = this.tiposAmbulancias.find((t) => t.nombre.toUpperCase() === prefijo);
    return tipo ? `${tipo.nombre} (${tipo.descripcion})` : 'Sin Tipo';
  }

  // Leer el archivo Excel
  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length !== 1) {
      Swal.fire('Error', 'Solo puedes subir un archivo a la vez', 'error');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(ws);
      //console.log('Datos del Excel:', this.data);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  // Procesar y enviar al backend
  procesarDatos(): void {
    if (this.data.length === 0) {
      Swal.fire('Error', 'No hay datos para procesar.', 'error');
      return;
    }

   ('Procesando datos...');
    this.ambulanciaService.obtenerTodasAmbulancias().subscribe({
      next: (ambulancias) => {
        // Mapa de códigos existentes
        const codigoMap = new Map(ambulancias.map((a: any) => [a.codigo.trim(), a.id]));

        const solicitudes = this.data.map((row: any) => {
          const codigoPreposicion = row['Codigo de la Preposición']?.toString().trim() || '';
          const prefijo = codigoPreposicion.split('-')[0]?.toUpperCase();
          const tipoId = this.obtenerTipoIdPorPrefijo(prefijo);

          const regionId = Number(row['Región']) || 0; // Leer ID de la región desde el Excel
          const provinciaId = Number(row['Provincia']) || 0; // Leer ID de la provincia desde el Excel

          // Validar si los IDs existen en los datos cargados
          const regionValida = this.regiones.some((r) => r.regionId === regionId);
          const provinciaValida = this.provincias.some((p) => p.provinciaId === provinciaId);

          if (!regionValida) {
            console.error(`Región no válida: ${regionId}`);
          }
          if (!provinciaValida) {
            console.error(`Provincia no válida: ${provinciaId}`);
          }

          return {
            codigo: codigoPreposicion,
            descripcion: row['Descripcion']?.toString().trim() || 'SIN DESCRIPCIÓN',
            tipoId: tipoId,
            regionId: regionValida ? regionId : 0, // Asigna 0 si no es válida
            provinciaId: provinciaValida ? provinciaId : 0, // Asigna 0 si no es válida
            baseOperativa: row['Base Operativa']?.toString().trim() || 'SIN BASE OPERATIVA DESCRITA',
            georeferencia: row['Georeferencia']?.toString().trim() || 'SIN GEOREFERENCIA',
          };
        });

        // Validar y enviar solicitudes
        solicitudes.forEach((solicitud) => {
          if (solicitud.regionId === 0 || solicitud.provinciaId === 0) {
            console.warn('Región o provincia inválida. No se enviará esta solicitud:', solicitud);
          } else {
            const ambulanciaId = codigoMap.get(solicitud.codigo);
            if (ambulanciaId) {
              // Editar ambulancia existente
              //console.log('Editando ambulancia existente:', solicitud.codigo);
              this.ambulanciaService.editarAmbulancia(ambulanciaId, solicitud).subscribe({
                next: () => console.log(),
                error: (err) => console.error(`Error al actualizar`, err),
              });
            } else {
              // Crear nueva ambulancia
              //console.log('Creando nueva ambulancia:', solicitud.codigo);
              this.ambulanciaService.crearAmbulancia(solicitud).subscribe({
                next: () => console.log(`Ambulancia creada`),
                error: (err) => console.error(`Error al crear`, err),
              });
            }
          }
        });

        Swal.fire('Éxito', 'Datos procesados correctamente.', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar las ambulancias existentes.', 'error');
        console.error('Error al cargar ambulancias existentes:', err);
      },
    });
  }


  // Método para obtener el tipoId dinámicamente
  private obtenerTipoIdPorPrefijo(codigoPreposicion: string): number {
    //console.log('Codigo a parsear ' + codigoPreposicion);
    if (!codigoPreposicion) return 0;

    // Extraer el prefijo antes del "-"
    const prefijo = codigoPreposicion.split('-')[0]?.toUpperCase();
    //console.log('prefijo' + codigoPreposicion);
    // Buscar en la lista de tipos cargados
    //console.log('Tiposs Ambulancias');
    //console.log(this.tiposAmbulancias);
    const tipo = this.tiposAmbulancias.find((t) => t.nombre.toUpperCase() === prefijo);

    // Retornar el ID del tipo o 0 si no se encuentra
    return tipo ? tipo.id : 0;
  }

  // Validar que el tipoId sea numérico
validarTipoId(tipoId: any): number {
  if (typeof tipoId === 'number' && tipoId > 0) {
    return tipoId;
  }
    console.warn('Tipo de ambulancia no válido:', tipoId);
    return 0; // Retorna 0 si no es válido
  }

}
