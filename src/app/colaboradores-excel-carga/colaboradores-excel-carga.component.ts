import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuariosModuleService } from '../new-usuario/services/usuarios.service';
import { AmbulanciasService } from '../new-ambulancia/services/ambulancias.service';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar la librería uuid: npm install uuid

@Component({
  selector: 'app-colaboradores-excel-carga',
  templateUrl: './colaboradores-excel-carga.component.html',
  styleUrl: './colaboradores-excel-carga.component.css'
})
export class ColaboradoresExcelCargaComponent {
  usuarios: any[] = [];
  ambulancias: any[] = [];

  constructor(private usuarioService: UsuariosModuleService, private ambulanciasService: AmbulanciasService) {}

  ngOnInit(): void {
    this.cargarAmbulancias(); // Cargar mapeo de preposiciones (Ambulancias)
  }


  cargarAmbulancias(): void {
    this.ambulanciasService.obtenerTodasAmbulancias().subscribe((ambulancias) => {
      this.ambulancias = ambulancias;
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(sheet);

      this.procesarExcel(excelData);
    };
    reader.readAsArrayBuffer(file);
  }

  procesarExcel(excelData: any[]): void {
    const palabrasClave = [
      "DISPONIBLE",
      "RECEPCION",
      "OFICINA REGIONAL",
      "BASE OPERATIVA",
      "BASE OPERATIVO",
      "LOGISTICA",
      "OPERACIONES",
      "BACKUP",
      "HJPP",
      "CRUE" ]; // Palabras clave a verificar

    const usuariosProcesados = excelData.map((row: any) => {
      //console.log('Claves del objeto row:', Object.keys(row));

      const preposicion = row.Preposicion?.toUpperCase(); // Normaliza para evitar problemas con mayúsculas/minúsculas
      let estado = row.Estado || 'Activo';
      let ambulanciaId = null;

      // Limpia los guiones de la cédula y genera una nueva si está vacía
      const cedula = row.Cedula
        ? row.Cedula.toString().replace(/-/g, '').trim() // Elimina guiones y espacios
        : this.generarCedulaFicticia();

      // Asignar el Team por defecto si no está definido
      const teamId = row.Team ? row.Team : 5; // Valor predeterminado para Team

      // Verifica si la preposición coincide con alguna palabra clave
      if (palabrasClave.includes(preposicion)) {
        estado = preposicion; // Usa la palabra clave como estado
      } else {
        // Si no coincide, busca el ID de ambulancia correspondiente
        const ambulancia = this.ambulancias.find((a) => a.codigo === row.Preposicion);
        ambulanciaId = ambulancia ? ambulancia.id : null;
      }


      return {
        cedula: cedula, // Incluye la cédula procesada sin guiones
        nombre: row.Nombre,
        password: cedula,
        provinciaId: row.Provincia,
        teamId: teamId, // Usa el valor por defecto si no existe
        userRoleId: row.UserRole,
        ambulanciaId: ambulanciaId,
        cargoId: row.Cargo,
        estado: estado,
      };
    });

    this.usuarios = usuariosProcesados;
    //console.log('Usuarios procesados:', this.usuarios);
  }
  // Método para generar un UID único con 11 dígitos
private generarCedulaFicticia(): string {
  // Genera un número aleatorio de 9 dígitos y agrega un prefijo y sufijo para llegar a 11
  const base = Math.floor(100000000 + Math.random() * 900000000); // 9 dígitos aleatorios
  const prefix = "1"; // Prefijo fijo
  const suffix = "0"; // Sufijo fijo
  return `${prefix}${base}${suffix}`; // Resultado en formato de 11 dígitos
}

enviarUsuarios(): void {
  if (this.usuarios.length === 0) {
    Swal.fire('Error', 'No hay usuarios para enviar.', 'error');
    return;
  }

  let existentes = 0;
  let enviados = 0;
  const totalUsuarios = this.usuarios.length;
  let errores = 0;

  this.usuarios.forEach((usuario) => {
    // Llama al servicio para verificar si el usuario ya existe
    this.usuarioService.obtenerUsuarioPorCedula(usuario.cedula).subscribe({
      next: (existe: boolean) => {
        if (existe) {
          // Si el usuario ya existe, actualízalo
          this.usuarioService.actualizarUsuario(usuario.cedula, usuario).subscribe({
            next: () => {
              existentes++;
              this.verificarFinalizacion(enviados, totalUsuarios, errores,existentes);
            },
            error: () => {
              errores++;
              console.error(`Error al actualizar el usuario:`, usuario);
              Swal.fire('Error', `Error al actualizar el usuario con cédula ${usuario.cedula}.`, 'error');
              this.verificarFinalizacion(enviados, totalUsuarios, errores,existentes);
            },
          });
        } else {
          // Si no existe, crea el usuario
          this.usuarioService.crearUsuario(usuario).subscribe({
            next: () => {
              enviados++;
              this.verificarFinalizacion(enviados, totalUsuarios, errores,existentes);
            },
            error: () => {
              errores++;
              console.error(`Error al enviar el usuario:`, usuario);
              Swal.fire('Error', `Error al crear el usuario con cédula ${usuario.cedula}.`, 'error');
              this.verificarFinalizacion(enviados, totalUsuarios, errores,existentes);
            },
          });
        }
      },
      error: () => {
        errores++;
        console.error(`Error al verificar la cédula ${usuario.cedula}. Usuario:`, usuario);
        Swal.fire('Error', `Error al verificar la cédula ${usuario.cedula}.`, 'error');
        this.verificarFinalizacion(enviados, totalUsuarios, errores,existentes);
      },
    });
  });
}


private verificarFinalizacion(enviados: number, total: number, errores: number, existentes: number): void {
  if (enviados + errores + existentes === total) {
    if (errores > 0) {
      Swal.fire(
        'Completado con Errores',
        `${enviados} usuarios enviados con éxito. ${errores} errores. ${existentes} usuarios existentes`,
        'warning'
      );
    } else {
      Swal.fire('¡Éxito!', `${enviados} usuarios enviados con éxito. ${errores} errores. ${existentes} usuarios existentes`, 'success');
    }
    this.usuarios = [];
  }
}

}
