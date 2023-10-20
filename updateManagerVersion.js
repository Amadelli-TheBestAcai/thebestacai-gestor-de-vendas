const axios = require('axios')
const https = require('https');
const env = require("./electron/src/providers/env.json")
const pkg_version = require("./package.json").version

async function boostrap() {
    try {
        const { data } = await axios({
            method: 'PUT',
            url: `${env.API_DASH}/version?app=gestor_2_0`,
            data: {
                version: pkg_version,
            },
            headers: {
                Authorization: "Bearer " + env.API_TOKEN
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

boostrap()
