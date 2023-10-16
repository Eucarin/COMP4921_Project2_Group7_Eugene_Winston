require('dotenv').config();
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const MongoStore = require('connect-mongo')

const port = process.env.PORT || 9000;
const expireTime = 60*60*1000

const app = express();
app.use(cors(
    {
        origin: ["http://localhost:3000"],
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

app.post('/startSession', (req, res) => {
    const username = "WONTON";
    req.session.username = username;

    return res.json({Session: true})
})

app.get('/checkSession', (req, res) => {
    console.log(req.session);
    if(req.session.username) {
        return res.json({valid: true, username: req.session.username})
    } else {
        return res.json({valid: false})
    }
})

app.listen(port, () => {
    console.log("Listening on port " + port);
})