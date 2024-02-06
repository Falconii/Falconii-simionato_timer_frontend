import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApoExecucaoModel } from 'src/app/Models/apo-execucao-model';
import { ApoExecucaoModel01 } from 'src/app/Models/apo-execucao-model01';
import { AtividadeQuery_01Model } from 'src/app/Models/atividade-query_01-model';
import { MotivoApoModel } from 'src/app/Models/motivo-apo-model';
import { ProjetoLastModel } from 'src/app/Models/projeto-last-model';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { GlobalService } from 'src/app/services/global.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { LancaHoras } from 'src/app/shared/classes/lanca-horas';
import {
  DataYYYYMMDD,
  ddmmaaaatoaaaammdd,
  setDBtoAngularGMT,
} from 'src/app/shared/classes/util';

@Component({
  selector: 'app-crud-execucao-multi',
  templateUrl: './crud-execucao-multi.component.html',
  styleUrls: ['./crud-execucao-multi.component.css'],
})
export class CrudExecucaoMultiComponent implements OnInit {
  inscricaoCrud!: Subscription;
  inscricaoUsuario!: Subscription;
  inscricaoAtividades!: Subscription;
  inscricaoMotivos!: Subscription;
  inscricaoGetContratos!: Subscription;
  inscricaoRota!: Subscription;
  labelCadastro: string = '';
  id_empresa: number = 0;
  apontamentos: ApoExecucaoModel01[] = [];
  apontamento: ApoExecucaoModel = new ApoExecucaoModel();
  atividades: AtividadeQuery_01Model[] = [];
  atividade: AtividadeQuery_01Model = new AtividadeQuery_01Model();
  motivos: MotivoApoModel[] = [];
  usuario: UsuarioModel = new UsuarioModel();
  parametro: FormGroup;
  readOnly: boolean = true;

  contrato: ProjetoModel = new ProjetoModel();
  contratos: ProjetoModel[] = [];
  tempoContratos: ProjetoModel[] = [];
  lastContratosFiltrados: ProjetoLastModel[] = [];
  lastContratos: ProjetoLastModel[] = [];
  last: number = 0;
  grupo: AtividadeQuery_01Model = new AtividadeQuery_01Model();
  grupos: AtividadeQuery_01Model[] = [];

  estrutura: AtividadeQuery_01Model = new AtividadeQuery_01Model();
  estruturas: AtividadeQuery_01Model[] = [];

  focusEntrada: boolean = false;
  focusCancelar: boolean = false;

  gravando: boolean = false;

  totalHoras: number = 0;

  totalHorasBanco: number = 0;

  cortes: Date[] = [];

  lancaHoras: LancaHoras[] = [];

