import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export class DynamicFlatNodeV2 {
  constructor(
    public item: string,
    public objeto: any = null,
    public level = 1,
    public expandable = false,
    public isLoading = false
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class TreeProjetoService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  loadEstrutura() {}

  dataMap = new Map<string, string[]>([
    ['Fruits', ['Apple', 'Orange', 'Banana']],
    ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    ['Apple', ['Fuji', 'Macintosh']],
    ['Onion', ['Yellow', 'White', 'Purple']],
  ]);

  rootLevelNodes: string[] = ['Fruits', 'Vegetables'];

  /** Initial data from database */
  initialData(): DynamicFlatNodeV2[] {
    return this.rootLevelNodes.map(
      (name) => new DynamicFlatNodeV2(name, null, 0, true)
    );
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
