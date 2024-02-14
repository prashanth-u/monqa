import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Loader, Message, Grid, Card, Divider, Header } from "semantic-ui-react";

export default function({ question, unit }) {
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState(null);

    // TODO: remove error?

    useEffect(() => {
        setLoading('Searching FAQs');
        setError(null);
        setAnswers(null);

        const request = { question, unit };
        axios.post('/api/qnamaker/answer', request)
            .then(res => {
                setLoading(null);
                setAnswers(res.data.length !== 0 ? res.data : null);
            })
            .catch(err => {
                setLoading(null);
                setError(err.message);
            });
    }, [question, unit])

    if (loading) return (  
        <Loader 
            active 
            inline='centered' 
            content={loading}
            style={{ marginTop: "5rem" }}
        />
    )

    if (error) return (
        <Message negative>
            <Message.Header>{ error }</Message.Header>
        </Message>
    )

    if (!answers) return null;

    return (
        <div style={{ margin: '0 2rem' }}>
            <Divider horizontal>
                <Header 
                    as='h3' 
                    textAlign='center' 
                    content='FAQs'
                />
            </Divider>
            <Grid 
                stackable 
                columns='equal'
            >
                { answers.map((a, index) => (
                    <Grid.Column>
                        <Card 
                            key={index} 
                            fluid 
                            size='mini'
                            header={a.question} 
                            description={a.answer}
                        />
                    </Grid.Column>
                )) }
            </Grid>
        </div>
    );
}