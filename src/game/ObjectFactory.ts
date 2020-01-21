import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  FrontSide,
  Geometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  RepeatWrapping,
  RingGeometry,
  Scene,
  Shape,
  Sphere,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  Vector2,
} from 'three';
import { randomPointInSphere } from '../mathUtils';
import { SelectionRectangle } from './object/primitive/SelectionRectangle';

export class ObjectFactory {
  private readonly scene: Scene;
  private readonly textureLoader: TextureLoader;
  private readonly textureCache: Record<string, Texture> = {};

  constructor(scene: Scene) {
    this.scene = scene;
    this.textureLoader = new TextureLoader();
  }

  createRing(radius: number) {
    const geometry = new RingGeometry(radius - 10, radius + 10, 16, 16);
    const material = new MeshBasicMaterial({
      color: 0xff0000,
      side: FrontSide,
    });
    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  createCircle(radius: number, color: Color | number): Line {
    let geometry = new CircleGeometry(1, 128, 0, 7);
    geometry.vertices.shift();
    let circle = new Line(geometry, new LineBasicMaterial({ color, linewidth: 1 }));
    this.scene.add(circle);
    circle.scale.x = radius;
    circle.scale.y = radius;
    return circle;
  }

  createSphere(radius: number) {
    const geometry = new SphereGeometry(radius, 32, 32);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  createBufferedLine(maxPoints: number, color: number | Color) {
    color = color ? color : 0xff00ff;
    const material = new LineBasicMaterial({ color, linewidth: 4 });
    const positions = new Float32Array(maxPoints * 3);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);

    const line = new Line(geometry, material);
    this.scene.add(line);
    line.userData.points = 0;
    return line;
  }

  createCircleFilled(radius: number, textureName: string) {
    const texture = this.getTexture(textureName);
    const geometry = new CircleGeometry(radius, 32);
    const material = new MeshBasicMaterial({ color: 0xffff00, map: texture });
    const circle = new Mesh(geometry, material);
    this.scene.add(circle);
    return circle;
  }

  createSprite(
    textureName: string,
    position: Vector2,
    width: number,
    height: number,
    sizeAttenuation = true
  ) {
    const texture = this.getTexture(textureName);
    const spriteMaterial = new SpriteMaterial({
      map: texture,
      color: 0xffffff,
      opacity: 1,
      transparent: true,
      sizeAttenuation,
    });
    const sprite = new Sprite(spriteMaterial);
    sprite.position.x = position.x;
    sprite.position.y = position.y;
    sprite.scale.x = width;
    sprite.scale.y = height;
    sprite.userData['width'] = width;
    sprite.userData['height'] = height;
    this.scene.add(sprite);
    return sprite;
  }

  createBackground(textureName: string, position: Vector2, width: number, height: number) {
    this.scene.background = this.getTexture(textureName);
  }

  createPoints(n: number, bounds: Sphere, color: Color | number) {
    const geometry = new Geometry();
    for (let i = 0; i < n; i++) {
      const position = randomPointInSphere(bounds);
      geometry.vertices.push(position);
    }
    const material = new PointsMaterial({ color });
    const points = new Points(geometry, material);
    this.scene.add(points);
    return points;
  }

  createSelectionRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color | number
  ) {
    let shape = new Shape();
    shape.moveTo(x, y);
    shape.lineTo(x, y + height * 2);
    shape.lineTo(x + width * 2, y + height * 2);
    shape.lineTo(x + width * 2, y);
    shape.lineTo(x, y);

    let points = shape.getPoints();
    let geometryPoints = new Geometry().setFromPoints(points);
    let rectangle = new SelectionRectangle(geometryPoints, new LineBasicMaterial({ color }));
    this.scene.add(rectangle);
    return rectangle;
  }

  getTexture(textureName: string): Texture {
    let texture = this.textureCache[textureName];
    if (!texture) {
      texture = this.textureLoader.load(textureName);
      this.textureCache[textureName] = texture;
    }
    return texture;
  }
}
