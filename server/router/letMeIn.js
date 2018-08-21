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

//check a user's permission to enter a room, returns true or false
router.post('/letMeIn', async (ctx, next) => {
  console.log("lock ID--->", ctx.request.body.lockID);
  console.log("user ID--->", ctx.request.body.userID);
  const lock = await getLock(toString(ctx.request.body.lockID));
  const user = await getUser(ctx.request.body.userID);
  console.log("lock--->", lock);
  console.log("user--->", user);
  const permission = getPermission(lock, user);
  ctx.body = permission;
  await next();
});

router.get('/newTest', async (ctx, next) => {
  ctx.body = "Im here";
  await next();
});

//queries for lock given ID, returns lock
async function getLock(id) {
  return new Promise((resolve) => {
    const query = datastore
    .createQuery('lock')
    .filter('id','=', '3')
    datastore.runQuery(query).then(results => {
      const lock = results[0][0]
      resolve(lock);
    });
  });
}

//queires  for user given ID, returns user
async function getUser(id) {
  console.log("lock query id---> ", id);
  return new Promise((resolve) => {
    const query = datastore
    .createQuery('user')
    .filter('id','=', id)
    datastore.runQuery(query).then(results => {
      const user = results[0][0]
      resolve(user);
    });
  });
}

//checks user's permission to enter a room
function getPermission(lock, user){
  if (lock && user){
    if (_.contains(lock.permittedUsers, user.id) || _.intersection(lock.permittedGroups, user.groups).length > 0 && lock.masterLock != true){
      return true
    } else {
      return false
    }
  }
  return false
}

app.use(router.routes());

module.exports = app;
