const chatProperties = require('../config/chat-properties');
const Review = require('../models/Review');
if (chatProperties.events == true)
{
    Event = require('./events')
}

module.exports = app => {


    app.post('/api/review', async (req, res) => {

        if(chatProperties.review == true)
        {
            Review.find({userId : req.user.id}, function (err, docs) {
                if (docs.length){
                    res.send('Forbidden Request');
                }else{
                    const newReview = new Review({
                        userId: req.user.id,
                        timeStamp: Date.now()
                    });
                    newReview.save();
                    if (chatProperties.events == true)
                    {
                        Event.sendReviewEvent(req.query)
                    }
                    res.send("Success")
                }
            });

        }
        else
        {
            res.status(403);
            res.send('Forbidden Request');
        }
    });

}
