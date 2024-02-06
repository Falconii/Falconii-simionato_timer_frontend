import { AtividadeQuery_01Model } from 'src/app/Models/atividade-query_01-model';
import { DynamicFlatNodeV2 } from './Dynamic-FlatNode-V2';

export class DynamicDatabase {
  rootLevelNodes: string[] = [];

  dataMap!: Map<string, string[]>;

  constructor(private lsAtividades: AtividadeQuery_01Model[]) {
    this.inicializa();
  }

  inicializa() {
    this.lsAtividades.forEach((ativ) => {
      if (ativ.tipo == 'C') {
        this.rootLevelNodes.push(ativ.subconta.trim());
      }
    });
    this.dataMap = this.getDataMap();
    console.log(
      'rootLevelNodes',
      this.rootLevelNodes,
      'this.dataMap ',
      this.dataMap
    );
  }

  getDataMap(): Map<string, string[]> {
    this.dataMap = new Map<string, string[]>();
    this.rootLevelNodes.forEach((no) => {
      this.getNivel(no);
    });
    return this.dataMap;
  }

  getNivel(no: string) {
    const nivel: number = no.length / 2;
    const subNiveis: string[] = this.getSubNiveis(no);
    if (subNiveis.length > 0) this.dataMap.set(no, subNiveis);
    subNiveis.forEach((sub) => {
      this.getNivel(sub);
    });
  }

  getSubNiveis(no: string): string[] {
    let retorno: string[] = [];
    const nivel: number = no.length / 2;
    this.lsAtividades.forEach((ativ) => {
      if (
        no == ativ.subconta.substring(0, nivel * 2) &&
        ativ.nivel == nivel + 1
      ) {
        retorno.push(ativ.subconta.trim());
      }
    });
    return retorno;
  }

  getAtividade(subconta: string): AtividadeQuery_01Model {
    let seach: any = null;
    let retorno: AtividadeQuery_01Model = new AtividadeQuery_01Model();
    seach = this.lsAtividades.filter((ativ) => {
      ativ.subconta.trim() == subconta.trim();
    });
    if (seach !== null) {
      retorno = <AtividadeQuery_01Model>seach;
    }
    return retorno;
  }

  /*
  getDataMap(): Map<string, string[]> {
    return new Map<string, string[]>([
      ['Fruits', ['Apple', 'Orange', 'Banana']],
      ['Vegetables', ['Tomato', 'Potato', 'Onion']],
      ['Apple', ['Fuji', 'Macintosh']],
      ['Onion', ['Yellow', 'White', 'Purple']],
    ]);
  }
*/
  /** Initial data from database */
  initialData(): DynamicFlatNodeV2[] {
    return this.rootLevelNodes.map(
      (name) => new DynamicFlatNodeV2(name, this.getAtividade(name), 0, true)
    );
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
