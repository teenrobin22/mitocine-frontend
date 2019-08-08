import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Usuario } from '../_model/usuario';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioCambio = new Subject<Usuario[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/usuarios`;
  constructor(private http: HttpClient) { }

 /* registrar(usuario: Usuario) {
    return this.http.post(this.url, usuario);
  }*/

  registrar(usuario: Usuario, file?: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const usuarioBlob = new Blob([JSON.stringify(usuario)], { type: 'application/json' });
    formdata.append('usuario', usuarioBlob);
    return this.http.post(`${this.url}`, formdata, {
      responseType: 'text'
    });
  }

  listar() {
    return this.http.get<Usuario[]>(this.url);
  }


  listarPorId(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  obtenerFoto(id: number) {
    return this.http.get(`${this.url}/obtenerFoto/${id}`, {
      responseType: 'blob'
    });
  }

  modificar(usuario: Usuario, file?: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const usuarioBlob = new Blob([JSON.stringify(usuario)], { type: 'application/json' });
    formdata.append('usuario', usuarioBlob);
    return this.http.put(`${this.url}`, formdata, {
      responseType: 'text'
    });
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }


  listarFotoPorUser(user: string) {
    return this.http.get(`${this.url}/listarPorUser/${user}`, {
      responseType: 'blob'
    });
  }


}
