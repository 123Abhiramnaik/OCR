import express from 'express';
const app = express();
import path from 'path';
import multer from 'multer';
import vision from '@google-cloud/vision';
const client = new vision.ImageAnnotatorClient({
    keyFilename: './key.json',
});
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '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'
});


let basePath = path.resolve(path.resolve() + '/views/');
const serverFile = (file) => {
    let filePath = path.resolve(basePath + '/' + file)
    return filePath;
}


app.get('/', async (req, res) => {
    try {
        res.sendFile(serverFile('index.html'));
    } catch (err) {
        res.sendFile(serverFile('500.html'));
    }
})

app.get('/upload', (req, res) => {
    try {
        res.sendFile(serverFile('upload.html'));
    } catch (err) {
        res.sendFile(serverFile('500.html'));
    }
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/uploadImage', upload.single('image'), async (req, res) => {
    try {
        let imageBuffer = req.file.buffer;
        const request = {
            image: {
                content: imageBuffer,
            },
        };
        client
            .textDetection(request)
            .then(async (results) => {
                const detections = results[0].textAnnotations;
                let extractedText;
                if (detections.length > 0) {
                    extractedText = detections[0].description;
                } else {
                    extractedText = '';
                }
                if (extractedText.length) {
                    let res = await openai.chat.completions.create({
                        messages: [{ role: 'user', content: `extract the usefull information from this(only english content) and give a json result. content: ${extractedText}` }],
                        model: 'gpt-3.5-turbo',
                    });
                    console.log(res);
                }
                res.json({ success: true, text: extractedText })
            })
            .catch((err) => {
                console.error('Error during text detection:', err);
            });
    }
    catch (err) {
        res.json({
            success: false
        })
    }
})








async function extractInformation(text) {
    const prompt = "Summarize the following text:\nThe quick brown fox jumps over the lazy dog.";

    const params = {
        engine: "davinci",
        prompt: prompt,
        max_tokens: 250,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.2,
    };
    openaiClient.createCompletion(params)
        .then(response => {
            console.log(response.data.choices[0].text);
        })
        .catch(error => {
            console.error(error);
        });
}





export default app;