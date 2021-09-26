const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
const upload = require('express-fileupload');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express()

dotenv.config();
app.use(upload());
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json()) 

app.use(express.static(path.join(__dirname, 'public')))



// mongodb initialisation
mongoose.connect(process.env.mongoUrl,{useUnifiedTopology:true,useNewUrlParser:true},(err)=>
{
  if(err)
  {
    console.log('some error occured');
  }
  else
  {
    console.log('connected');
  }
})


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.get('/video', function(req, res) {
  const path = './uploads/shivay.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    if(start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
      return
    }
    
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})


app.post('/vedio',async (req,res)=>
{
	if(req.files)
	{
  		console.log(req.files);
      const vedio = req.files.file;
      const vedioName = vedio.name;
      console.log(vedio)
      try {
        const result = await vedio.mv('./uploads/shivay.mp4');
        res.redirect('/');
      }
      catch(err)
      {
        res.send(err);
      }
  }
	else
	{
		console.log('error');
		res.send('some error occured');
	}
	
})
app.listen(3000, function () {
  console.log('Listening on port 3000!')
})