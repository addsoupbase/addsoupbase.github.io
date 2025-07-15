import Matter from
         'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/+esm'
import { vect } from '../../num.js'
import * as decomp from
         'https://cdn.jsdelivr.net/npm/poly-decomp-es@0.4.2/+esm'
export const { Engine, Bodies, Events, Constraint, Body, Collision, Runner, Common, Vertices, Composite, Svg, Sleeping, Vector } = Matter
Common.setDecomp(decomp)
export const bounds = vect(
    4000,
    4000
)
export const engine = Engine.create({
    enableSleeping: true,
    sleepThreshold: 60,
})
export const base = {
    frictionAir: 0.005,
    friction: .1,
    // inertia: 2000,
    restitution: 1,     // Bounciness
    // mass: 5,
    density: 1,
}
export const runner = Runner.create()
export const { world } = engine
export function getAllBodies() {
    return Composite.allBodies(world)
}
export function getAllConstraints() {
    return Composite.allConstraints(world)
}