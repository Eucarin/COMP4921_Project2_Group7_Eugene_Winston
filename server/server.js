require('dotenv').config();
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const MongoStore = require('connect-mongo')

// Password hashing
const bcrypt = require('bcrypt');
const saltRounds = 12;

const port = process.env.PORT || 9000;
const expireTime = 60*60*1000

// Database Connections
const database = require('./database/databaseConnection');
const db_utils = require('./database/db_utils');
const db_queries = require('./database/queries');
const success = db_utils.printMySQLVersion();

const app = express();
app.use(cors(
    {
        origin: ["＊"],
        methods: ["POST", "GET"],
        credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

/* secret information section */
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

// MongoDB (Session Storage)
var mongoStore = MongoStore.create({
	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.dyx5jlr.mongodb.net/?retryWrites=true&w=majority`,
	crypto: {
		secret: mongodb_session_secret
	}
});

app.use(session({
    secret: node_session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: expireTime
    }
}))

app.get('/', (req, res) => {
    return res.json({message: "THIS IS THE / GET"});
})

app.post('/createAccount', async (req, res) => {
  // TODO: Make username unique, say username already exists, display error message on signup page
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  let errorMessage;

  if(password.length < 10) {
    errorMessage = "Password must be at least 10 characters long."
  } else if(!password.match(/[A-Z]/)) {
    errorMessage = "Password must contain a capital letter."
  } else if(!password.match(/[a-z]/)) {
    errorMessage = "Password must contain a lowercase letter."
  } else if(!password.match(/[!-*]/)) {
    errorMessage = "Password must contain a symbol (!, \", #, $, %, &, \', (, ), *)"
  }
  console.log(errorMessage);

  if(errorMessage) {
    // Give page error message
    return res.json({
      "success": false,
      "errorMessage": errorMessage,
    });
  } else {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    var success = await db_queries.createUser({username: username, email: email, hashedPassword: hashedPassword})

    if(success) {
        return res.json({"success": true})
    } else {
        return res.json({"success": false, "errorMessage": "Failed to create account, contanct admins."})
    }
  }
})

app.post('/login', async function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    var results = await db_queries.getUser({user:username});
    if (results) {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
        if(results.length == 1) {
            if (bcrypt.compareSync(password, results[0].hashed_password)) {
                req.session.authenticated = true;
                req.session.username = username;
                req.session.cookie.maxAge = expireTime;
                req.session.user_type = results[0].type;
                req.session.user_id = results[0].user_id;
                return res.json({"success": true});
            } else {
                var userMsg = "Invalid login credentials."
                return res.json({"success": false, "errorMessage": userMsg});
            }
        } else {
            //user and password combination not found
            console.log('Invalid number of users found: ' + results.length);
            var userMsg = "Invalid login credentials."
            res.send({"success": false, "errorMessage": userMsg});
        }
    } else {
        var userMsg = "Invalid login credentials."
        res.send({"success": false, "errorMessage": userMsg});
    }
});

app.post('/startSession', (req, res) => {
    const username = "WONTON";
    req.session.username = username;

    return res.json({session: true})
})

app.get('/checkSession', (req, res) => {
    console.log(req.session);
    if(req.session.username) {
        return res.json({valid: true, session: req.session})
    } else {
        return res.json({valid: false})
    }
})

app.listen(port, () => {
    console.log("Listening on port " + port);
})