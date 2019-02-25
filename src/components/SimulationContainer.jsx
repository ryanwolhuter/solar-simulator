import React, { Component, createRef } from 'react'
import nBodyProblem from '../nBodyProblem'
import Manifestation from '../manifestation'
import Controls from './Controls'

import {
  g,
  dt,
  softeningConstant,
  masses,
  massesToAdd,
  scale,
  trailLength
} from '../constants'

/* The whole simulation is an instance of the nBodyProblem class */

const innerSolarSystem = new nBodyProblem({
  g,
  dt,
  masses: JSON.parse(JSON.stringify(masses)),
  softeningConstant
})

/* Container component that holds animation and interaction logic */

class SimulationContainer extends Component {

  state = {
    mousePressX: 0,
    mousePressY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
    dragging: false
  }

  canvasRef = createRef()

  // Each celestial body is represented on the screen as a Manifestation

  populateManifestations = masses => {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    masses.forEach(
      mass =>
        (mass['manifestation'] = new Manifestation(
          ctx,
          trailLength,
          mass.radius,
          mass.hsl
        )
      )
    )
  }

  animate = () => {

    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)

    innerSolarSystem
      .updatePositionVectors()
      .updateAccelerationVectors()
      .updateVelocityVectors()

    ctx.clearRect(0, 0, width, height)

    const massesLen = innerSolarSystem.masses.length

    for (let i = 0; i < massesLen; i++) {
      const massI = innerSolarSystem.masses[i]

      const x = width / 2 + massI.x * scale
      const y = height / 2 + massI.y * scale

      massI.manifestation.draw(x, y)
    }

    const {
      dragging,
      mousePressX,
      mousePressY,
      currentMouseX,
      currentMouseY
    } = this.state

    if (dragging) {
      ctx.beginPath()
      ctx.moveTo(mousePressX, mousePressY)
      ctx.lineTo(currentMouseX, currentMouseY)
      ctx.strokeStyle = 'white'
      ctx.stroke()
    }

    requestAnimationFrame(this.animate)
  }

  componentDidMount () {
    this.populateManifestations(innerSolarSystem.masses)
    this.animate()

    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)

    canvas.addEventListener(
      'mousedown',
      e => {
        this.setState({
          mousePressX: e.clientX,
          mousePressY: e.clientY,
          dragging: true
        })
      },
      false
    )

    canvas.addEventListener(
      'mousemove',
      e => {
        this.setState({
          currentMouseX: e.clientX,
          currentMouseY: e.clientY
        })
      },
      false
    )

    const massesList = document.querySelector('#masses-list')

    canvas.addEventListener(
      'mouseup',
      e => {
        const { mousePressX, mousePressY } = this.state

        const mass = massesToAdd[massesList.value]
        const x = (mousePressX - width / 2) / scale
        const y = (mousePressY - height / 2) / scale
        const z = 0
        const vx = (e.clientX - mousePressX) / 35
        const vy = (e.clientY - mousePressY) / 35
        const vz = 0

        const newMass = {
          m: parseFloat(mass.mass),
          x,
          y,
          z,
          vx,
          vy,
          vz,
          manifestation: new Manifestation(ctx, trailLength, mass.radius, mass.hsl)
        }

        innerSolarSystem.masses.push(newMass)
        this.setState({ dragging: false })
      },
      false
    )
  }

  handleReset = () => {
    innerSolarSystem.masses = JSON.parse(JSON.stringify(masses))
    this.populateManifestations(innerSolarSystem.masses)
  }

  render() {

    return (
      <>
        <Controls handleReset={this.handleReset}/>
        <canvas ref={this.canvasRef} id='canvas'/>
      </>
    )
  }
}

export default SimulationContainer
