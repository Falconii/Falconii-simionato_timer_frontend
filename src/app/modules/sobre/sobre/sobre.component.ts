import { EmailServiceService } from './../../../services/email-service.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametroEmailOla } from 'src/app/parametros/parametro-email-ola';
import { UserEmail } from 'src/app/shared/classes/User-Email';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css'],
})
export class SobreComponent implements OnInit {
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private emailServiceService: EmailServiceService,
    private appSnackBar: AppSnackbar
  ) {}

  versao: string = '';
  data: string = '';
  ambiente: string = '';
  apiURL: string = '';
  usuarios: UsuarioQuery01Model[] = [];

  incricaoGetUsuario!: Subscription;
  incricaoSendEmail!: Subscription;

  ngOnInit(): void {
    this.versao = environment.versao;
    this.data = environment.data;
    this.ambiente = environment.ambiente;
    this.apiURL = environment.apiURL;
    this.getUsuarios();
  }

  ngOnDestroy(): void {
    this.incricaoGetUsuario?.unsubscribe();
    this.incricaoSendEmail?.unsubscribe();
  }

  onRetorno() {
    this.router.navigate(['/']);
  }

  getUsuarios() {
    let par = new ParametroUsuario01();

    par.id_empresa = 1;
    par.id = 17;
    par.orderby = 'Codigo';

    this.incricaoGetUsuario = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
          this.usuarios = data;
          console.log(data);
        },
        (error: any) => {
          this.usuarios = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Usuários ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  onSendOla() {
    let par = new ParametroEmailOla();

    let users: UserEmail[] = [];

    par.id_empresa = 1;

    par.mensagem = 'Ola';

    this.usuarios.forEach((usuario) => {
      let user: UserEmail = new UserEmail();
      user.id_empresa = usuario.id_empresa;
      user.id = usuario.id;
      user.nome = usuario.razao;
      user.email = usuario.email;
      par.users.push(user);
    });

    this.incricaoSendEmail = this.emailServiceService.emailOla(par).subscribe(
      (data: any) => {
        console.log('Retorno dos email:', data);
      },
      (error: any) => {
        this.usuarios = [];
        this.appSnackBar.openFailureSnackBar(
          `Pesquisa Nos Usuários ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
      }
    );
  }
}
