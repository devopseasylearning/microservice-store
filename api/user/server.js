/**
 * Import vendor modules
 */
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Import own modules
 */
const Api = require(dev ? '../../_defaults/Api' : '/_defaults/Api');

/**
 * Define global variables
 */
const version = '1.0';

/**
 * Create new API service
 */
const api = new Api('user', 4004, version);

/**
 * Setup GET User endpoint
 */
api.get('/', (req, res) => {
    const user = req.cookies.user || false;

    if(!user) {
        res.status(404).json(api.response({}, 'Not Found', 404));
        return;
    }

    res.json(api.response({
        user
    }));
});

/**
 * Setup POST User endpoint
 */
api.post('/', (req, res) => {
    const user = req.cookies.user || false;
    const uuid = uuidv4();

    if(user) {
        res.status(409).json(api.response({}, 'Conflict', 409));
        return;
    }

    fetch(dev ? 'http://localhost:5000/user' : 'http://storage:5000/user', {
        method: 'post',
        body: JSON.stringify({
            user: uuid
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.status.success) {
                res.cookie('user', uuid).json(api.response({
                    user: uuid,
                    storage: data.data
                }));
            } else {
                res.status(500).json(api.response({
                    error: data.data
                }, 'Server Error', 500));
            }
        }).catch((e) => {
            res.status(500).json(api.response({
                error: e.message || false
            }, 'Server Error', 500));
        });
});

/**
 * Start the server
 */
api.init();
