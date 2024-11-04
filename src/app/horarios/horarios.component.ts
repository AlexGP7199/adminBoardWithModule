import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent {
  selectedFile: File | null = null;
  fileName: string = '';
  tableData: any[][] = [];
  fileLoaded: boolean = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
      this.tableData = [];
      this.fileLoaded = false;
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        try {
          const data = new Uint8Array(fileReader.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          this.validateExcelFormat(jsonData);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error al leer el archivo',
            text: 'Hubo un problema al leer el archivo. Asegúrese de que el archivo esté en formato Excel válido.'
          });
          this.fileLoaded = false;
        }
      };
      fileReader.readAsArrayBuffer(this.selectedFile);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Archivo no seleccionado',
        text: 'Por favor, seleccione un archivo antes de continuar.'
      });
    }
  }

  validateExcelFormat(data: any[][]): void {
    if (data.length < 2 || data[0][0]?.toLowerCase() !== 'fecha' || data[0][1]?.toLowerCase() !== 'descripcion') {
      Swal.fire({
        icon: 'error',
        title: 'Formato de archivo no válido',
        text: 'El formato del archivo de Excel no es válido. Asegúrese de que las columnas sean "fecha" y "descripcion".'
      });
      this.fileLoaded = false;
      this.tableData = [];
    } else {
      this.fileLoaded = true;
      this.tableData = data;

    }
  }

  confirmData(): void {
    if (!this.tableData || this.tableData.length < 2) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay datos para enviar',
        text: 'Por favor, carga un archivo válido antes de confirmar.'
      });
      return;
    }

    // Itera sobre cada fila, excluyendo el encabezado, y muestra los datos en la consola
    const dataToLog = this.tableData.slice(1).map(row => ({
      fecha: row[0],
      descripcion: row[1]
    }));

    console.log("Datos que se enviarían:", dataToLog);

    Swal.fire({
      icon: 'success',
      title: 'Datos listos para enviar',
      text: `Se han preparado ${dataToLog.length} registros para enviarlos. Revisa la consola para ver el detalle.`
    });

    this.resetData();
  }

  resetData(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.tableData = [];
    this.fileLoaded = false;
  }
}
