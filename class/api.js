'use strict';

const FormData = require('form-data');
const { getImageContent } = require("./Pixabay");
const { apiErrorLog, apiLogger} = require("./logger");

const axios = require('axios').create({
    baseURL: process.env.UPLOAD_URL || 'https://photos.lanuel.com',
});

async function uploadImage({image, description = null, key = null}) {
    const { data: unique } = await axios.get(`/unique?key=${key}`);
    if(!unique) {
        return true;
    }
    return getImageContent(image).then(imageContent => {
        let form = new FormData();
        form.append('description', description || '');
        form.append('key', key);
        form.append('photo', imageContent, {
            filename: `${key}.jpeg`
        });
        return axios.post('/upload', form, {
            headers: {
                ...form.getHeaders(),
            }
        }).then(response => {
            const {data, success} = response.data;
            if(!success) {
                throw new Error(response.data);
            }
        }).catch(e => {
            apiErrorLog(e);
        });
    }).catch(e => {
        apiErrorLog(e);
    });
}

module.exports = {
    uploadImage
}