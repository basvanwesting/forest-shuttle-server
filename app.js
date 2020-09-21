const express = require('express')

const app = express()
const port = process.env.PORT || 3000

const storage = require('node-persist')

storage.initSync()

const rfxcom = require("rfxcom")

const rfxtrx = new rfxcom.RfxCom("/dev/ttyUSB0", { debug: true })
const forestShuttle = new rfxcom.Blinds1(rfxtrx, rfxcom.blinds1.BLINDS_T7)

app.get('/current_position', (req, res) => {
  const deviceId = req.query.deviceId
  const position = storage.getItemSync(deviceId)
  res.send({ position })
})

app.get('/target_position', (req, res) => {
  const deviceId = req.query.deviceId
  const position = req.query.open

  if (position === "0") {
    if (rfxtrx.connected) {
      forestShuttle.close(deviceId)
    } else {
      rfxtrx.initialise(() => {
        forestShuttle.close(deviceId)
      })
    }
    storage.setItemSync(deviceId, position)
  } else if (position === "100") {
    if (rfxtrx.connected) {
      forestShuttle.open(deviceId)
    } else {
      rfxtrx.initialise(() => {
        forestShuttle.open(deviceId)
      })
    }
    storage.setItemSync(deviceId, position)
  } else {
    // noop, only support full close and open
    // don't store position
  }

  res.send({ position })
})


app.listen(port, () => console.log(`Listening on port ${port}!`))
