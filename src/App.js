import React, { Component, createRef } from 'react'
import './App.css'
import nBodyProblem from './nBodyProblem'
import { g, dt, softeningConstant, masses } from './constants'
import Manifestation from './manifestation'

const innerSolarSystem = new nBodyProblem({
  g,
  dt,
  masses: JSON.parse(JSON.stringify(masses)),
  softeningConstant
});

const scale = 70;
const radius = 4;

class App extends Component {

  canvasRef = createRef()

  populateManifestations = masses => {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext("2d");
    const trailLength = 35;

    masses.forEach(
      mass =>
        (mass["manifestation"] = new Manifestation(
          ctx,
          trailLength,
          radius
        ))
    );
  };

  animate = () => {

    const canvas = this.canvasRef.current
    const ctx = canvas.getContext("2d");
    const trailLength = 35;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    innerSolarSystem
      .updatePositionVectors()
      .updateAccelerationVectors()
      .updateVelocityVectors();

    ctx.clearRect(0, 0, width, height);

    const massesLen = innerSolarSystem.masses.length;

    for (let i = 0; i < massesLen; i++) {
      const massI = innerSolarSystem.masses[i];

      const x = width / 2 + massI.x * scale;
      const y = height / 2 + massI.y * scale;

      massI.manifestation.draw(x, y);

      if (massI.name) {
        ctx.font = "14px Arial";
        ctx.fillText(massI.name, x + 12, y + 4);
        ctx.fill();
      }

      if (x < radius || x > width - radius) massI.vx = -massI.vx;

      if (y < radius || y > height - radius) massI.vy = -massI.vy;
    }

    requestAnimationFrame(this.animate);
  };

  componentDidMount () {
    this.populateManifestations(innerSolarSystem.masses)
    this.animate()
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
          <button id="reset-button">Reset</button>
        </section>
        <canvas ref={this.canvasRef}/>
      </div>
    )
  }
}

export default App
