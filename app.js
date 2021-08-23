'use strict';

const {load} = require('./class/parser');
const {uploadImage} = require('./class/api');
const {defaultLogger, apiLogger} = require('./class/logger');

(async () => {
    let generator = load();
    let uploads = [];
    for await(let value of generator) {
        try {
            uploads.push(uploadImage({
                image: value.image,
                key: 'stocksnap/' + value.id,
                description: value.description,
            }));
            if (uploads.length === 39) {
                try {
                    await Promise.allSettled(uploads);
                } catch (e) {
                    apiLogger.error(e);
                }
                uploads = [];
                defaultLogger.info(`39 files have been successfully sent to the server`);
            }
        } catch (e) {
            defaultLogger.error(e)
        }
    }
})();