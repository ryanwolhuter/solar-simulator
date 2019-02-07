import React, { Component, createRef } from 'react'
import nBodyProblem from '../nBodyProblem'
import Manifestation from '../manifestation'
import Controls from './Controls'

import {
  g,
  dt,
  softeningConstant,
  masses,
  scale,
  radius,
  trailLength
} from '../constants'

const innerSolarSystem = new nBodyProblem({
  g,
  dt,
  masses: JSON.parse(JSON.stringify(masses)),
  softeningConstant
})

class SimulationContainer extends Component {

  state = {
    mousePressX: 0,
    mousePressY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
    dragging: false
  }

  canvasRef = createRef()

  populateManifestations = masses => {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    masses.forEach(
      mass =>
        (mass['manifestation'] = new Manifestation(
          ctx,
          trailLength,
          radius
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

      if (massI.name) {
        ctx.font = '14px Arial'
        ctx.fillText(massI.name, x + 12, y + 4)
        ctx.fill()
      }

      if (x < radius || x > width - radius) massI.vx = -massI.vx

      if (y < radius || y > height - radius) massI.vy = -massI.vy
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
      ctx.strokeStyle = 'red'
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

        const x = (mousePressX - width / 2) / scale
        const y = (mousePressY - height / 2) / scale
        const z = 0
        const vx = (e.clientX - mousePressX) / 35
        const vy = (e.clientY - mousePressY) / 35
        const vz = 0

        innerSolarSystem.masses.push({
          m: parseFloat(massesList.value),
          x,
          y,
          z,
          vx,
          vy,
          vz,
          manifestation: new Manifestation(ctx, trailLength, radius)
        })
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
