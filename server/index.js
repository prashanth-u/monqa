const mongoose = require('mongoose');
const cors = require('cors')
const ejs = require('ejs')

const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser  = require('cookie-parser')

const keys = require('./config/keys');

require('./services/passport-google-auth');

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
}

var express = require('express'), 
    app = express(), 
    server = require('http').createServer(app)

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(allowCrossDomain);

app.use(cookieParser());
app.engine("html", ejs.renderFile);
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())

io = require('socket.io')(
    server, 
    { 
        origins: '*:*',
        wsEngine: 'ws', 
        serveClient: true, 
        pingTimeout: 60000, 
        upgradeTimeout: 30000
    }
);

require('./routes/auth')(app);
require('./routes/posts')(app);
require('./routes/reply')(app);
require('./routes/user')(app);
require('./routes/unit')(app);
require('./routes/chat')(app);
require('./routes/search')(app);
require('./routes/files')(app);
require('./routes/review')(app);

server.listen(8080);
