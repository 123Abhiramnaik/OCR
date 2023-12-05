//Imports 
console.log("Jai Shree Ram!!");
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path'
import routes from './controllers/routes.js';



const app = express();
dotenv.config({ path: ".env" });


//middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser('random'));
app.use(express.static(path.join(path.resolve(), 'static')));



app.use(routes);

let port = 8000;
app.listen(port, () => {
    console.log("connected to backend");
})