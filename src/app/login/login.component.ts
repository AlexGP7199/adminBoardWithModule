import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
            confirmButtonText: 'Aceptar'
          });

          this.router.navigate(['/dashboard']); // Redirige al dashboard
        },
        error: (error) => {
          Swal.fire({
            title: 'Error de inicio de sesión',
            text: 'Credenciales inválidas, por favor verifica tus datos.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
}
