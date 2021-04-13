const helpers = {
    handleResponse: function (response) {
        return response.text().then((text) => {
            if (response.status == 404) {
                console.log('404 error');
                const error = response.statusText;
                return Promise.reject(error);
            }

            return text && JSON.parse(text);
        });
    },
    nDecimals: function (value, n, initial) {
        if (value == 0 && initial) {
            return 0;
        }

        var decimals = n;

        if (value < 0.001) {
            decimals = n + 4;
        } else if (value < 0.01) {
            decimals = n + 3;
        } else if (value < 0.1) {
            decimals = n + 2;
        } else if (value < 1) {
            decimals = n + 1;
        } else if (value < 1000) {
            decimals = n;
        } else if (value >= 1000) {
            decimals = 0;
        }

        var power = Math.pow(10, decimals);
        var val = Math.round(value * power) / power;

        if (val == 0) {
            return nDecimals(value, decimals + 1, false);
        }

        return val.toFixed(decimals);
    },
    objectWithoutKey: function (object, key) {
        const { [key]: deletedKey, ...otherKeys } = object;
        return otherKeys;
    },
};

export default helpers;
