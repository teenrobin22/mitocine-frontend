import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cliente } from '../../../_model/cliente';
import { ClienteService } from '../../../_service/cliente.service';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { UsuarioService } from '../../../_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';
import { LoginComponent } from '../../login/login.component';
import { Rol } from '../../../_model/rol';


@Component({
  selector: 'app-cliente-dialogo',
  templateUrl: './cliente-dialogo.component.html',
  styleUrls: ['./cliente-dialogo.component.css']
})
export class ClienteDialogoComponent implements OnInit {

  usuario: Usuario;
  imagenData: any;
  imagenEstado = false;
  selectedFiles: FileList;
  currentFileUpload: File;
  labelFile: string;


constructor(private dialogRef: MatDialogRef<Usuario>, @Inject(MAT_DIALOG_DATA) public data: Usuario, private usuarioService: UsuarioService, private sanitization: DomSanitizer) { }

  ngOnInit() {

    this.usuario = new Usuario();
    this.usuario.idUsuario = this.data.idUsuario;
    this.usuario.username = this.data.username;
    this.usuario.cliente = new Cliente();
    if (this.data.cliente != null) {
    this.usuario.cliente.idCliente = this.data.cliente.idCliente;
    this.usuario.cliente.nombres = this.data.cliente.nombres;
    this.usuario.cliente.apellidos = this.data.cliente.apellidos;
    this.usuario.cliente.fechaNac = this.data.cliente.fechaNac;
    this.usuario.cliente.dni = this.data.cliente.dni;
    this.usuario.roles = this.data.roles ;

  }

    if (this.data.idUsuario > 0) {
        this.usuarioService.obtenerFoto(this.data.idUsuario).subscribe(data => {
          console.log(data);

          if (data.size > 0) {
           this.convertir(data);
     }
    });
     }
  }
  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
    let base64 = reader.result;
    this.imagenData = base64;
    this.setear(base64);
    };
  }

   setear(base64: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(base64);
    this.imagenEstado = true;
   }

  selectFile(e: any) {
  this.labelFile = e.target.files[0].name;
  this.selectedFiles = e.target.files;
  }

  cancelar() {
    this.dialogRef.close();
  }

   operar() {

    
      if (this.selectedFiles != null) {
       this.currentFileUpload = this.selectedFiles.item(0); } else {
       this.currentFileUpload = new File([''], 'blanco');
     }

      if (this.usuario != null && this.usuario.idUsuario > 0) {
      this.usuarioService.modificar(this.usuario, this.currentFileUpload).pipe(switchMap(() => {
        return this.usuarioService.listar();
       })).subscribe(data => {
         this.usuarioService.usuarioCambio.next(data);
         this.usuarioService.mensajeCambio.next('Se modificó');
       });
     } else {
      this.usuario.password = '123';
      this.usuarioService.registrar(this.usuario, this.currentFileUpload).subscribe(data => {
      this.usuarioService.listar().subscribe(usuario => {
        this.usuarioService.usuarioCambio.next(usuario);
        this.usuarioService.mensajeCambio.next('Se registró');
      });
    });

    }
      this.dialogRef.close();
   }

}
