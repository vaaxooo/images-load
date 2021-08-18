import axios from 'axios';
import uniqid from 'uniqid';
import FormData from "form-data";
import dotenv from 'dotenv';
import download from "download";
import * as fs from 'fs';

dotenv.config();

const params = {
    totalPages: 500,
    content_filter: "high",
    images: [{}]
}

export class Splash {

    async getImages(req, res) {
        for (let i = 1; i < params.totalPages; i++) {
            let response = await axios.get(process.env.API_URL, {
                params: {
                    page: i,
                    client_id: process.env.UNSPLASH_TOKEN
                }
            });
            let imagesList = response.data;
            for (let i = 0; i < imagesList.length; i++) {
                let imageDescription = imagesList[i]?.alt_description;
                let imageFileName = uniqid() + uniqid() + ".jpeg";
                let path = 'temp_images/' + imageFileName;
                fs.writeFileSync(path, await download(imagesList[i]?.urls?.small + "&w=700"));
                let file = fs.createReadStream(path);
                const form = new FormData();
                form.append('imageDescription', imageDescription || "Sorry.. This description empty :)");
                form.append('imageFile', file);
                let config = {
                    header: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                await axios.post(process.env.UPLOAD_URL, form, config);
                fs.unlink(path, function(err){
                    if(err) return console.log(err);
                });
            }

        }
    }

}