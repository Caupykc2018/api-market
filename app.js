const express = require('express');
const app = express();
const passport = require('passport');
const { port } = require('./config');
const { sequelize } = require('./models');

const routes = require('./routes');

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
            console.log(err);
        }
    );

app.use(passport.initialize({}));
require("./config/passport")(passport);

app.use("/api", routes);

app.listen(port);
