    import { Component } from '@angular/core';
    import Swal from 'sweetalert2';
    import * as XLSX from 'xlsx';
    import { ConflictoService } from '../tablero-conflictos/services/conflicto.service';
    import { AuthService } from '../services/auth.service';
    import { initFlowbite } from 'flowbite';

    @Component({
      selector: 'app-horarios',
      templateUrl: './horarios.component.html',
      styleUrl: './horarios.component.css'
    })
    export class HorariosComponent {
      conflictosPendientes: any[] = [];
      conflictosEnProceso: any[] = [];
      conflictosAprobados: any[] = [];
      conflictosRechazados: any[] = [];
      conflictosFinalizados: any[] = []; // NUEVO ESTADO

      // Variables para información del usuario
      cedula: string = '';
      usuarioNombre: string = '';
      usuarioProvincia: string = '';
      usuarioRegion: string = '';
      usuarioRol: string = '';
      usuarioTeam: string = '';
      usuarioId: number = 0;

      estadosExpandibles: { [key in 'pendientes' | 'enProceso' | 'aprobados' | 'rechazados' | 'finalizados']: boolean } = {
        pendientes: false,
        enProceso: false,
        aprobados: false,
        rechazados: false,
        finalizados: false // NUEVO ESTADO
      };

      // Estado expandible por conflicto
      detallesExpandibles: { [key: string]: boolean } = {};


      constructor(private conflictoService: ConflictoService, private authService: AuthService ) {}

      ngOnInit(): void {
        initFlowbite();
        this.obtenerInformacionUsuario();
        this.cargarConflictos();
      }

    // Manejar la expansión de los estados
    toggleEstado(estado: 'pendientes' | 'enProceso' | 'aprobados' | 'rechazados' | 'finalizados'): void {
      this.estadosExpandibles[estado] = !this.estadosExpandibles[estado];
    }

    toggleDetalles(conflictoId: string): void {
      this.detallesExpandibles[conflictoId] = !this.detallesExpandibles[conflictoId];
    }

      obtenerInformacionUsuario(): void {
        const decodedToken = this.authService.getDecodedToken();
        if (decodedToken) {
          this.cedula = decodedToken.cedula || '';
          this.usuarioNombre = decodedToken.nombre || '';
          this.usuarioProvincia = decodedToken.provincia || '';
          this.usuarioRegion = decodedToken.region || '';
          this.usuarioRol = decodedToken.cargo || '';
          this.usuarioTeam = decodedToken.teamName || '';
          this.usuarioId = parseInt(decodedToken.usuarioId || '0', 10); // Convertir a número si es necesario
        } else {
          console.error('El token no se pudo decodificar o no existe.');
          this.authService.logout(); // Opcional: Forzar el logout si no hay token válido
        }
      }

      cargarConflictos(): void {
        if (this.usuarioId === 0) {
          Swal.fire('Error', 'Usuario no encontrado en el sistema.', 'error');
          return;
        }

        this.conflictoService.obtenerConflictosUsuario(this.usuarioId).subscribe(
          (data) => {
            //console.log(data);
            if (data && typeof data === 'object' && 'Message' in data) {
              Swal.fire('Información', data.Message, 'info');
            } else if (Array.isArray(data)) {
              //console.log(data);
              // Procesar cada conflicto y agrupar según el estatus
              this.conflictosPendientes = data.filter((c: any) => c.estatus === 'Pendiente');
              this.conflictosEnProceso = data.filter((c: any) => c.estatus === 'En Proceso');
              this.conflictosAprobados = data.filter((c: any) => c.estatus === 'Aprobado');
              this.conflictosRechazados = data.filter((c: any) => c.estatus === 'Rechazado');
              this.conflictosFinalizados = data.filter((c: any) => c.estatus === 'Finalizado'); // NUEVO FILTRO
            } else {
              //Swal.fire('Advertencia', 'La respuesta del servidor no tiene el formato esperado.', 'warning');
            }
          },
          (error) => {
            //console.error('Error al cargar conflictos:', error);
            Swal.fire('Error', 'Ocurrió un error al cargar los conflictos.', 'error');
          }
        );
      }


    }
