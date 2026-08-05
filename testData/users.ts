import { password } from "./constant";

export const USERS ={

        STANDARD: {
            username : 'standard_user',
            password : 'secret_sauce'
        },
        LOCKED_OUT: {
            username : 'locked_out_user',
            password : 'secret_sauce'
        },
        PROBLEM: {
            username : 'problem_user',
            password : 'secret_sauce'
        },
        PERFORMANCE_GLITCH: {
            username : 'performance_glitch_user',
            password : 'secret_sauce'
        },
        ERROR: {
            username : 'error_user',
            password : 'secret_sauce'
        },
        VISUAL: {
            username : 'visual_user',
            password : 'secret_sauce'
        },
};


export const DEFAULT_USERS = USERS.STANDARD;

export const INVALID_CREDENTIALS ={

    INVALID_USERNAME: {
        username : 'invalid_user',
        password : 'secret_sauce',
        expectedError : 'Epic sadface: Username and password do not match any user in this service'
    },

    INVALID_PASSWORD: {
        username : 'standard_user',
        password : 'wrong_password',
        expectedError : 'Epic sadface: Username and password do not match any user in this service'
    },

    EMPTY_USERNAME: {
        username : '',
        password : 'secret_sauce',
        expectedError : 'Epic sadface: Username is required'
    },

    EMPTY_PASSWORD: {
        username : 'standard_user',
        password : '',
        expectedError : 'Epic sadface: Password is required'
    },

    BOTH_EMPTY: {
        username : '',
        password : '',
        expectedError : 'Epic sadface: Username is required'
    },

}

