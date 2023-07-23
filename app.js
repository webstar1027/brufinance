const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 6666;


app.use(cors());
app.use(express.static(path.join(__dirname + '/dist/brufinancev2')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/download', function (req, res) {
  const file = `${__dirname}/apk/brufinance.apk`;
  res.download(file); // Set disposition and send it.
});

app.get('*', function (request, response) {
  response.sendFile(path.join(__dirname, 'dist/brufinancev2/index.html'));
});
app.listen(port, () => {
  console.log('Server started on port ' + port);
});