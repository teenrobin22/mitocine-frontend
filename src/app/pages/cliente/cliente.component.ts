import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from '../../_service/cliente.service';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Cliente } from 'src/app/_model/cliente';
import { ClienteDialogoComponent } from './cliente-dialogo/cliente-dialogo.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UsuarioService } from '../../_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})

export class ClienteComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<Usuario>;
  displayedColumns = ['idCliente', 'nombres', 'apellidos', 'fechaNac', 'dni', 'usuario', 'acciones' ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private usuarioService: UsuarioService, private clienteService: ClienteService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {

    this.usuarioService.usuarioCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.usuarioService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.usuarioService.listar().subscribe(data => {
  this.dataSource = new MatTableDataSource(data);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
});
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(idUsuario: number) {
    this.usuarioService.eliminar(idUsuario).subscribe(() => {
      this.usuarioService.listar().subscribe(data => {
        this.usuarioService.usuarioCambio.next(data);
        this.usuarioService.mensajeCambio.next('Se eliminó');
      });
    });
  }

  openDialog(usuario?: Usuario) {
    let usu = usuario != null ? usuario : new Usuario() ;

    this.dialog.open(ClienteDialogoComponent, {
      width: '250px',
      data: usu
    });
  }

}
