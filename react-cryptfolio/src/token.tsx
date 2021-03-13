import { useState } from 'react';

export default function Token() {
    function getToken() {
        const obj = localStorage.getItem('user');
        return obj !== null ? JSON.parse(obj) : null;
    }

    function removeToken() {
        localStorage.clear();
        setToken('');
    }

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: string) => {
        localStorage.setItem('user', JSON.stringify(userToken));
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token,
    };
}
