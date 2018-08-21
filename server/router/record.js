const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const moment = require('moment');
const app = new Koa();
app.use(bodyParser());
const _ = require('underscore')

// Imports the Google Cloud client library
const Datastore = require('@google-cloud/datastore');

// Your Google Cloud Platform project ID
const projectId = 'cmpe123b';

// Creates a client
const datastore = new Datastore({
  projectId: projectId,
});

//get all records
router.get('/records/', async (ctx, next) => {
  var records = await new Promise((resolve) => {
    const query = datastore
    .createQuery('record')
    datastore.runQuery(query).then(results => {
      const records = results[0]
      resolve(records);
    });
  });
  console.log('records: ', records);
  ctx.body = records
  await next();
});


router.get('/records/:id', async (ctx, next) => {
  const id = Number(ctx.params.id);
  const result = await getRecord(id);
  if (!result) {
    ctx.body = {
      "error": "no such record"
    }
  }
  else {
    ctx.body = result;
  }
});



//create new record
router.post('/records/', async (ctx, next) => {
    const timestamp = moment().format()
    const userID = ctx.request.body.userID
    const lockID = ctx.request.body.lockID
    const method = ctx.request.body.method
    const result = ctx.request.body.result
    const entry = ctx.request.body.entry
    var id = ctx.request.body.ID

    const kind = "record";
    if(typeof(id) == "undefined"){
       id = getRandomInt();
    }
    console.log("id", id);
    const recordKey = datastore.key([kind, id]);
    // Prepares the new entity
    const record = {
      key: recordKey,
      data: {
        ID: id,
        timestamp: timestamp,
        userID: userID,
        lockID: lockID,
        method: method,
        result: result,
        entry: entry
      }
    };
    // Saves the entity
    datastore
    .save(record)
    .then(() => {
      console.log(`Saved ${record.data}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
      ctx.body = {
        error: "there was an error"
      }
    });
    ctx.body = {
      result: "success",
      recordAdded: record
    }
  await next();
});

//delete a lock by ID
router.delete('/records/:id', async (ctx, next) => {
  const id = Number(ctx.params.id);
  const record = await getRecord(id);
  if (record){
    console.log("deleting record ", record.ID);
    const kind = 'record'
    const recordKey = datastore.key([kind, id]);
    datastore.delete(recordKey).then(() => {
      console.log("record deleted");
    })
    .catch(err => {
      console.error('ERROR:', err);
      ctx.body = {
        result: "error",
        error: err
      }
    });
    ctx.body = {
      result: "success",
      recordIdRemoved: id
    }
  }
  else {
    ctx.body = {
      result: "error",
      msg: "record did not exist"
    }
  }
  await next();
});


function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(1000000));
}

async function getRecord(id) {
  return new Promise((resolve) => {
    const query = datastore
    .createQuery('record')
    .filter('ID','=',id)
    datastore.runQuery(query).then(results => {
      const record = results[0][0]
      resolve(record);
    });
  });
}

app.use(router.routes());

module.exports = app;
