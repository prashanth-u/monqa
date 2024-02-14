const chatProperties = require('../config/chat-properties');
var request=require('request');

var Event = null
if (chatProperties.events == true)
{
    Event = require('./events')
}


module.exports = app => {


app.get('/api/search/download/:unit/:filename', function(req, res){
  var file
  console.log(req.params.filename)
  console.log(req.params.filename.includes(".pdf"))

  if (req.params.filename.includes(".pdf"))
  {
    file = "../monqa/docsearch/files/"+req.params.unit + "/PDF/"+ req.params.filename;
  }
  else if(req.params.filename.includes(".ppt"))
  {
    file = "../monqa/docsearch/files/"+req.params.unit + "/ppt/"+ req.params.filename;
  }
  res.download(file); // Set disposition and send it.
});



app.get('/api/search/:unit/:question', async (req, res) => {

request.get('/doc_search/query/'+req.params.unit+"/"+req.params.question,function(err,result,body){
  
  if(err)
  {
    res.send("error")
  }
  if(res.statusCode === 200 ){
    try
    {
    res.send(JSON.parse(body))
    }
    catch(e)
      {
        res.send("error")
      }

  }
  
  });


});




    app.post('/api/events/nlpEvent', (req, res) => {
        var reviewCode = req.body.reviewCode
                if (chatProperties.events == true)
                {
      try
      {
        if(reviewCode == 1)
        {
                    Event.sendUserNLPEvent("Excellent", req.user.name, req.user.email, req.body.unit)
                            res.send("success")

        }
        else if(reviewCode == 2)
        {
                    Event.sendUserNLPEvent("Alright", req.user.name, req.user.email, req.body.unit)
                            res.send("success")
        }
        else
        {
                    Event.sendUserNLPEvent("Bad", req.user.name, req.user.email, req.body.unit)
                            res.send("success")
        }
      }
      catch(e)
      {
        res.send("failed")
      }
}
else
{
  res.send("event  disabled")
}

    })





}