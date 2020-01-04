import { Vector2, Clock } from "three";
import { IGameService } from "./index";
import { Universe } from "../Universe";
import { FLAGS } from "../../flags";
import { BaseObject } from "../object/BaseObject";

const vector2A = new Vector2();
const vector2B = new Vector2();

export class MainThreadGravityService implements IGameService {

    private readonly universe: Universe;
    private gravityCalcs: number = 0;

    constructor(universe: Universe) {
        this.universe = universe;
    }

    update(delta: number) {
        let clock = null;
        if (FLAGS.GRAVITY_WORKER_PERF) {
            this.gravityCalcs = 0;
            clock = new Clock();
            clock.start();
        }
        let { solarSystems, centerStar } = this.universe;
        for (let i = 0; i < solarSystems.length; i++) {
            for (let j = i + 1; j < solarSystems.length; j++) {
                let star1 = solarSystems[i].star;
                let star2 = solarSystems[j].star;
                let [accelerationA, accelerationB] = this.calcAccelerationDueToGravity(star1, star2);
                star2.accelerate(accelerationA);
                star1.accelerate(accelerationB);
            }
        }

        if (centerStar) {
            for (let solarSystem of solarSystems) {
                let star = solarSystem.star;
                let [accelerationA] = this.calcAccelerationDueToGravity(centerStar, star);
                star.accelerate(accelerationA);
            }
        }

        for (let solarSystem of solarSystems) {
            let star = solarSystem.star;
            let planets = solarSystem.planets;
            for (let i = 0; i < planets.length; i++) {
                let planet1 = planets[i];
                let [accelerationToStar] = this.calcAccelerationDueToGravity(star, planet1);
                planet1.accelerate(accelerationToStar);
                for (let j = i + 1; j < planets.length; j++) {
                    let planet2 = planets[j];
                    let [accelerationA, accelerationB] = this.calcAccelerationDueToGravity(planet1, planet2);
                    planet2.accelerate(accelerationA);
                    planet1.accelerate(accelerationB);
                }
            }
        }
        if (FLAGS.GRAVITY_WORKER_PERF) {
            clock!.stop();
            let time = clock!.getElapsedTime();
            console.log(`gravityCalcs = ${this.gravityCalcs}. Took ${(time * 1000).toFixed(2)}ms`);
        }
    }

    calcAccelerationDueToGravity(attractor: BaseObject, attractee: BaseObject) {
        let distancePx = vector2A.set(attractor.position.x, attractor.position.y).distanceTo(vector2B.set(attractee.position.x, attractee.position.y));
        let radians = vector2B
            .set(attractor.position.x, attractor.position.y)
            .sub(vector2A.set(attractee.position.x, attractee.position.y))
            .angle();
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let distanceSquared = distancePx * distancePx;
        let accelerationA = (attractor.mass / distanceSquared) * Universe.SCALE_INSIDE_SYSTEM;
        let accelerationB = (attractee.mass / distanceSquared) * Universe.SCALE_INSIDE_SYSTEM;
        if (FLAGS.GRAVITY_WORKER_PERF) {
            this.gravityCalcs++;
        }
        return [
            vector2A.set(cos * accelerationA, sin * accelerationA),
            vector2B.set(cos * accelerationB, sin * accelerationB),
        ];
    }

}