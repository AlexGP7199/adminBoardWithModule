import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../spinner.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinnerService.show(); // Muestra el spinner antes de realizar la solicitud
    return next.handle(request).pipe(
      finalize(() => this.spinnerService.hide()) // Oculta el spinner al finalizar la solicitud
    );
  }
}
