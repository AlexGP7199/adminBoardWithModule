import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ConflictoService } from '../tablero-conflictos/services/conflicto.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  //usuarioId!: number; // ID del usuario autenticado

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private conflictoService: ConflictoService
  ) {
    this.loginForm = this.fb.group({
      cedula: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.authService.logout();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { cedula, password } = this.loginForm.value;

      this.authService.login(cedula, password).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Inicio de sesión exitoso',
            text: `Bienvenido, ${response.nombre}`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });

          const usuarioId = response.usuarioId;

          // Iniciar la verificación de conflictos aprobados (no bloquea la redirección)
          //this.verificarConflictosAprobados(usuarioId);

          // Redirigir inmediatamente
          this.router.navigate(['']);
        },

        error: () => {
          Swal.fire({
            title: 'Error de inicio de sesión',
            text: 'Credenciales inválidas, por favor verifica tus datos.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  verificarConflictosAprobados(usuarioId: number): void {
    this.conflictoService.verificarConflictosAprobados(usuarioId).subscribe({
      next: (conflictoResponse) => {
        const tieneConflictoAprobado = conflictoResponse.tieneConflictoAprobado;

        // Guardar en LocalStorage
        localStorage.setItem(
          'conflictoAprobado',
          JSON.stringify({
            tieneConflictoAprobado: tieneConflictoAprobado,
            detalles: conflictoResponse.Detalles || [],
          })
        );
      },
      error: (error) => {
        console.error('Error al verificar conflictos aprobados:', error);
      },
    });
  }

}
