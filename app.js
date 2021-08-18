import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import {Splash} from './handlers/Splash.js';

dotenv.config();

const app = express();
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


const SplashClass = new Splash();
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
    SplashClass.getImages()
});