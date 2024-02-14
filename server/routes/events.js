const chatProperties = require('../config/chat-properties');


var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: chatProperties.elasticSearchUrl,
  // log: 'trace'// use the same version of your Elasticsearch instance
});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.log('elasticsearch cluster is down!');
  } else {
    console.log('elasticsearch is running');
  }
});



module.exports = {
	sendUserLoginEvent : async function (user)
	{
    var date = new Date()
    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const response = await client.index({
  			index: 'monqa-prod-latest',
  			type: 'user_login',
  			body: {
  				event_name: 'user_login',
    			username: user.email,
    			timestamp: date,
          day: day[date.getDay()],
    			name: user.name,
    			units: user.units
  			}
		});	
	},
	sendUserChatEvent : async function (chat,unit)
	{
    var date = new Date()
    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		const response = await client.index({
  			index: 'monqa-prod-latest',
  			type: 'chat',
  			body: {

  				event_name: 'chat',
    			username: chat.userName,
    			timestamp: date,
          day: day[date.getDay()],
    			name: chat.displayName,
    			units: unit
  			}
		});	
	},
  sendUserPostEvent : async function (post, name, email)
  {
        var date = new Date()
    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const response = await client.index({
        index: 'monqa-prod-latest',
        type: 'post',
        body: {
          event_name: 'post',
          name: name,
          username: email,
          timestamp: date,
          day: day[date.getDay()],
          units: post.unit
        }
    }); 
  },
  sendUserReplyEvent : async function (name, email)
  {
    var date = new Date()
    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const response = await client.index({
        index: 'monqa-prod-latest',
        type: 'reply',
        body: {
          event_name: 'reply',
          name: name,
          username: email,
          timestamp: date,
          day: day[date.getDay()],
          arrange: date.getDay() 
        }
    }); 
  },

  sendUserNLPEvent: async function (code, name, email, unit)
  {
    var date = new Date()
    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const response = await client.index({
        index: 'monqa-prod-latest',
        type: 'reply',
        body: {
          event_name: 'review',
          name: name,
          username: email,
          timestamp: date,
          day: day[date.getDay()],
          review: code,
          units: unit
        }
    }); 
  },

  sendReviewEvent: async function (requestObj)
  {
    var date = new Date()
    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    var response = await client.index({
        index: 'monqa-prod-latest',
        type: 'countReview',
        body: {
          event_name: 'countReview',
          timestamp: date,
          day: day[date.getDay()],
        }
    }); 

    for(i=0;i<5;i++)
    {
    var response = await client.index({
        index: 'monqa-prod-latest',
        type: 'reviewSoftware',
        body: {
          event_name: 'softwareReview',
          timestamp: date,
          day: day[date.getDay()],
          question: eval("requestObj.q"+(i+1)),
          rating: parseInt(eval("requestObj.q"+(i+1)+"Rating"))
        }
    });     

  }

  }

}





