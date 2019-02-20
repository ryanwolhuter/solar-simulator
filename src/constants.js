/*
 * Inputs for our NBodyProblem
 */

const g = 39.5
const dt = 0.003
const softeningConstant = 0.15

const masses = [{
  name: 'Sun', //We use solar masses as the unit of mass, so the mass of the Sun is exactly 1
  m: 1,
  x: -1.50324727873647e-6,
  y: -3.93762725944737e-6,
  z: -4.86567877183925e-8,
  vx: 3.1669325898331e-5,
  vy: -6.85489559263319e-6,
  vz: -7.90076642683254e-7,
  hsl: '60, 80%, 65%'
},
  {
    name: 'Mercury',
    m: 1.65956463e-7,
    x: -0.346390408691506,
    y: -0.272465544507684,
    z: 0.00951633403684172,
    vx: 4.25144321778261,
    vy: -7.61778341043381,
    vz: -1.01249478093275,
    hsl: '60, 10%, 79%'
  },
  {
    name: 'Venus',
    m: 2.44699613e-6,
    x: -0.168003526072526,
    y: 0.698844725464528,
    z: 0.0192761582256879,
    vx: -7.2077847105093,
    vy: -1.76778886124455,
    vz: 0.391700036358566,
    hsl: '60, 93%, 94%'
  },
  {
    name: 'Earth',
    m: 3.0024584e-6,
    x: 0.648778995445634,
    y: 0.747796691108466,
    z: -3.22953591923124e-5,
    vx: -4.85085525059392,
    vy: 4.09601538682312,
    vz: -0.000258553333317722,
    hsl: '212, 44%, 63%'
  },
  {
    m: 3.213e-7,
    name: 'Mars',
    x: -0.574871406752105,
    y: -1.395455041953879,
    z: -0.01515164037265145,
    vx: 4.9225288800471425,
    vy: -1.5065904473191791,
    vz: -0.1524041758922603,
    hsl: '9, 70%, 44%'
  }
]

// Animation constants

const scale = 170
const radius = 6
const trailLength = 35

export { g, dt, softeningConstant, masses, scale, radius, trailLength }
