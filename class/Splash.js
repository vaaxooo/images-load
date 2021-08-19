'use strict';

const {apiErrorLog} = require("./logger");

const axios = require('axios').create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        'Accept-Language': 'ru,uk-UA;q=0.9,uk;q=0.8,en-US;q=0.7,en;q=0.6',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
    }
});

let page = 1;

async function* load() {
    try {
        do {
            let response = await axios.get('/photos', {
                params: {
                    page: page,
                    per_page: 100,
                    order_by: 'oldest',
                    client_id: process.env.UNSPLASH_TOKEN,
                }
            });
            for (const value of response.data) {
                yield {
                    id: value.id,
                    description: value.alt_description || null,
                    image: value.urls?.full + "&w=1800&h=1800"
                };
            }
            page++;
            if(response.data.length === 0) break;
        } while (true);
    } catch (e) {
        apiErrorLog(e);
    }
}

function getImageContent(url) {
    return axios.get(url, {
        responseType: 'stream'
    }).then(response => {
        return response.data;
    });
}

module.exports = {
    load, getImageContent
}