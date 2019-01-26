const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io')
const app=express();
const fs=require('fs');

const publicPath=path.join(__dirname, '../public');
const PORT=process.env.PORT||4000;

const MongoClient=require('mongodb').MongoClient;


// here we are not using app.render to render the index.html page
// instead whatever html file is available in public dir will be
// rendered automatically by defining below middleware.
app.use(express.static(publicPath));

const server=http.createServer(app);
// Once we have access to io variable after defining http.createServer,
// we get access to a JS library which makes it easy to work on socket io on the client side.
//  This lib is available at localhost:3000/socket.io/socket.io.js

const io=socketIO(server);

console.log('********************************************************************************');
// There are list of inbuilt events which makes the web socket works one of them
// is connection. It works as follows.  We get access to socket variable from
// the client side. 
io.on('connection',(socket)=>{
    let username='';
    const movieType=''; 
    let latestScr=0;
    const d1=new Date();
    let topScorers=[];


    MongoClient.connect('mongodb://localhost:27017/',{useNewUrlParser: true},(err,client)=>{

        if (err) return console.log('NOT ABLE TO CONNECT TO THE TODOAPP DB:-'+err)
        let db=client.db('HANGMAN');
        console.log('COLLECTING STATS OF ALL RECORDS NOW:-');
        db.collection('userScrPair').find({})
        .toArray().then((docs)=>{
            console.log(docs.length+':'+Array.isArray(docs));
            console.log('ALL RECORDS:-'+JSON.stringify(docs));
       
            let obj={};
            docs.forEach((v,ind)=>{
                if(v.username!='' && v.latestScr > 0) {
                    obj[parseInt(v["latestScr"])]=v["username"];
                }
            })

            topScorers.push(obj);
            
            console.log('TOP SCORERS ARRAY AFTER ITERATING OVER ALL RECORDS:-'+JSON.stringify(topScorers));
            let sortedTopScore=Object.keys(topScorers[0]).sort(function(c,d){return parseInt(d)-parseInt(c)});
            console.log('SORTED SCORE:-'+sortedTopScore);
            let t='';
            sortedTopScore.forEach((v)=>{
                t+=String(topScorers[0][v]).toUpperCase()+':-'+v+', ';
            })
            console.log('t:-'+t);
            
            socket.emit('topScorers',t);
            }).catch((err)=>{
                console.log('NOT ABLE TO ITERATE OVER ALL THE RECORDS:-'+err);
            })
        })     

        socket.on('userName',(userName)=>{
            console.log(`"${userName}" IS CONNECTED ON "${d1.toTimeString()} ${d1.toDateString()}"`);
            username=userName;
        })
        
        socket.on('movieType',(movieType)=>{
            console.log(`"${username}" PLAYING "${movieType}" HANGMAN`)
            socket.on('startBtnClicked',()=>{
                var movieName=[];
                // console.log('movieType:='+ movieType);
                let filename=path.join('public',movieType);
                // console.log('filename:-'+filename);
                fs.readFile(filename,'utf8',(err,data)=>{        
                    if (data) {
                        movieName=data.split('\n');
                        console.log(`INTIAL SCORE ON SERVER FOR "${username}" IS ${latestScr}`);
                        socket.emit('sendMovieList',{
                            scr: latestScr,
                            movieName: movieName,
                            username: username
                        });                   
                    }          
                })

            })
        })

        socket.on('gameStatus',(scrObj)=>{
            console.log(`"${username}" ${scrObj.scr}`);
        })



        socket.on('clToSvScr',(scr)=>{
            latestScr=scr;
            console.log(`LATEST SCORE ON SERVER SIDE FOR "${username}" IS ${latestScr}`);


    })

        

        socket.on('disconnect',()=>{
            console.log(`"${username}" DISCONNECTED AT "${d1.toTimeString()} ${d1.toDateString()}" `);
            MongoClient.connect('mongodb://localhost:27017/',{useNewUrlParser: true},(err,client)=>{

                if (err) return console.log('NOT ABLE TO CONNECT TO THE TODOAPP DB:-'+err)
                let db=client.db('HANGMAN');

                //#KEYWORDS:- [CHECK IF THE COLLECTION FIRST EXIST IN THE DB. IF NOT DB.CREATECOLLECTION]
                db.listCollections().toArray(function(err, items){
                    if (err) throw err;
        
                    console.log('items:-'+JSON.stringify(items)); 
                    if (items.length == 0) {
                        console.log("No collections in database");  
                        db.createCollection('userScrPair',(err,results)=>{
                            if (err) return console.log('CANT CREATE THE COLLECTION');
                            console.log(' NEW COLLECTION CREATED')
                        })
                    }
                }) 


                console.log(`${username} HAS ${latestScr} SCORE`);
                db.collection('userScrPair').find({name:username})
                .toArray().then((documents)=>{
                        console.log('DOCUMENT FOUND '+JSON.stringify(documents,null,4));
                        console.log(`${username} RECORD ALREADY EXISTS WITH SCORE ${documents[0]['latestScr']}`);
                        let l=documents[0]['latestScr']>latestScr ? documents[0]['latestScr'] : latestScr;
                        console.log('l:-'+l);
                        db.collection('userScrPair').findOneAndUpdate(
                            { name: username}, { $set: { latestScr: l}} ,{returnOriginal: false}
                            )
                            .then((documents)=>{
                                console.log('UPDATED DOCUMENT  '+JSON.stringify(documents,null,4));
                            }).catch((err)=>{
                                console.log(`${username} RECORDS NOT UPDATED WITH LATEST SCORE`);
                            })
                    }).catch((err)=>{
                    console.log(`${username} RECORD DOES NOT EXIST. ADD NEW DOCUMENT`);
                    db.collection('userScrPair').insertOne({
                        name: username,
                        username:username,
                        latestScr: latestScr
                    },function(err,results){
                    if (err) throw err;
                        console.log('DOCUMENT IS ADDED NOW');
                       
                    })
                })   
        })
        console.log('********************************************************************************');




            
        

    })
})
      
server.listen(PORT,()=>{
    console.log(`server started at PORT:- ${PORT}`);
})