import React, { Component, createRef } from 'react'
import './App.css'
import nBodyProblem from './nBodyProblem'
import Manifestation from './manifestation'

import {
  g,
  dt,
  softeningConstant,
  masses,
  scale,
  radius
} from './constants'


const innerSolarSystem = new nBodyProblem({
  g,
  dt,
  masses: JSON.parse(JSON.stringify(masses)),
  softeningConstant
})

class App extends Component {

  canvasRef = createRef()

  populateManifestations = masses => {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext("2d")
    const trailLength = 35

    masses.forEach(
      mass =>
        (mass["manifestation"] = new Manifestation(
          ctx,
          trailLength,
          radius
        ))
    )
  }

  animate = () => {

    const canvas = this.canvasRef.current
    const ctx = canvas.getContext("2d")

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
        ctx.font = "14px Arial"
        ctx.fillText(massI.name, x + 12, y + 4)
        ctx.fill()
      }

      if (x < radius || x > width - radius) massI.vx = -massI.vx

      if (y < radius || y > height - radius) massI.vy = -massI.vy
    }

    requestAnimationFrame(this.animate)
  }

  componentDidMount () {
    this.populateManifestations(innerSolarSystem.masses)
    this.animate()

    const canvas = this.canvasRef.current
    const ctx = canvas.getContext("2d")

    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)

    let mousePressX = 0
    let mousePressY = 0

    let currentMouseX = 0
    let currentMouseY = 0

    let dragging = false

    canvas.addEventListener(
      "mousedown",
      e => {
        mousePressX = e.clientX
        mousePressY = e.clientY
        dragging = true
      },
      false
    )

    canvas.addEventListener(
      "mousemove",
      e => {
        currentMouseX = e.clientX
        currentMouseY = e.clientY
      },
      false
    )

    const massesList = document.querySelector("#masses-list")

    canvas.addEventListener(
      "mouseup",
      e => {
        const x = (mousePressX - width / 2) / scale
        const y = (mousePressY - height / 2) / scale
        const z = 0
        const vx = (e.clientX - mousePressX) / 35
        const vy = (e.clientY - mousePressY) / 35
        const vz = 0
        const trailLength = 35

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

        dragging = false
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
      <div className="App">
        <section id="controls-wrapper">
          <label>Mass of Added Planet</label>
          <select id="masses-list">
            <option value="0.000003003">Earth</option>
            <option value="0.0009543">Jupiter</option>
            <option value="1">Sun</option>
            <option value="0.1">Red Dwarf Star</option>
          </select>
          <button id="reset-button" onClick={this.handleReset}>Reset</button>
        </section>
        <canvas ref={this.canvasRef}/>
      </div>
    )
  }
}

export default App
