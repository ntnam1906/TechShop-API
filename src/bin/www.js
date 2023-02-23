const app = require('../apps/app');
const config = require('config');

app.listen(port = config.get('app.port'), ()=> {
    console.log(`App running in URL http://localhost:${port}`);
})