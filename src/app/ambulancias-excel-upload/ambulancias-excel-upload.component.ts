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

  constructor(private ambulanciaService: AmbulanciasService) {}

  ngOnInit(): void {
    this.cargarRegionesYProvincias();
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
      console.log('Datos del Excel:', this.data);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  // Procesar y enviar al backend
  procesarDatos(): void {
    if (this.data.length === 0) {
      Swal.fire('Error', 'No hay datos para procesar.', 'error');
      return;
    }

    const solicitudes = this.data.map((row: any) => {
      const tipoId = row['Tipo']; // Leer directamente la columna "Tipo"
      return {
        codigo: row['Codigo de la Preposición'],
        descripcion: row['Descripcion'] || 'Sin descripción',
        tipoId: this.validarTipoId(tipoId), // Validar si el tipoId es numérico
        regionId: this.regionMap[row['Región']?.toUpperCase()] || 0,
        provinciaId: this.provinciaMap[row['Provincia']?.toUpperCase()] || 0,
        baseOperativa: row['Base Operativa'],
        georeferencia: row['Georeferencia'],
      };
    });

    // Validar y enviar solicitudes
    solicitudes.forEach((solicitud) => {
      if (solicitud.regionId === 0 || solicitud.provinciaId === 0) {
        console.error('Región o provincia no encontrada:', solicitud);
      } else {
        console.log(solicitud);
        /*
        this.ambulanciaService.crearAmbulancia(solicitud).subscribe({
          next: () => console.log(`Ambulancia creada: ${solicitud.codigo}`),
          error: (err) => console.error(`Error al crear ${solicitud.codigo}:`, err),
        }); */
      }
    });

    Swal.fire('Éxito', 'Datos procesados correctamente.', 'success');
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
