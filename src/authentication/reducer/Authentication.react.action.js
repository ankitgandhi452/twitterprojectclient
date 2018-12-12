import _ from "lodash";
/*
 * Actions
 */
export const LOGIN = "LOGIN";
export const SIGNUP = "SIGNUP";
export const LOGOUT = "LOGOUT";

/*
 * Action Creators
 */

function _login(status, err, data) {
    return {
        type: LOGIN,
        status,
        err,
        data
    };
}

function _signup(status, err, data) {
    return {
        type: SIGNUP,
        status,
        err,
        data
    };
}

function _logout(status, err, data) {
    return {
        type: LOGOUT,
        status,
        err,
        data
    };
}

export const preprocessLoginDetails = (firstField, passwordField) => {
    let processedFirstField = _.chain(firstField)
        .trim()
        .toLower()
        .value();
    const processedPasswordField = _.chain(passwordField)
        .split(" ")
        .join("")
        .value();

    return {
        processedFirstField,
        processedPasswordField
    };
};

export const validateLoginDetails = (firstField, firstFieldType) => {
    let errorMessage = null;
    if (
        firstFieldType &&
        firstFieldType === "email" &&
        !_.includes(firstField, "@")
    ) {
        errorMessage =
            "Email is invalid format, please check the email you have entered.";
    }
    return errorMessage;
};

function login(firstField, password, apiURL) {
	return (dispatch, getState, Request) => {
		let formData = {}
		let loginDetails = preprocessLoginDetails(firstField, password);
		const validateLoginDetail = validateLoginDetails(firstField, 'email');
		if (!validateLoginDetail) {
			formData['email'] = loginDetails.processedFirstField;
			formData['password'] = loginDetails.processedPasswordField;
			return Request.fetch(
				'/auth/sign_in',
				{
					method: 'POST',
					body: formData,
				}
			)
				.then(response => {
					return response.json();
				})
				.then(userData => {
					return dispatch(
						_login('success', null, {
							id: userData.data.id,
                            email: userData.data.email,
                            uid: userData.data.uid,
                            provider: userData.data.provider,
						})
					);
				})
				.catch(err => {
					dispatch(_login('error', err, null));
					return Promise.reject(err);
				});
		} else {
			return Promise.resolve({
				status: 500,
				errors: [validateLoginDetail],
			});
		}
	};
}

function logout() {
    return (dispatch, getState, Request) => {
        dispatch(_logout("fetching"));
        const logoutPath = '/auth/sign_out';
        return Request.fetch(logoutPath, {
            method: "POST",
            body: ""
        })
            .then(() => {
                Request.resetToken();
            })
            .then(() => {
                return dispatch(_logout("success"));
            })
            .catch(err => {
                // If some errors still log him out of application
                Request.resetToken();
                return dispatch(_logout("error", err));
            });
    };
}

function signUp(firstField, password, apiURL) {
	return (dispatch, getState, Request) => {
		let formData = {}
		let loginDetails = preprocessLoginDetails(firstField, password);
		const validateLoginDetail = validateLoginDetails(firstField, 'email');
		if (!validateLoginDetail) {
			formData['email'] = loginDetails.processedFirstField;
			formData['uid'] = loginDetails.processedFirstField;
			formData['provider'] = 'email';
			formData['password'] = loginDetails.processedPasswordField;
			return Request.fetch(
				'/auth',
				{
					method: 'POST',
					body: formData,
				}
			)
				.then(response => {
					return response.json();
				})
				.then(userData => {
					return dispatch(
						_signup('success', null, {
							id: userData.data.id,
                            email: userData.data.email,
                            uid: userData.data.uid,
                            provider: userData.data.provider,
						})
					);
				})
				.catch(err => {
					dispatch(_signup('error', err, null));
					return Promise.reject(err);
				});
		} else {
			return Promise.resolve({
				status: 500,
				errors: [validateLoginDetail],
			});
		}
	};
}

class AuthenticationAction {
    static login = login;
    static logout = logout;
    static signUp = signUp;
}

export { AuthenticationAction };
