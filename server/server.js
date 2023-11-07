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
        origin: ["http://localhost:3000", "http://wljckbedyx.us19.qoddiapp.com"],
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

app.use('/createPost', sessionValidation);

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
    if(req.session.username) {
        return res.json({valid: true, session: req.session})
    } else {
        return res.json({valid: false})
    }
})

app.post('/createPost', async (req, res) => {
    // if(req.session.authenticated === true) {

    // }
    const title = req.body.title;
    const content = req.body.content;
    var success = await db_queries.createPost({title: title, content: content, user_id: req.session.user_id})

    if(success) {
        return res.json({success: true})
    } else {
        return res.json({success: false, errorMessage: "Failed to create post, please contanct admins for further details."})
    }
})

app.post('/createComment', async (req, res) => {
    if(req.session.authenticated === false) {
        return res.json({success: false, errorMessage: "Please sign in to comment on posts."})
    }
    const content = req.body.content;
    const post_id = req.body.post_id;
    const parent_comment_id = req.body.parent_comment_id;
    var success = await db_queries.createComment({content: content, user_id: req.session.user_id, post_id: post_id, parent_comment_id: parent_comment_id})

    if(success) {
        return res.json({success: true})
    } else {
        return res.json({success: false, errorMessage: "Failed to create comment, please contanct admins for further details."})
    }
})

app.post('/replyComment', async (req, res) => {
    // if(req.session.authenticated === true) {

    // }
    const content = req.body.content;
    const post_id = req.body.post_id;
    const parent_comment_id = req.body.parent_comment_id;
    var success = await db_queries.createComment({content: content, user_id: req.session.user_id, post_id: post_id, parent_comment_id: parent_comment_id})

    if(success) {
        return res.json({success: true})
    } else {
        return res.json({success: false, errorMessage: "Failed to create reply to comment, please contanct admins for further details."})
    }
})

app.post('/commentReplies', async (req, res) => {
    const post_id = req.body.post_id;
    const final_dest = req.body.final_dest;

    const results = await db_queries.getRecursiveReplies({post_id: post_id, final_dest: final_dest})
    if(results) {
        res.send({success: true, results: results});
    } else {
        res.send({success: false});
    }
})

app.get('/getComment/:comment_id', async (req, res) => {
    const comment_id = req.params.comment_id;
    const results = await db_queries.getComment({comment_id: comment_id})
    if(results) {
        res.send({success: true, results: results});
    } else {
        res.send({success: false});
    }
})

app.get('/allComments/:post_id', async (req, res) => {
    const post_id = req.params.post_id;
    const results = await db_queries.getAllComments({post_id: post_id})
    if(results) {
        res.send({success: true, results: results});
    } else {
        res.send({success: false});
    }
})

app.get('/allPosts', async (req, res) => {
    const results = await db_queries.getAllPost();
    if(results) {
        res.send({success: true, results: results});
    } else {
        res.send({success: false});
    }
})

app.get('/postUrl/:url', async (req, res) => {
    const results = await db_queries.getPostWithURL({url: req.params.url});
    if(results) {
        res.send({success: true, results: results});
    } else {
        res.send({success:false});
    }
})

function isValidSession(req) {
	if (req.session.authenticated) {
		return true;
	}
	return false;
}

function sessionValidation(req, res, next) {
	if (!isValidSession(req)) {
		req.session.destroy();
		return res.json({valid: false, destoryed: true});
	}
	else {
		next();
	}
}

app.listen(port, () => {
    console.log("Listening on port " + port);
})