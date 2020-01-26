import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  FrontSide,
  Geometry,
  Line,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
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
import { SpriteText2D, textAlign } from 'three-text2d';
import { Text2D } from 'three-text2d/lib/Text2D';
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
    let geometry = new CircleGeometry(1, 256, 0, Math.PI * 2);
    geometry.vertices.shift();
    let circle = new LineLoop(
      geometry,
      new LineBasicMaterial({ color, linewidth: 1, transparent: true })
    );
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

  // createText(text: string): Mesh {
  //   let canvas = document.createElement('canvas');
  //   let context = canvas.getContext('2d');
  //   if (!context) {
  //     throw new Error('Context 2d has to exist');
  //   }
  //   let fontSize = 56;
  //   context.font = `${fontSize}px monospace`;
  //   let textMetrics = context.measureText(text);
  //   let { width } = textMetrics;
  //   let height = fontSize;
  //   canvas.width = width;
  //   canvas.height = height;
  //   canvas.style.width = width + 'px';
  //   canvas.style.height = height + 'px';
  //   context.font = `${fontSize}px monospace`;
  //   context.textAlign = 'center';
  //   context.textBaseline = 'middle';
  //
  //   context.fillStyle = 'transparent';
  //   context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  //   context.fillStyle = 'white';
  //   context.fillText(text, width / 2, height / 2);
  //
  //   let texture = new Texture(canvas);
  //   texture.needsUpdate = true;
  //   let material = new MeshBasicMaterial({ map: texture });
  //   let geometry = new PlaneGeometry(canvas.width, canvas.height, 10, 10);
  //   let mesh = new Mesh(geometry, material);
  //   this.scene.add(mesh);
  //   return mesh;
  // }

  createText(text: string): Text2D {
    let sprite = new SpriteText2D(text, {
      align: textAlign.center,
      font: '104px Arial',
      fillStyle: '#373737',
      antialias: true,
    });
    this.scene.add(sprite);
    return sprite;
  }
}
