// Import from NPM
// -------------------------------------
import axios from "axios";
import _ from "lodash";
import localforage from "localforage";

class Request {
    static assetHelpers = {
        fileSystem: null,
        zip: null
    };

    static setDefaults() {
        axios.defaults.baseURL = "http://localhost:3000";
        axios.defaults.timeout = 120000; // This is optimal for all API requests
        axios.defaults.maxRedirects = 5;
        axios.defaults.transformRequest = [
            function(data, headers) {
                // If the POST|PUT|PATCH call data is not stringified, the stringyfy them. If it is formdata, send it as it is.
                if (data) {
                    let formData = data;
                    let isStringified = _.isString(formData);
                    // If data is not strigified and not of type formdata, then stringify before sending.
                    let isFormData =
                        formData.toString().indexOf("FormData") > -1;
                    if (data && !isStringified && !isFormData) {
                        data = JSON.stringify(data);
                    }
                    // If you sending data in body, the header has to be type application/json
                    if (!isFormData) {
                        headers.post["Content-Type"] = "application/json";
                    }
                }
                return data;
            }
        ];
        return Promise.resolve(0);
    }
    // This is to handle refresh or app close conditions, where headers of axios are reseted.
    static checkAndSetTokenForRequest() {
        // Check whether axios headers contains access token, if present then that what we wanted to do.
        if (!axios.defaults.headers.common["access-token"]) {
            return this.getTokenHeadersFromLocalStore().then(tokenHash => {
                return this.setTokenForNextRequestFromLocalStore(tokenHash);
            });
        } else {
            // Token already Present
            return Promise.resolve(0);
        }
    }

    static fetch(path, data, domain = this.apiUrl) {
        let methodData = _.merge({}, data, { url: path });
        // Fetch JS backward Compatibility
        if (data && data.body) {
            methodData.data = methodData.body;
        }
        // Fetch JS backward Compatibility
        if (data && data.credentials && data.credentials === "include") {
            methodData.withCredentials = true;
        }
        return (
            Promise.all([this.setDefaults(), this.checkAndSetTokenForRequest()])
                .then(responses => {
                    return axios
                        .request(methodData)
                        .then(response => {
                            const headers = response.headers;
                            this.setTokenHeadersForNextRequest(
                                headers["access-token"],
                                headers["client"],
                                headers["expiry"],
                                headers["uid"],
                                headers["token-type"]
                            );
                            return {
                                json: function() {
                                    return Promise.resolve(
                                        response.data
                                    );
                                },
                                blob: function() {
                                    return Promise.resolve(
                                        response.data
                                    );
                                },
                                ok: true
                            };
                        })
                        .catch(error => {
                            return this.errorCatching(error);
                        });
                })
                // This will always be resoled so no need of catch handling.
                .catch(error => {
                    if (error.response) {
                        return Promise.reject(error);
                    } else {
                        console.log(error);
                    }
                })
        );
    }

    static setTokenHeadersForNextRequest(
        token,
        client,
        expiry,
        uid,
        tokenType = "Bearer"
    ) {
        if (token && client && expiry && uid && tokenType) {
            const tokenHash = {
                "access-token": token,
                "token-type": tokenType,
                expiry: expiry,
                client: client,
                uid: uid
            };
            axios.defaults.headers.common = {
                ...axios.defaults.headers.common,
                ...tokenHash
            };
            this.setTokenHeadersInLocalStore(tokenHash);
            Promise.resolve(axios.defaults.headers.common);
        } /*else {
			let error = new Error('Could not fetch headers from the request');
			Promise.reject(error);
		}*/
    }

    static setTokenForNextRequestFromLocalStore(tokenHash) {
        if (
            tokenHash["access-token"] &&
            tokenHash["token-type"] &&
            tokenHash["expiry"] &&
            tokenHash["client"] &&
            tokenHash["uid"]
        ) {
            return Promise.resolve(
                (axios.defaults.headers.common = {
                    ...axios.defaults.headers.common,
                    ...tokenHash
                })
            );
        } else {
            return Promise.resolve("No Token Set");
        }
    }

    static setTokenHeadersInLocalStore(tokenHash) {
        const stringyfiedTokenHashEncoded = JSON.stringify(tokenHash);
        localforage.setItem("tokenHash", stringyfiedTokenHashEncoded);
    }

    static getTokenHeadersFromLocalStore() {
        return localforage
            .getItem("tokenHash")
            .then(stringyfiedTokenHashEncoded => {
                if (stringyfiedTokenHashEncoded) {
                    const tokenValue = JSON.parse(stringyfiedTokenHashEncoded);
                    return tokenValue;
                } else {
                    // If LocalStore Doesn't have any token hash(generally in initial app start), retrun blank hash.
                    return {};
                }
            });
    }
    // Backward compatibility
    static getToken() {
        return this.getTokenHeadersFromLocalStore();
    }
    static resolveURL(url, domain = undefined) {
        let baseURL = null;
        // To handle case of if url or file access protocol, make the base url as blank.
        if (
            _.startsWith(url, "http://") ||
            _.startsWith(url, "https://") ||
            _.startsWith(url, "file://")
        ) {
            baseURL = "";
        } else {
            if (
                (domain && _.startsWith(domain, "http://")) ||
                _.startsWith(domain, "https://")
            ) {
                baseURL = domain;
            } else {
                baseURL = "http://localhost:3000";
            }
        }
        axios.defaults.baseURL = baseURL;
        return Promise.resolve(url);
    }

    static resetToken() {
        return localforage.removeItem("tokenHash", null).then(() => {
            axios.defaults.headers.common = {
                Accept: "application/json, text/plain, */*"
            };
            return 0;
        });
    }

    static getFetchAsseyOptions() {
        let options = {
            ...axios.defaults,
            ...{ responseType: "blob", Accept: "application/octet-stream" }
        };
        return Promise.resolve(options);
    }

    static errorCatching(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            // console.log(error.config);
            let exceptionError = new Error(error.response.statusText);
            exceptionError.response = error.response.data;
            exceptionError.errors = error.response.data.errors;
            return Promise.reject(exceptionError);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // console.log(error.request);
            let exceptionError = new Error("Server Not Responded");
            exceptionError.response = "Server Not Responded";
            exceptionError.errors = [
                "The Request failed. Please make sure you are connected to Internet"
            ];
            return Promise.reject(exceptionError);
        } else {
            // Something happened in setting up the request that triggered an Error
            let exceptionError = new Error(error.message);
            exceptionError.response = error.message;
            exceptionError.errors = [error.message];
            return Promise.reject(exceptionError);
        }
        // console.log(error.config);
    }
}
export { Request };
