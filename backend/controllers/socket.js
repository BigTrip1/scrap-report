const realTime = async (io) => {
  // console.log('Live  ---> ', io.opts)

  // create array of connected sockets so as to only run machine update cycle once

  let scoketArr = []

  //on connect
  io.on('connection', (socket) => {
    console.log('socket id just connected', socket.id)
    // console.log('socket ---> ', socket)

    // -----------------------start  of update only one group of machiunes  function  ------------------------  //
    //listen for this message
    socket.on('dpuUpdating', (data) => {
      console.log(data)

      // broadcast to all connected users (including yourself) that machine has just been updated
      io.emit('dpuUpdating', data)

      // broadcast to all connected users (excluding yourself) that machine has just been updated
      // socket.broadcast.emit('dpuUpdating', data)
    })

    // what to do on socket disconnect

    //on disconnect
    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id)
    })

    // end of socket disconnect

    // console.log(scoketArr)
    // console.log(num)
  })
}

export default realTime
