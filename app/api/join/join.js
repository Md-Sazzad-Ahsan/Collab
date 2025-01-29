'use strict';

async function getJoin() {
    try {
        // Use dynamic import with await
        const { default: fetch } = await import('node-fetch');

        const API_KEY_SECRET = 'collab_default_secret';
        const COLLAB_URL = 'https://sfu.collab.com/api/v1/join';
        //const COLLAB_URL = 'http://localhost:3010/api/v1/join';

        const response = await fetch(COLLAB_URL, {
            method: 'POST',
            headers: {
                authorization: API_KEY_SECRET,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room: 'test',
                roomPassword: false,
                name: 'collab',
                audio: true,
                video: true,
                screen: true,
                hide: false,
                notify: true,
                duration: 'unlimited',
                token: {
                    username: 'username',
                    password: 'password',
                    presenter: true,
                    expire: '1h',
                },
            }),
        });
        const data = await response.json();
        if (data.error) {
            console.log('Error:', data.error);
        } else {
            console.log('join:', data.join);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getJoin();
