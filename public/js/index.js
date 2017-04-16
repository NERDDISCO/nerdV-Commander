WebMidi.enable(function (err) {

  if (err) {
    console.log("WebMidi could not be enabled.", err);
  } else {
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);

    // novation Launch Control
    let commander = new nerdVCommander({
      id_input : '154707764',
      id_output : '-1177699889',
      url : 'ws://localhost:1337'
    });


    WebMidi.addListener('connected', function(event) {
      console.log(event);
    });

    // AKAI MIDImix
    // let commander = new nerdVCommander({
    //   id_input : '1337796693',
    //   id_output : '-1571517878'
    // });
  }

});


class nerdVCommander {
  constructor(args) {

    this.input = WebMidi.getInputById(args.id_input);
    this.output = WebMidi.getOutputById(args.id_output);

    this.outputElement = document.getElementById('output');
    this.outputElementModV = document.getElementById('outputModV');

    this.dmxData = {
      _type : 'nerdVCommander'
    };
    this.initDMX();

    this.url = args.url;
    this.connection = null;
    this.initWebSocket();

    this.processDMX();


    // Listen to control change message on all channels
    this.input.addListener('controlchange', "all",
      function (e) {
        let data = e.data;
        let note = data[1];
        let velocity = data[2];

        console.log(note, velocity);

        if (config.hasOwnProperty(note)) {
          // Get the current control
          let element = config[note];

          if (element.type === 'toggle') {
            this.toggle(element, note, velocity);
          }

          if (element.type === 'knob') {
            this.knob(element, note, velocity);
          }
        }

        this.processDMX();

      }.bind(this)
    );

  }




  processDMX() {
    // Format the output and show it in the frontend
    this.outputElement.innerHTML = this.syntaxHighlight(this.dmxData);

    if (this.connection.readyState === 1) {
      this.connection.send(JSON.stringify(this.dmxData));
    }
  }



  initDMX() {

    // Iterate over all elements in the config
    for (let note in config) {
      // Get the current element
      let element = config[note];

      // The element has a dmx mapping defined
      if (element.hasOwnProperty('dmx')) {
        // Set the default value
        this.dmxData[element.dmx] = element.default;

        // if (element.type === 'toggle') {
        //   // Turn off button light
        //   this.output._midiOutput.send([ 176, note, 0 ]);
        // }

      }

    }
  }


  initWebSocket() {
    this.connection = new WebSocket(this.url);

    // Listen for messages from the server
    this.connection.addEventListener('message', function(message) {
      // Format the output and show it in the frontend
      this.outputElementModV.innerHTML = this.syntaxHighlight(JSON.parse(message.data));

    }.bind(this));
  }



  toggle(element, note, velocity) {

    // on
    if (velocity === 127) {
      // Turn on button light
      this.output._midiOutput.send([ 176, note, 60 ]);

      // Max value for the DMX device
      this.dmxData[element.dmx] = 255;

    // off
    } else {
      // Turn off button light
      this.output._midiOutput.send([ 176, note, 0 ]);

      // Min value for the DMX device
      this.dmxData[element.dmx] = 0;
    }

  }



  knob(element, note, velocity) {
    // Map the range
    if (element.hasOwnProperty('range')) {
      velocity = this.rangeMapping(velocity, element.range.from, element.range.to);
    }

    // Set the value of the hardware knob
    this.dmxData[element.dmx] = velocity;
  }


  // Linear mapping of the given "value" of range "from" into range "to"
  // for example: rangeMapping(127, [0, 127], [0, 255]) -> 255
  rangeMapping(value, from, to) {
    return Math.floor(to[0] + (value - from[0]) * (to[1] - to[0]) / (from[1] - from[0]));
  }


  syntaxHighlight(json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }
}
