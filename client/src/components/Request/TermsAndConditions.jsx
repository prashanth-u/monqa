import React from 'react';
import { Modal } from 'semantic-ui-react';

const content = (
    <>
        <p>
            Please read the following before you request access to MonQA. By using 
            MonQA you agree to the following:
        </p>
        <h3>Data Collection</h3>
        <p>
            We reserve the right to collect the following information:
        </p>
        <ul>
            <li>
                Your Monash student email address that you use to log in to MonQA. This is how we
                mainly identify you on our system and ensure that you are a valid user.
            </li>
            <li>
                You name as provided by your Google Account. This is how administrators
                (tutors) and other users identify you while using MonQA.
            </li>
            <li>
                The units you are enrolled in, i.e. ETC/ETF5900. This is needed so that we know what
                posts to show you, what chat rooms you can join, what documents you
                have access to, etc.
            </li>
            <li>
                Posts, messages, reviews and any other data you provide to MonQA
                during your use
            </li>
        </ul>
        <p>
            If we choose to collect any personal information, we will only proceed once
            you have given clear consent. We will also make sure to inform you
            beforehand and outline what information we aim to collect. If you have a
            change of mind and wish for the collected information to be removed, please
            contact us.
        </p>
        <h3>Accuracy of Information</h3>
        <p>
            The developers are not responsible for any innacurate infromation
            provided during your use of this platform through posts, FAQs, messages,
            etc. By using MonQA you understand that you may encounter information that
            is irrelevant, incomplete, innacurate or contain errors. 
        </p>
        <h3>Acceptable Use</h3>
        <p>
            Please be kind and respectful to others while using MonQA. We reserve the 
            right to remove your access to MonQA in any of the following
            circumstances:
        </p>
        <ul>
            <li>
                If you are found to be acting in a way that is harmful,
                abusive or threatening. 
            </li>
            <li>
                If you are found to be acting illegally or unlawfully in any way.
            </li>
            <li>
                If you are found to have undertaken any action that causes harm to
                our platform in terms of performance, reliability or accessibility.
            </li>
        </ul>
        <h3>Availability</h3>
        <p>
            We reserve the right to temporarily or permanently shutdown or remove all
            access to MonQA for any reason. This includes, but is not limited to:
            updates, fixes, concerns with current/future use, etc.
        </p>
        <h3>Anonymity</h3>
        <p>
            Certain parts of MonQA can be used with a level of anonymity. However, be aware 
            that you are only anonymous to other students and non administrators. Administrators
            (tutors) and developers, reserve the right to identify you with the
            information you have provided. This is to ensure that users who violate any
            of these rules are identified and can be properly dealt with.
        </p>
    </>
);

export default function TermsAndConditions() {
    return (
       <Modal trigger={<a href='#0'>terms and conditions</a>} closeIcon centered={false}>
           <Modal.Header>Terms and Conditions</Modal.Header>
           <Modal.Content>
               { content }
           </Modal.Content>
       </Modal> 
    )
}