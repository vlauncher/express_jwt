const express = require('express');
require('dotenv').config();
const cors = require("cors")


const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));

app.use(cors());


// Routes setup
const UsersRouter = require('./routes/users');

app.use('/auth',UsersRouter);

const PORT = process.env.PORT;

/** Server Port setup */
app.listen(PORT,(err)=>{
    if(err){
        throw err;
    } else {
        console.log(`Server running on port : ${PORT}`);
    }
});
