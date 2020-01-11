import { textures } from './textures';

export const planetData: PlanetDataMap = {
  green1: {
    id: 'green1',
    name: 'Green planet',
    minRadius: 24,
    maxRadius: 76,
    minMass: 0.005,
    maxMass: 0.05,
    texture: textures.green_planet_1,
  },
  green2: {
    id: 'green2',
    name: 'Green planet 2',
    minRadius: 48,
    maxRadius: 76,
    minMass: 0.005,
    maxMass: 0.1,
    texture: textures.green_planet_2,
  },
};

export const starData: StarDataMap = {
  black1: {
    id: 'black1',
    name: 'Black hole',
    minRadius: 960,
    maxRadius: 1024,
    minMass: 4500,
    maxMass: 5500,
    texture: textures.black_hole_1,
  },
  white1: {
    id: 'white1',
    name: 'White star',
    minRadius: 128,
    maxRadius: 128 * 3,
    minMass: 40,
    maxMass: 60,
    texture: textures.white_star_1,
  },
};

export type PlanetDataMap = Record<string, PlanetData>;

export interface PlanetData {
  id: string;
  name: string;
  minRadius: number;
  maxRadius: number;
  minMass: number;
  maxMass: number;
  texture: string;
}

export type StarDataMap = Record<string, StarData>;

export interface StarData {
  id: string;
  name: string;
  minRadius: number;
  maxRadius: number;
  minMass: number;
  maxMass: number;
  texture: string;
}
