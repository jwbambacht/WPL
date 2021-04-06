// import config from 'config';
// import { authHeader } from '../utils/helper';

const userservice = {
    login: function (username: string, password: string) {
        fetch('/CryptFolio/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then(handleResponse)
            .then((token) => {
                if (token) {
                    localStorage.setItem('token', token);
                    console.log('Succesfull logged in');
                }

                return;
            })
            .catch(function (err) {
                console.log(err);
            });

        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ username, password })
        // };

        // return fetch('/CryptFolio/auth',
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //        }
        //     )
        //     .then(handleResponse)
        //     .then(user => {
        //         // login successful if there's a user in the response
        //         if (user) {
        //             // store user details and basic auth credentials in local storage
        //             // to keep user logged in between page refreshes
        //             user.authdata = window.btoa(username + ':' + password);
        //             localStorage.setItem('user', JSON.stringify(user));
        //         }

        //         return user;
        //     });
    },
    logout: function () {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
    },
};

function handleResponse(response: Response) {
    return response.text().then((text) => {
        console.log(response);
        if (!response.ok) {
            if (response.status == 404) {
                userservice.logout();
                console.log('404 ERRRRRRROR');
            }

            const error = response.statusText;
            return Promise.reject(error);
        }

        const data = text && JSON.parse(text);

        if (data.status === 401) {
            userservice.logout();
            console.log('401 ERRRRRRROR');
            // location.reload(true);

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        console.log(data);

        return data.result;
    });
}

export default userservice;
