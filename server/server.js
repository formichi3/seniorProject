// require packages
const Koa = require('koa');
const cors = require('koa-cors');
const router = require('koa-router')();
const mount = require('koa-mount');
const bodyParser = require('koa-body-parser');

// create an instance of the Koa object
const app = new Koa();
// mount the route
app.use(cors());

app.use(mount(require('./router/letMeIn.js')));
app.use(mount(require('./router/lock.js')));
app.use(mount(require('./router/user.js')));
app.use(mount(require('./router/record.js')));

app.use(bodyParser());

app.use(router.routes()); // route middleware

app.listen(process.env.PORT || 8080);

//app key
//AIzaSyBCX1XgRbgS5rzu6JI9HSsz-zug1_cGEME
