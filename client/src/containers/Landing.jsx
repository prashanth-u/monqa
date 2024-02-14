import React, { useState, useEffect } from 'react';
import { Button, Container } from 'semantic-ui-react';

const opacityRange = [0.1, 0.4];
const animDuration = 1500;
const opacityStep = (opacityRange[1] - opacityRange[0]) / animDuration;
let multiplier = 1;

export default function Landing() {
    const [opacity, setOpacity] = useState(opacityRange[0]);

    const updateOpacity = () => {
        if (opacity < opacityRange[0] || opacity > opacityRange[1]) {
            multiplier = -1 * multiplier;
        }

        setOpacity(opacity + multiplier * opacityStep);
    };

    useEffect(() => {
        const timer = window.setInterval(updateOpacity, 1);
        return () => window.clearInterval(timer);
    });

    const handleLogin = () => window.location.href = '/auth/google/';

    return (
        <Container textAlign='center' style={{ height: '100vh', width: '100vw' }}>
            <p>
                <img 
                    alt='logo' 
                    src='/monqa_logo.jpeg' 
                    style={{ marginTop: '10vh', maxHeight: '50vh', maxWidth: '80vw', alignSelf: 'center', opacity }}
                />
            </p>
            <Button
                onClick={handleLogin}
                color="facebook"
                content='Sign in'
                style={{ zIndex: '1', position: 'relative' }}
            />
        </Container>
    );
}