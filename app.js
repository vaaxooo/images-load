'use strict';

const {load} = require('./class/Pixabay');
const {uploadImage} = require('./class/api');
const {defaultLogger, apiLogger} = require('./class/logger');

(async () => {
    let generator = load();
    let paramsMap = new Set();
    let uploads = [];
    for await(let value of generator) {
        if(!paramsMap.has(value.id)) {
            paramsMap.add(value);
        } else {
            continue;
        }

        try {
            uploads.push(uploadImage({
                image: value.image,
                key: 'splash/' + value.id,
                description: value.description,
            }));
            if(uploads.length === 30) {

                try {
                    await Promise.allSettled(uploads);
                } catch (e) {
                    apiLogger.error(e);
                }
                uploads = [];
                defaultLogger.info(`30 files have been successfully sent to the server`);
            }
        } catch (e) {
            defaultLogger.error(e)
        }
    }
})();
