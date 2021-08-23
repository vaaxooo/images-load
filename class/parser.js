'use strict';

const {apiErrorLog} = require("./logger");

const axios = require('axios').create({
    baseURL: 'https://stocksnap.io',
    headers: {
        'Accept-Language': 'ru,uk-UA;q=0.9,uk;q=0.8,en-US;q=0.7,en;q=0.6',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
    }
});

const CDN_API = 'https://cdn.stocksnap.io';
let page = 1;

async function* load() {
    try {
        do {
            const {data} = await axios.get("/api/load-photos/date/desc/" + page);
            for (const object of data.results) {
                const tags = object.tags.split(',').map(function (e) {
                    return e.trim();
                });
                const generateUrl = CDN_API + '/img-thumbs/960w/' + (tags[0] + '-' + tags[1] + '_' + object.img_id + '.jpg').replace(/\s+/g, '');
                yield {
                    id: object.img_id,
                    image: generateUrl,
                    description: object.tags
                };
            }
            page++;
            if (!data || data.length === 0) break;
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