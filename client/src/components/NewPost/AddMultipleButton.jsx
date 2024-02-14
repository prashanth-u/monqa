import React, { useRef } from "react";
import Papa from 'papaparse';
import { Button, Modal, Grid } from "semantic-ui-react";

import { POST_TYPES } from "../../constants";

function formatLine(line) {
    const post = {
        unit: line[0],
        category: line[1],
        title: line[2],
    };
    if (line.length >= 4 && line[3] !== "") post.body = line[3];
    if (line.length >= 5 && line[4] !== "") post.tags = line[4].split(', ');
    return post
}

function parseFile(e, callback) {
    const filePath = e.target.files[0];

    const performCallback = function(result) {
        const data = result.data
            .filter(line => line.length >= 3)
            .map(formatLine);
        callback(data);
    }
    
    Papa.parse(filePath, { 
        header: false, 
        download: true, 
        skipEmptyLines: true, 
        complete: performCallback
    });
}

// TODO: Show how csvs should be formatted

export default function AddMultipleButton({ onClick }) {
    const fileInputRef = useRef(null);

    return (
        <>
            <Button.Group size='mini'>
                <Button
                    icon='plus'
                    content='Add from CSV'
                    onClick={() => fileInputRef.current.click()}
                />
                <Modal trigger={<Button icon='question' active/>} closeIcon centered={false}>
                    <Modal.Header>How to add posts from file</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <p>
                                Files must be CSV and each line must be formatted as described:
                            </p>
                            <ul>
                                <li>
                                    First column: Unit code. Unit codes are case sensitive so <b>AAA0000</b> is different to <b>aaa0000</b>
                                </li>
                                <li>
                                    Second column: Category. Must be one of the following values (also case sensitive): 
                                    <ul>
                                        { Object.values(POST_TYPES).map((type, index) => (
                                            <li key={index}>{type}</li>
                                        )) }
                                    </ul>
                                </li>
                                <li>
                                    Third column: Title of the post (Question for FAQ)
                                </li>
                                <li>
                                    (Only for FAQs) Fourth column: Answer to FAQ
                                </li>
                            </ul>
                            <p>
                                The following are optional values:
                            </p>
                            <ul>
                                <li>
                                    (For Post/Announcements) Fourth column: Body of the post
                                </li>
                                <li>
                                    Fifth column: Tags seperated by comma
                                </li>
                            </ul>
                            <p>
                                For example:
                            </p>
                            <Grid celled columns='equal' stackable>
                                <Grid.Row>
                                    <Grid.Column>AAA0000</Grid.Column>
                                    <Grid.Column>Post</Grid.Column>
                                    <Grid.Column>Assignment 1 Due date</Grid.Column>
                                    <Grid.Column>Due on 01/01/2020</Grid.Column>
                                    <Grid.Column>Assignment, Assessments</Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <p>
                                This will create a <b>Post</b> for unit: <b>AAA0000</b> with title: &nbsp;
                                <b>Assignment 1 Due date</b>, body: <b>Due on 01/01/2020</b> and tags: &nbsp;
                                <b>Assignment</b> and <b>Assessments</b>
                            </p>
                            <p>
                                After selecting a file you will be presented with forms to confirm values &nbsp;
                                before posting
                            </p>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </Button.Group>
            <input
                hidden
                type="file"
                ref={fileInputRef}
                onChange={e => parseFile(e, onClick)}
            />
        </>
    )
}