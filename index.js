'use strict'
const express = require("express");
const app = express();

app.use('/static/', express.static('./static'));

let event_list = [];

app.post('/position', express.json(), (req, res) =>
{
  const _event = {
    x : req.body.x,
    y : req.body.y,
    isBegin : req.body.isBegin,
    timestamp : Date.now()
  }
  event_list.push(_event);
  res.end();
  
})

app.get('/list', async (req, res) =>
{
  const slice = event_list.slice(parseInt(req.query.start))
  res.json({start : parseInt(req.query.start), slice : slice});
  
  res.end();

})
app.get('/clear', async (req, res) =>
{
  event_list = [];

  res.end();
})
const server = app.listen(process.env.PORT || 80, (err) => {
  if (err)
    console.log(err);
})
