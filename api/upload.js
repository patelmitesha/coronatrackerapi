var formidable = require('formidable');

/// search course by courseconfig id ///
module.exports.upload = function(req, res) {

    console.log('========================================');
    console.log('Uploading');
    console.log("Query : " +JSON.stringify(req.query));
    console.log("body : " +JSON.stringify(req.body));
    console.log("formData : "+JSON.stringify(req.formData));
    var form = new formidable.IncomingForm();
    console.log('parsing form request');
    form.parse(req, function(err,fields,files){
      console.log('inside parse');
      if(err){
        console.log('Error while parsing');
        console.log(err);
      }
      if(fields){
        console.log('Got fields');
        console.log('Fields : '+JSON.stringify(fields));
   //     var oldpath=req.body.UserImage.filename;
        // console.log('file name : '+oldpath);
      }
      if(files){
        console.log('Got files');
        console.log('Files : '+JSON.stringify(files));
      }
    });

    form.on('fileBegin',function(name,file){
      console.log('File Name : '+file.name);
      file.path=__dirname + '/uploads/'+file.name;
    });

    form.on('progress',function(bytesReceived,bytesExpected){
      console.log("Received : ("+ bytesReceived + " out of "+ bytesExpected+").");
      //console.log("Received : "+ (bytesReceived / bytesExpected)*100);
    });

    form.on('file',function(name,file){
      console.log('Uploaded'+file.name);
    });

    form.on('error',function(err){
      console.log('Error occured');
      res.status(500);
      res.send(err);
    });

    form.on('aborted',function(){
      console.log('Aborted');
      res.status(400);
      res.send('aborted');
    });

    form.on('end',function(){
      console.log("Done");
      res.status(200);
      res.send("success");
  });



};


