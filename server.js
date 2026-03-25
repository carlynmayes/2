const http = require('http');
const fs = require('fs');
const path = require('path');

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
        fs.readFile(path.join(__dirname, 'db.json'),
            (err,content)=>{
                if(err) throw err;
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(content);
            });
    }

    else{
        fs.readFile(path.join(__dirname, '404.html'),
            (err,content)=>{
                if(err) throw err;
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.end(content);
            });
    }
   

    console.log(req.url);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
