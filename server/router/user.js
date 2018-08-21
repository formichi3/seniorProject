const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
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

//get all users
router.get('/users/', async (ctx, next) => {
  var users = await new Promise((resolve) => {
    const query = datastore
    .createQuery('user')
    datastore.runQuery(query).then(results => {
      const users = results[0]
      resolve(users);
    });
  });
  console.log('users: ', users);
  ctx.body = users
  await next();
});

//get a specific user
router.get('/users/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const result = await getUser(id);
  if (!result) {
    ctx.body = {
      "error": "no such user"
    }
  }
  else {
    ctx.body = result;
  }
});

router.get('/test/', async (ctx, next) => {
  const method = ctx.query.method;
  const id = parseInt(ctx.query.value);
  console.log("method, id --->", method, id);
  const user = await getNFCUser(method, id);

  if (!user) {
    ctx.body = {
      "error": "no such user"
    }
  }
  else {
    ctx.body = user;
  }
});

//create new user
router.post('/users/', async (ctx, next) => {
  const ID = ctx.request.body.ID;
  const groups = ctx.request.body.groups
  const cruzID = ctx.request.body.cruzID
  const NFCID = ctx.request.body.NFCID
  const RFID = ctx.request.body.RFID
  const keypadID = ctx.request.body.keypadID
  const name = ctx.request.body.name

  const userExists = await getUser(ID);
  if (userExists) {
    ctx.body = {
      "Error": "User already exists"
    }
  } else {
    const kind = "user"
    const userKey = datastore.key([kind, ID])
    const user = {
      key: userKey,
      data: {
        ID: ID,
        groups: groups,
        cruzID: cruzID,
        NFCID: NFCID,
        RFID: RFID,
        keypadID: keypadID,
        name: name
      }
    };
    datastore
    .save(user)
    .then(() => {
      ctx.body = {
        "msg": "success"
      }
      console.log(`Saved ${user.data.ID}`);
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

//create new user
router.post('/users/update', async (ctx, next) => {
  const ID = ctx.request.body.ID;
  const groups = ctx.request.body.groups
  const cruzID = ctx.request.body.cruzID
  const NFCID = ctx.request.body.NFCID
  const RFID = ctx.request.body.RFID
  const keypadID = ctx.request.body.keypadID
  const name = ctx.request.body.name

  const userExists = await getUser(ID);
  if (!userExists) {
    ctx.body = {
      "Error": "User does not exist"
    }
  } else {
    const kind = "user"
    const userKey = datastore.key([kind, ID])
    const user = {
      key: userKey,
      data: {
        ID: ID,
        groups: groups,
        cruzID: cruzID,
        NFCID: NFCID,
        RFID: RFID,
        keypadID: keypadID,
        name: name
      }
    };
    datastore
    .update(user)
    .then(() => {
      ctx.body = {
        "msg": "success"
      }
      console.log(`Saved ${user.data.ID}`);
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


router.delete('/users/:id', async (ctx, next) => {
  const id = parseInt(ctx.params.id);
  const user = await getUser(id);
  if (user){
    console.log("deleting user ", user);
    const kind = 'user'
    const userKey = datastore.key(['user', id]);
    datastore
    .delete(userKey)
    .then(() => {
      console.log("userKey deleted");
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
      userIdRemoved: id
    }
  }
  else {
    ctx.body = {
      result: "error",
      msg: "user did not exist"
    }
  }
  await next();
});


async function getUser(id) {
  return new Promise((resolve) => {
    const query = datastore
    .createQuery('user')
    .filter('ID','=',parseInt(id))
    datastore.runQuery(query).then(results => {
      const user = results[0][0]
      resolve(user);
    });
  });
}

async function getNFCUser(method, id) {
  return new Promise((resolve) => {
    const query = datastore
    .createQuery('user')
    .filter(method,'=',parseInt(id))
    datastore.runQuery(query).then(results => {
      const user = results[0][0]
      resolve(user);
    });
  });
}



app.use(router.routes());

module.exports = app;
