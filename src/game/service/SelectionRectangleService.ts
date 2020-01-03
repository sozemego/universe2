import { Box3, Color, Geometry, Object3D } from 'three';
import { BaseObject } from '../object/BaseObject';
import { SelectionService } from './SelectionService';
import { ObjectFactory } from '../ObjectFactory';
import { SelectionRectangle } from '../object/primitive/SelectionRectangle';
import { IGameService } from './index';

export class SelectionRectangleService implements IGameService {
  private readonly selectionService: SelectionService;
  private readonly objectFactory: ObjectFactory;
  private selectionRectangle: SelectionRectangle | null = null;
  private lastSelected: any = null;

  constructor(selectionService: SelectionService, objectFactory: ObjectFactory) {
    this.selectionService = selectionService;
    this.objectFactory = objectFactory;
  }

  update(delta: number) {
    let selected = this.selectionService.selected;
    if (selected !== this.lastSelected) {
      if (selected) {
        this.createRectangle(selected);
        this.lastSelected = selected;
      } else {
        this.destroyRectangle();
        this.lastSelected = null;
      }
    } else if (selected) {
      if (this.selectionRectangle) {
        this.selectionRectangle.position.set(0, 0, 0);
      }
    }
  }

  createRectangle(selected: BaseObject) {
    if (this.selectionRectangle) {
      this.destroyRectangle();
    }
    let box = this.computeBoundingBox(selected.object3D);
    if (box) {
      this.selectionRectangle = this.objectFactory.createSelectionRectangle(
        box.min.x,
        box.min.y,
        box.max.x,
        box.max.y,
        Color.NAMES['red']
      );
      selected.object3D.add(this.selectionRectangle);
    }
  }

  destroyRectangle() {
    if (this.selectionRectangle) {
      this.selectionRectangle.dispose();
    }
  }

  computeBoundingBox(obj: Object3D): Box3 | null {
    if (obj.hasOwnProperty('geometry')) {
      // @ts-ignore
      (obj.geometry as Geometry).computeBoundingBox();
      // @ts-ignore
      return obj.geometry.boundingBox;
    }
    return null;
  }
}
