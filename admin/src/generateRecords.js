function generateRecords(numRecords){
  var records = []
  var rooms = ['be107', 'be204', 'be212', 'be141']
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  const methods = ["NFC", "RFID", "Keypad"]

  for (var i = 0; i < numRecords/2; i++){
    var newRecord = {
      "room": rooms[generateRandomInt(rooms.length)],
      "timestamp": generateTimeStamp(0,24),
      "method":  methods[generateRandomInt(methods.length)],
      "result": generateRandomInt(2),
      "entry": 1,
      "userID": generateAlphaNumericID(chars)
    }
    records.push(newRecord)
  }

  for (i = 0; i < numRecords/2; i++){
    newRecord = {
      "room": rooms[generateRandomInt(rooms.length)],
      "timestamp": generateTimeStamp(6,45),
      "method":  methods[generateRandomInt(methods.length)],
      "result": generateRandomInt(2),
      "entry": 0,
      "userID": generateAlphaNumericID(chars)
    }
    records.push(newRecord)
  }


  return records


  function gaussianRand() {
    var rand = 0;
    for (var i = 0; i < 10; i += 1) {
      rand += Math.random();
    }
    return rand / 10;
  }

  function gaussianRandom(start, end) {
    return Math.floor(start + gaussianRand() * (end - start + 1));
  }

  function generateRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function generateTimeStamp(start, end) {
    var hour = gaussianRandom(start, end);
    var day = 1 + generateRandomInt(31)
    if (day < 10) {
      day = '0' + day
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    var timeStamp = `2018-03-${day}T${hour}:07:44+00:00`
    return timeStamp
  }

  function generateAlphaNumericID(chars) {
    var result = ''
    for (var i = 7; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}

module.exports = generateRecords
