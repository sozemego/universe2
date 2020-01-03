const KEY_DOWN = 'KEY_DOWN';
const KEY_UP = 'KEY_UP';
const MOUSE_WHEEL = 'MOUSE_WHEEL';
const MOUSE_MOVE = 'MOUSE_MOVE';
const MOUSE_UP = 'MOUSE_UP';

export function createInputHandler(dom: HTMLElement | Window = window): InputHandler {
  console.log(`Creating input handler for ${dom}`);
  //not all elements can listen to key events. In case window is not passed
  //we want to use window to capture key events
  const keyListener = dom !== window ? window : dom;
  if (dom !== window) {
    console.log('passed DOM element is not window, window will be used for key capture.');
  }

  const listeners: ListenerContainer = {
    [KEY_DOWN]: [],
    [KEY_UP]: [],
    [MOUSE_WHEEL]: [],
    [MOUSE_MOVE]: [],
    [MOUSE_UP]: [],
  };

  const pressedKeys = new Set<string>();

  const subscribe = (type: string, fn: Function) => {
    const typeListeners = listeners[type];
    typeListeners.push(fn);
    console.log(`Subscribed ${type} ${dom}`);
    return unsubscribeCallback(typeListeners, fn);
  };

  const unsubscribeCallback = (listeners: Function[], fn: Function) => () => {
    const index = listeners.findIndex(listener => listener === fn);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };

  const onKeyUp = (fn: Function) => {
    return subscribe(KEY_UP, fn);
  };

  const keyup = (event: KeyboardEvent) => {
    // console.log(event);
    const keyEvent = convert(event);
    handle(KEY_UP, keyEvent);
  };

  keyListener.addEventListener('keyup', keyup);

  const onKeyDown = (fn: Function) => {
    return subscribe(KEY_DOWN, fn);
  };

  const keydown = (event: KeyboardEvent) => {
    const keyEvent = convert(event);
    handle(KEY_DOWN, keyEvent);
  };

  keyListener.addEventListener('keydown', keydown);

  const onMouseWheel = (fn: Function) => {
    return subscribe(MOUSE_WHEEL, fn);
  };

  const mouseWheel = (event: any) => {
    const delta = Math.sign(event.deltaY);
    handle(MOUSE_WHEEL, delta);
  };

  dom.addEventListener('wheel', mouseWheel);

  const onMouseMove = (fn: Function) => {
    return subscribe(MOUSE_MOVE, fn);
  };

  const mouseMove = (event: any) => {
    const boundingBox = event.target.getBoundingClientRect();
    const rawX = event.clientX - boundingBox.x;
    const rawY = event.clientY - Math.ceil(boundingBox.y);
    const mouse = {
      rawX,
      rawY,
      x: (rawX / Math.ceil(boundingBox.width)) * 2 - 1,
      y: -(rawY / Math.ceil(boundingBox.height)) * 2 + 1,
    };
    handle(MOUSE_MOVE, mouse);
  };

  dom.addEventListener('mousemove', mouseMove);

  const onMouseUp = (fn: Function) => {
    return subscribe(MOUSE_UP, fn);
  };

  const mouseUp = (event: any) => {
    const boundingBox = event.target.getBoundingClientRect();
    const rawX = event.clientX - boundingBox.x;
    const rawY = event.clientY - Math.ceil(boundingBox.y);
    const mouse = {
      rawX,
      rawY,
      x: (rawX / Math.ceil(boundingBox.width)) * 2 - 1,
      y: -(rawY / Math.ceil(boundingBox.height)) * 2 + 1,
      button: event.button,
    };
    handle(MOUSE_UP, mouse);
  };

  dom.addEventListener('mouseup', mouseUp);

  // const contextMenu = (event) => event.preventDefault();

  // dom.addEventListener('contextmenu', contextMenu);

  const destroy = () => {
    console.log('Destroying input handler');
    keyListener.removeEventListener('keydown', keydown);
    keyListener.removeEventListener('keyup', keyup);
    dom.removeEventListener('wheel', mouseWheel);
    dom.removeEventListener('mousemove', mouseMove);
    dom.removeEventListener('mouseup', mouseUp);
    // dom.removeEventListener('contextmenu', contextMenu);
    Object.keys(listeners).forEach(type => (listeners[type] = []));
  };

  const handle = (eventType: string, event: any) => {
    const typeListeners = listeners[eventType];
    for (let i = 0; i < typeListeners.length; i++) {
      const listener = typeListeners[i];
      const handled = listener(event, pressedKeys);
      if (handled) {
        return;
      }
    }
  };

  const pressKey = (key: string) => {
    handle(KEY_UP, { key });
  };

  return {
    onKeyUp,
    onKeyDown,
    onMouseWheel,
    destroy,
    onMouseMove,
    onMouseUp,
    pressKey,
  };
}

function convert(event: KeyboardEvent): KeyEvent {
  return {
    key: event.key as KEY,
    keyCode: event.keyCode,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
  };
}

export interface InputHandler {
  onKeyUp: (fn: (key: KeyEvent) => boolean | void) => UnsubscribeCallback;
  onKeyDown: (fn: (key: KeyEvent) => boolean | void) => UnsubscribeCallback;
  onMouseWheel: (fn: (delta: number) => boolean | void) => UnsubscribeCallback;
  onMouseMove: (fn: (mouse: Mouse) => boolean | void) => UnsubscribeCallback;
  onMouseUp: (fn: (mouse: Mouse) => boolean | void) => UnsubscribeCallback;
  destroy: () => void;
  pressKey: (key: string) => void;
}

export interface UnsubscribeCallback extends Function {}

interface ListenerContainer {
  [eventType: string]: Function[];
}

export interface Mouse {
  rawX: number;
  rawY: number;
  x: number;
  y: number;
  button: number;
  worldX: number;
  worldY: number;
}

export type KeyEvent = {
  key: KEY;
  keyCode: number;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
};

export enum KEY {
  ESC = 'Escape',
  ALT = 'Alt',
  SHIFT = 'Shift',
  CTRL = 'Ctrl',
  BRACKET_LEFT = 'BracketLeft',
  BRACKET_RIGHT = 'BracketRight',
  PLUS = '+',
  MINUS = '-',
  Q = 'Q',
  W = 'W',
  E = 'E',
  R = 'R',
  T = 'T',
  Y = 'Y',
  U = 'U',
  I = 'I',
  O = 'O',
  P = 'P',
  A = 'A',
  S = 'S',
  D = 'D',
  F = 'F',
  G = 'G',
  H = 'H',
  J = 'J',
  K = 'K',
  L = 'L',
  Z = 'Z',
  X = 'X',
  C = 'C',
  V = 'V',
  B = 'B',
  N = 'N',
  M = 'M',
  q = 'q',
  w = 'w',
  e = 'e',
  r = 'r',
  t = 't',
  y = 'y',
  i = 'i',
  o = 'o',
  p = 'p',
  a = 'a',
  s = 's',
  d = 'd',
  f = 'f',
  g = 'g',
  h = 'h',
  j = 'j',
  k = 'k',
  l = 'l',
  z = 'z',
  x = 'x',
  c = 'c',
  v = 'v',
  b = 'b',
  n = 'n',
  m = 'm',
}
