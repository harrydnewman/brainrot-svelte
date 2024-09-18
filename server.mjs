import express from 'express';
import multer from 'multer';
import path from 'path';
import Datastore from '@seald-io/nedb';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const upload = multer({ 
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
});

var db = new Datastore({ filename: path.join(__dirname, 'database.txt'), autoload: true });

app.use(express.static('public'));
app.use(cors());

app.post('/uploadVideo', upload.single('video'), (req, res) => {
    console.log('Received request body:', req.body);
    
    if (!req.file) {
        console.error('No file received');
        return res.status(400).json({ message: 'No file received' });
    }
    try {
        const title = req.body.title || 'Untitled';
        console.log(req.file.path)
        res.status(200).json({ 
            message: 'File uploaded successfully!',
            title: title,
            filePath: req.file.path
            
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/getVideos', (req, res) => {
    const uploadPath = path.join(__dirname, 'uploads');
    fs.readdir(uploadPath, (err, files) => {
        if (err) {
            console.error('Error reading upload directory:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        // Filter for video files (you may want to adjust this based on your allowed file types)
        const videoFiles = files.filter(file => /\.(mp4|mov|avi|mkv)$/i.test(file));
        res.json(videoFiles);
    });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});