import React from 'react'

const Controls = ({ handleReset }) => (
  <section id='controls-wrapper'>
    <label>Mass of Added Planet</label>

    <select id='masses-list'>
      <option value='0.000003003'>Earth</option>
      <option value='0.0009543'>Jupiter</option>
      <option value='0.1'>Red Dwarf Star</option>
      <option value='1'>Sun</option>
      <option value='14.8'>Cygnus X-1</option>
    </select>

    <button id='reset-button' onClick={handleReset}>Reset</button>
  </section>
)

export default Controls
