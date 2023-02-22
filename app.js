const express = require('express');
require('dotenv').config();
const path = require("path")
const cors = require("cors")


const app = express();

app.set('build', path.join(__dirname, 'build'));

app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));

app.use(express.static(path.join(__dirname, 'build')));

app.use(cors());


// Routes setup
const UsersRouter = require('./routes/users');
const IndexRouter = require("./routes/index");

app.use('/auth',UsersRouter);
app.use("/",IndexRouter);

const PORT = process.env.PORT;

/** Server Port setup */
app.listen(PORT,(err)=>{
    if(err){
        throw err;
    } else {
        console.log(`Server running on port : ${PORT}`);
    }
});
