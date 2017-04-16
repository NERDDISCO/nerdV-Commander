let config = {

  // Global Strobe
  6 : {
    dmx : 'strobe',
    type : 'toggle',
    default : 0
  },
  5 : {
    dmx : 'strobe_frequency',
    type : 'knob',
    default : 0,
    range : {
      from: [ 0, 127 ],
      to: [ 0, 255 ]
    }
  },

  // Global Dimmer
  2 : {
    dmx : 'dimmer',
    type : 'knob',
    default : 255,
    range : {
      from: [ 0, 127 ],
      to: [ 0, 255 ]
    }
  },


  // Fog
  3 : {
    dmx : 'fog',
    type : 'toggle',
    default : 0
  },

  // Global UV
  9 : {
    dmx : 'uv',
    type : 'toggle',
    default : 0
  },


  // LED bar
  12 : {
    dmx : 'pixel_off',
    type : 'toggle',
    default : 0
  },

  // PAR lights
  15 : {
    dmx : 'lights_off',
    type : 'toggle',
    default : 0
  },


  // Starburst
  18 : {
    dmx : 'rotation',
    type : 'toggle',
    default : 0
  },
  17 : {
    dmx : 'rotation_speed',
    type : 'knob',
    default : 0,
    range : {
      from: [ 0, 127 ],
      to: [ 31, 255 ]
    }
  },


  // Bubbles
  21 : {
    dmx : 'bubbles',
    type : 'toggle',
    default : 0
  },
};
