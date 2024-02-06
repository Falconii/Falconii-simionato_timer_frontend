import {
  CollectionViewer,
  SelectionChange,
  DataSource,
} from '@angular/cdk/collections';
import { DynamicFlatNodeV2 } from './Dynamic-FlatNode-V2';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DynamicDatabase } from './Dynamic-Database';
import { map } from 'rxjs/operators';

export class DynamicDataSource implements DataSource<DynamicFlatNodeV2> {
  dataChange = new BehaviorSubject<DynamicFlatNodeV2[]>([]);

  get data(): DynamicFlatNodeV2[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNodeV2[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNodeV2>,
    private _database: DynamicDatabase
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNodeV2[]> {
    this._treeControl.expansionModel.changed.subscribe((change) => {
      if (
        (change as SelectionChange<DynamicFlatNodeV2>).added ||
        (change as SelectionChange<DynamicFlatNodeV2>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNodeV2>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(
      map(() => this.data)
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  handleTreeControl(change: SelectionChange<DynamicFlatNodeV2>) {
    if (change.added) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach((node) => this.toggleNode(node, false));
    }
  }

  toggleNode(node: DynamicFlatNodeV2, expand: boolean) {
    const children = this._database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(
          (name) =>
            new DynamicFlatNodeV2(
              name,
              null,
              node.level + 1,
              this._database.isExpandable(name)
            )
        );
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        ) {}
        this.data.splice(index + 1, count);
      }

      this.dataChange.next(this.data);
      node.isLoading = false;
    }, 1000);
  }
}
