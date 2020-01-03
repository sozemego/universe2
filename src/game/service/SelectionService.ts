import { SelectionContainer } from '../SelectionContainer';
import { ObjectList } from '../ObjectList';
import { BaseObject } from '../object/BaseObject';

export class SelectionService {
  private readonly selectionContainer: SelectionContainer;
  private readonly objectList: ObjectList;

  constructor(selectionContainer: SelectionContainer, objectList: ObjectList) {
    this.selectionContainer = selectionContainer;
    this.objectList = objectList;
  }

  get selected() {
    return this.objectList.findById(this.selectionContainer.selected);
  }

  set selected(selected: BaseObject | null) {
    if (selected === null) {
      this.selectionContainer.selected = null;
      return;
    }
    this.selectionContainer.selected = selected.id;
  }

  get mouseOver() {
    return this.objectList.findById(this.selectionContainer.mouseOver);
  }
}
