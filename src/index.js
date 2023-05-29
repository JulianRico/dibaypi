const express= require('express');
const app = express();
const cors = require('cors'); 
// Settings
app.set('port', process.env.PORT || 3311);
/* var allowedOrigins = ['http://localhost:3000',
                      'https://vitapp-pro.herokuapp.com/']; */
// Middlewares
app.use(express.json());
app.use(cors(
    /* {
        origin: function(origin, callback){
          // allow requests with no origin 
          // (like mobile apps or curl requests)
          if(!origin) return callback(null, true);
          if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                      'allow access from the specified Origin.';
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        }
      } */

));
// Routes "urls"

app.use(require('../routes/employees'))
app.use(require('../routes/products'))
app.use(require('../routes/general'))
app.use(require('../routes/task'))
app.use(require('../routes/graph'))
app.use(require('../routes/queryReports'))
app.use(require('../routes/thread'))
app.use(require('../routes/areas'))
app.use(require('../routes/branch'))
app.use(require('../routes/inventories'))


// start server
const server =  app.listen(app.get('port'),()=>{
    console.log('servidor ' +app.get('port'))
})