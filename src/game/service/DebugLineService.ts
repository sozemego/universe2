import { BufferAttribute, BufferGeometry, Line } from 'three';
import { InputHandler, KEY } from '../InputHandler';
import { BaseObject } from '../object/BaseObject';
import { ObjectFactory } from '../ObjectFactory';
import { GameOptions } from '../GameOptions';
import { IGameService } from './index';
import { ObjectList } from '../ObjectList';

export class DebugLineService implements IGameService {
  static MAX_POINTS = 5000;
  private objectList: ObjectList;
  private objectFactory: ObjectFactory;
  private input: InputHandler;
  private options: GameOptions;
  private pointMap: Record<string, Line>;
  private nextPointMap: Record<string, Line>;
  private timer: number = 0;
  private readonly storeEveryMs: number;

  constructor(
    objectList: ObjectList,
    objectFactory: ObjectFactory,
    input: InputHandler,
    options: GameOptions
  ) {
    this.objectList = objectList;
    this.objectFactory = objectFactory;
    this.input = input;
    this.options = options;
    this.input.onKeyDown(({ key }) => {
      if (key === KEY.l) {
        this.options.showDebugLines = true;
        return true;
      }
    });
    this.input.onKeyUp(({ key }) => {
      if (key === KEY.l) {
        this.options.showDebugLines = false;
        return true;
      }
    });
    this.pointMap = {};
    this.nextPointMap = {};
    this.storeEveryMs = 1000;
  }

  update(delta: number) {
    this.timer += delta * 1000;
    const storePoints = this.timer >= this.storeEveryMs;
    if (storePoints) {
      this.timer = 0;
    }
    this.objectList.allObjects.forEach(obj => {
      if (obj instanceof BaseObject) {
        this.createLine(obj, storePoints);
      }
    });
    Object.entries(this.pointMap).forEach(([key, value]) => {
      const isInNext = !!this.nextPointMap[key];
      if (!isInNext) {
        value.parent?.remove(value);
      }
    });
    this.pointMap = this.nextPointMap;
    this.nextPointMap = {};
  }

  createLine(obj: BaseObject, storePoints: boolean) {
    const line =
      this.pointMap[obj.id] ||
      this.objectFactory.createBufferedLine(DebugLineService.MAX_POINTS, obj.color);
    this.nextPointMap[obj.id] = line;
    line.visible = this.options.showDebugLines;
    if (!storePoints) {
      return;
    }
    let points = line.userData.points;
    const attributes = (line.geometry as BufferGeometry).attributes;
    const positions = attributes.position.array as Array<number>;
    positions[points++] = obj.position.x;
    positions[points++] = obj.position.y;
    positions[points++] = obj.position.z;
    if (points > DebugLineService.MAX_POINTS * 3) {
      points = 0;
    }
    line.userData.points = points;
    (line.geometry as BufferGeometry).setDrawRange(0, Math.ceil(points / 3));

    this.pointMap[obj.id] = line;
    (attributes.position as BufferAttribute).needsUpdate = true;
  }
}
