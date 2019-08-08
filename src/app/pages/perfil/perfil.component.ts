import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioService } from '../../_service/usuario.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

usuario: string;
roles: string[] ;
imagenData: any;
imagenEstado: boolean = false;
  constructor(private userService: UsuarioService, private sanitization: DomSanitizer) { }

  ngOnInit() {
    const helper = new JwtHelperService();
    let tk = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
    const decodedToken = helper.decodeToken(tk.access_token);
    this.usuario = decodedToken.user_name;
    this.roles = decodedToken.authorities;

    this.userService.listarFotoPorUser(this.usuario).subscribe(data => {
      if (data.size > 0) {
        this.convertir(data);
      }
    });


  }
  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let base64 = reader.result;
      this.imagenData = base64;
      this.setear(base64);
    }
  }

  setear(base64: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(base64);
    this.imagenEstado = true;
  }

}
