export class RetornoPesquisa {
  private id_empresa: number;
  private id_auditor: number;
  private hoje: Date;
  private id_atividade: number = 0;

  constructor(
    private idEmpresa: number,
    private idAuditor: number,
    dtRef: Date
  ) {
    this.id_empresa = idEmpresa;
    this.id_auditor = idAuditor;
    this.hoje = dtRef;
  }

  getId_Atividade(): number {
    return this.id_atividade;
  }

  setId_Atividade(value: number) {
    this.id_atividade = value;
  }
}