  data: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private appSnackBar: AppSnackbar
  ) {
    this.parametro = formBuilder.group({
      entrada: [{ value: '' }, [Validators.required]],
      saida: [{ value: '' }, [Validators.required]],
    });
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.data = params.data;
    });
  }

  ngOnInit(): void {}

  setValue() {
    this.parametro.setValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
      grupo: `${this.apontamento.conta_descricao}/${this.apontamento.grupo_descricao}`,
      atividade: this.apontamento.estru_descricao,
      cliente: `${this.apontamento.cli_razao}(${this.apontamento.id_projeto}) ${this.apontamento.proj_descricao} `,
      id_motivo: this.apontamento.id_motivo,
      encerra: this.apontamento.encerramento == 'S' ? true : false,
      obs: this.apontamento.obs,
    });
  }
  onRetorno() {
    this.router.navigate(['execucao/execucoesv2']);
  }

  onManha() {
    this.apontamento.inicial =
      this.apontamento.inicial.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + this.globalService.getUsuario().man_hora_entrada;
    this.apontamento.final =
      this.apontamento.final.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + this.globalService.getUsuario().man_hora_saida;
    this.parametro.patchValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
  }

  onTarde() {
    let lastTime = '';
    let hoje: Date = new Date(this.apontamento.inicial);
    if (hoje.getDay() == 5) {
      lastTime = '16:33';
    } else {
      lastTime = this.globalService.getUsuario().tard_hora_saida;
    }
    this.apontamento.inicial =
      this.apontamento.inicial.substring(
        0,
        this.apontamento.inicial.indexOf(' ') + 1
      ) + this.globalService.getUsuario().tard_hora_entrada;
    this.apontamento.final =
      this.apontamento.final.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + lastTime;
    this.parametro.patchValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
  }

  onAlmoco() {
    this.apontamento.inicial =
      this.apontamento.inicial.substring(
        0,
        this.apontamento.inicial.indexOf(' ') + 1
      ) + '12:00';
    this.apontamento.final =
      this.apontamento.final.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + '13:00';
    this.parametro.patchValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
  }

  onDiaTodo() {
    this.apontamento.inicial =
      this.apontamento.inicial.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + '06:30'; //this.globalService.getUsuario().man_hora_entrada;
    this.apontamento.final =
      this.apontamento.final.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + '21:00'; //this.globalService.getUsuario().tard_hora_saida;
    this.parametro.patchValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
    this.loadCortes();
    this.gerarHorarios();
  }

  onCalculo() {
    this.loadCortes();
    this.gerarHorarios();
  }

  gerarHorarios() {
    this.lancaHoras = [];
    let fim: boolean = false;
    let inicioCurrent: Date = new Date(
      `${ddmmaaaatoaaaammdd(this.data)}T${this.parametro.value.entrada}`
    );
    let finalCurrent: Date = new Date(
      `${ddmmaaaatoaaaammdd(this.data)}T${this.parametro.value.saida}`
    );
    while (!fim) {
      if (inicioCurrent < this.cortes[0] && finalCurrent > this.cortes[0]) {
        const horario = new LancaHoras();
        horario.hora_inicial = inicioCurrent;
        horario.hora_final = this.cortes[0];
        horario.id_motivo = '998002';
        inicioCurrent = this.cortes[0];
        this.lancaHoras.push(horario);
        if (inicioCurrent == finalCurrent) fim = true;
        continue;
      }
      if (
        inicioCurrent >= this.cortes[0] &&
        inicioCurrent <= this.cortes[1] &&
        finalCurrent > this.cortes[1]
      ) {
        const horario = new LancaHoras();
        horario.hora_inicial = inicioCurrent;
        horario.hora_final = this.cortes[1];
        horario.id_motivo = this.globalService.codigoMotivo;
        inicioCurrent = this.cortes[2];
        this.lancaHoras.push(horario);
        if (inicioCurrent == finalCurrent) fim = true;
        continue;
      }
      if (inicioCurrent >= this.cortes[0] && finalCurrent <= this.cortes[1]) {
        const horario = new LancaHoras();
        horario.hora_inicial = inicioCurrent;
        horario.hora_final = finalCurrent;
        horario.id_motivo = this.globalService.codigoMotivo;
        this.lancaHoras.push(horario);
        fim = true;
        continue;
      }
      if (inicioCurrent >= this.cortes[2] && finalCurrent <= this.cortes[3]) {
        const horario = new LancaHoras();
        horario.hora_inicial = inicioCurrent;
        horario.hora_final = finalCurrent;
        horario.id_motivo = this.globalService.codigoMotivo;
        this.lancaHoras.push(horario);
        fim = true;
        continue;
      }
      if (
        inicioCurrent >= this.cortes[2] &&
        inicioCurrent <= this.cortes[3] &&
        finalCurrent <= this.cortes[3]
      ) {
        let horario = new LancaHoras();
        horario.hora_inicial = inicioCurrent;
        horario.hora_final = finalCurrent;
        horario.id_motivo = this.globalService.codigoMotivo;
        this.lancaHoras.push(horario);
        fim = true;
        continue;
      }
      if (
        inicioCurrent >= this.cortes[2] &&
        inicioCurrent <= this.cortes[3] &&
        finalCurrent > this.cortes[2]
      ) {
        let horario = new LancaHoras();
        horario.hora_inicial = inicioCurrent;
        horario.hora_final = this.cortes[3];
        horario.id_motivo = this.globalService.codigoMotivo;
        inicioCurrent = this.cortes[3];
        this.lancaHoras.push(horario);
        if (inicioCurrent.getTime() === finalCurrent.getTime()) {
          fim = true;
          continue;
        }
        horario = new LancaHoras();
        horario.hora_inicial = inicioCurrent;
        horario.hora_final = finalCurrent;
        horario.id_motivo = '998002';
        this.lancaHoras.push(horario);
        fim = true;
        continue;
      }
    }
    fim = true;
  }

  loadCortes() {
    this.cortes = [];
    const apontamento: ApoExecucaoModel = this.apontamento;
    let data1: Date = new Date(
      `${ddmmaaaatoaaaammdd(this.data)}T${this.globalService
        .getUsuario()
        .man_hora_entrada.trim()}`
    );
    this.cortes.push(data1);
    data1 = new Date(
      `${ddmmaaaatoaaaammdd(this.data)}T${this.globalService
        .getUsuario()
        .man_hora_saida.trim()}`
    );
    this.cortes.push(data1);
    data1 = new Date(
      `${ddmmaaaatoaaaammdd(this.data)}T${this.globalService
        .getUsuario()
        .tard_hora_entrada.trim()}`
    );
    this.cortes.push(data1);
    data1 = new Date(
      `${ddmmaaaatoaaaammdd(this.data)}T${this.globalService
        .getUsuario()
        .tard_hora_saida.trim()}`
    );
    this.cortes.push(data1);
  }
}
