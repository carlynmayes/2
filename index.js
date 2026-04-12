const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let glazeBookCollection;

async function connectDB() {
    try {
        await client.connect();
        glazeBookCollection = client.db("glazeBookDB").collection("glazeBookCollection");
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("MongoDB connection failed:", e);
        process.exit(1);
    }
}

const server = http.createServer( (req, res)=>{
    
    if(req.url === '/'){
        fs.readFile(path.join(__dirname,'index.html'),
            (err,content)=>{
                if(err) throw err;
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(content);
            });
    }

    else if(req.url ==='/api'){
        glazeBookCollection.find({}).toArray()
                .then(results => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results));
                })
                .catch(err => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Failed to fetch memberships" }));
                });


        // fs.readFile(path.join(__dirname, 'db.json'),
        //     (err,content)=>{
        //         if(err) throw err;
        //         res.writeHead(200, {'Content-Type': 'application/json'})
        //         res.end(content);
        //     });
    }

    else if (req.url.endsWith('.png')) {
        fs.readFile(path.join(__dirname, req.url.substring(1)), (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(content);
        });
    }

    else if (req.url.endsWith('.jpg') || req.url.endsWith('.jpeg')) {
        fs.readFile(path.join(__dirname, req.url.substring(1)), (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(content);
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
   

    console.log(req.url);
});

const PORT = process.env.PORT || 3000;
connectDB();
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});