
import router from './routers';
import config from './utils/config';

import cors from 'cors';

const express = require("express");
const path = require('path');

const PORT = config.serverPort || 3001;

const app = express();

if (config.environment === 'development') {
    app.use(cors({ origin: 'http://localhost:3000' }));
}

app.use(router);

if (config.environment === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
