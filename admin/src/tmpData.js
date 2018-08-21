function generateRecords(numRecords){
  var records = []
  var rooms = ['be107', 'be204', 'be212', 'be141']
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  for (var i = 0; i < numRecords; i++){
    var newRecord = {
      "rooms": rooms[generateRandomInt(rooms.length)],
      "timestamp": generateTimeStamp,
      "entry":  Math.floor(Math.random() * Math.floor(2)),
      "result": generateRandomInt(2),
      "userID": generateAlphaNumericID(chars)
    }
    records.push(newRecord)
  }


  return record


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

  function generateTimeStamp() {
    var hour = generateRandomInt(24);
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
