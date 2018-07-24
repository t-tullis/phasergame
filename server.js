const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const server = app.listen(process.env.PORT || 8080, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.use("/public", express.static(__dirname + "/public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

