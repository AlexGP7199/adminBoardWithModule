export interface LoginResponse {
  usuarioId : number;
  token: string;
  nombre: string;
  cedula: string;
  role: string;
  nivel: string;
  provincia: string;
  provinciaId : number;
  region: string;
  regionId : number;
  teamId: number;
  teamName:string;
}
