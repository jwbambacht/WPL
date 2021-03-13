import * as proxy from 'http-proxy-middleware';
import * as express from 'express';

const proxyContexts = {
    react: {
        target: 'http://localhost:3000',
        //changeOrigin: true
    },
    api: {
        target: 'http://localhost:8080/CryptFolio',
        // changeOrigin: true
    },
};

const app = express();

app.use('/api', proxy(proxyContexts.api));
app.use(proxy('ws://localhost:3000'));
app.use(proxy(proxyContexts.react));

// Static content if needed
// app.use(express.static('build'));

app.listen(8080);
