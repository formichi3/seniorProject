const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const app = new Koa();
const moment = require('moment');
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

//get all locks
router.get('/locks/', async (ctx, next) => {
  var locks = await new Promise((resolve) => {
    const query = datastore
    .createQuery('lock')
    datastore.runQuery(query).then(results => {
      const locks = results[0]
      resolve(locks);
    });
  });
  console.log('Locks: ', locks);
  ctx.body = locks
  await next();
});

//get a specific lock
router.get('/locks/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const result = await getLock(id);
  if (!result) {
    ctx.body = {
      "error": "no such lock"
    }
  }
  else {
    ctx.body = result;
  }
});

//create new lock
router.post('/locks/', async (ctx, next) => {
  const ID = ctx.request.body.ID;
  const status = ctx.request.body.status
  const battery = ctx.request.body.battery
  const permittedUsers = ctx.request.body.permittedUsers
  const permittedGroups = ctx.request.body.permittedGroups
  const exp_date = moment().format()
  const maxOccupancy = ctx.request.body.maxOccupancy

  const lockExists = await getLock(ID);
  if (lockExists) {
    ctx.body = {
      "Error": "Lock already exists"
    }
  } else {
    const kind = "lock"
    const lockKey = datastore.key([kind, ID])
    const lock = {
      key: lockKey,
      data: {
        ID: ID,
        status: status,
        battery: battery,
        permittedUsers: permittedUsers,
        permittedGroups: permittedGroups,
        exp_date: exp_date,
        maxOccupancy: maxOccupancy
      }
    };
    datastore
    .save(lock)
    .then(() => {
      ctx.body = {
        "msg": "success"
      }
      console.log(`Saved ${lock.data.ID}`);
    })
    .catch(err => {
      ctx.body = {
        "msg": "failure"
      }
      console.error('ERROR:', err);
    });
  }
  ctx.body = {
    "msg": "success"
  }
  await next();
});


//update lock
router.post('/locks/update', async (ctx, next) => {
  const ID = ctx.request.body.ID;
  const status = ctx.request.body.status
  const battery = ctx.request.body.battery
  const permittedUsers = ctx.request.body.permittedUsers
  const permittedGroups = ctx.request.body.permittedGroups
  const exp_date = moment().format()
  const maxOccupancy = ctx.request.body.maxOccupancy

  const lockExists = await getLock(ID);
  if (!lockExists) {
    ctx.body = {
      "Error": "Lock does not exist, create a new lock first"
    }
  } else {
    const kind = "lock"
    const lockKey = datastore.key([kind, ID])
    const lock = {
      key: lockKey,
      data: {
        ID: ID,
        status: status,
        battery: battery,
        permittedUsers: permittedUsers,
        permittedGroups: permittedGroups,
        exp_date: exp_date,
        maxOccupancy: maxOccupancy
      }
    };
    datastore
    .update(lock)
    .then(() => {
      ctx.body = {
        "msg": "sucess"
      }
      console.log(`Saved ${lock.data.ID}`);
    })
    .catch(err => {
      ctx.body = {
        "msg": "failure"
      }
      console.error('ERROR:', err);
    });
  }
  ctx.body = {
    "msg": "success"
  }
  await next();
});


//delete a lock by ID
router.delete('/locks/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const lock = await getLock(id);
  if (lock){
    console.log("deleting lock ", lock.id);
    const kind = 'lock'
    const lockKey = datastore.key([kind, id]);
    datastore.delete(lockKey).then(() => {
      console.log("lock deleted");
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
      lockIdRemoved: id
    }
  }
  else {
    ctx.body = {
      result: "error",
      msg: "lock did not exist"
    }
  }
  ctx.body = {
    "msg": "success"
  }
  await next();
});


async function getLock(id) {
  return new Promise((resolve) => {
    const query = datastore
    .createQuery('lock')
    .filter('ID','=',id)
    datastore.runQuery(query).then(results => {
      const lock = results[0][0]
      resolve(lock);
    });
  });
}



app.use(router.routes());

module.exports = app;
