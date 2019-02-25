import React from 'react'

const Controls = ({ handleReset }) => (
  <section id='controls-wrapper'>
    <label>Add another celestial body:</label>

    <select id='masses-list'>
      <option value='earth'>Earth</option>
      <option value='jupiter'>Jupiter</option>
      <option value='redDwarf'>Red Dwarf Star</option>
      <option value='sun'>Sun</option>
      <option value='cygnus'>Cygnus X-1</option>
    </select>

    <button id='reset-button' onClick={handleReset}>Reset</button>
  </section>
)

export default Controls
