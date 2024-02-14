const request_as_promised = require('request-promise');

const azure = require('../config/azure');
const Queue = require('./Queue');

var queue = new Queue();

const getKnowledgebases = async function() {
    const reqeust = {
        uri: azure.managementHost + '/knowledgebases',
        headers: { 'Ocp-Apim-Subscription-Key': azure.subscriptionKey }
    };
    var response = await request_as_promised.get(reqeust);
    response = JSON.parse(response);
    return response.knowledgebases;
}

const downloadKnowledgebase = async function(kbId) {
    const request = {
        uri: `${azure.managementHost}/knowledgebases/${kbId}/Test/qna`,
        headers: { 'Ocp-Apim-Subscription-Key': azure.subscriptionKey }
    };
    var response = await request_as_promised.get(request);
    response = JSON.parse(response);
    return response.qnaDocuments;
}

// Returns null if knowledgebase does not exist
const getKnowledgebaseId = async function(name) {
    var kbInfos = await getKnowledgebases()
    kbInfos = kbInfos.filter(kbInfo => kbInfo.name == name)
    if (kbInfos.length == 0) return null;
    return kbInfos[0].id;
}

const publishKb = async function(kbId) {    
    const request = {
        uri: `${azure.managementHost}/knowledgebases/${kbId}`,
        headers: {
            'Ocp-Apim-Subscription-Key': azure.subscriptionKey
        }
    };
    await request_as_promised.post(request);
}

// EXPORTS

// Add qna to qnamaker. Assumes knowledgebase already exists.
const addQna = async function(kbName, postId, qna) {
    const sendReq = async function(id) {
        const content = JSON.stringify({
            add: { qnaList: [{
                id: 0,
                questions: [ qna.question ],
                answer: qna.answer,
                metadata: [{ 
                    name: 'postid', 
                    value: postId 
                }]
            }]}
        });
        
        const request = {
            uri: `${azure.managementHost}/knowledgebases/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': azure.subscriptionKey
            },
            body: content
        };
    
        queue.addFn(async function() {
            await request_as_promised.patch(request);
        });
        
        queue.addFn(async function() {
            await publishKb(id);
        });
    }

    var kbId = await getKnowledgebaseId(kbName);

    if (kbId) return sendReq(kbId);

    queue.addFn(async function() {
        kbId = await getKnowledgebaseId(kbName);
        sendReq(kbId);
    });
}

const removeQna = async function(kbName, postId) {
    var kbId = await getKnowledgebaseId(kbName);
    var kb = await downloadKnowledgebase(kbId);

    var ids = [];
    for (var q of kb) {
        for (var m of q.metadata) {
            if (m.name === 'postid' && m.value == postId) {
                ids.push(q.id);
            }
        }
    }

    const content = JSON.stringify({ delete: { ids } });
    
    const request = {
        uri: `${azure.managementHost}/knowledgebases/${kbId}`,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': azure.subscriptionKey
        },
        body: content
    };

    queue.addFn(async function() {
        await request_as_promised.patch(request);
    })
    
    queue.addFn(async function() {
        await publishKb(kbId);
    })
}

// Returns id of updated qna
const updateQna = async function(kbName, postId, qna) {
    await removeQna(kbName, postId);
    await addQna(kbName, postId, qna);
}

// Ask a question to the QNA service
const getAnswer = async function(kbName, question) {
    var kbId = await getKnowledgebaseId(kbName);

    const request = {
        uri: `${azure.host}/knowledgebases/${kbId}/generateAnswer`,
        method: 'POST',
        headers: {
            'Authorization': "EndpointKey " + azure.endpointKey
        },
        json: true,
        body: { question, top: 3 }
    };

    return await request_as_promised.post(request);
}

module.exports = {
    addQna,
    removeQna,
    updateQna,
    getAnswer
}