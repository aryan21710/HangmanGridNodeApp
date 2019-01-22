const username='ryan';
const latestScr=100;
let db={};


const MongoClient=require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/Hangman',{useNewUrlParser: true},(err,client)=>{

    err ? console.log('NOT ABLE TO CONNECT TO THE HANGMAN DB') : '';
    db.collection('Hangman').find({name:'ryan'})
	.toArray().then((documents)=>{
			 console.log('DOCUMENT SIM FOUND '+JSON.stringify(documents,null,4)) 
	
	}).catch((err)=>{
		console.log('ERROR RETURNED WHILE FETCHING THE DB AGAINST THE OBJECTID :-'+err)
	})
    
})


// MongoClient.connect('mongodb://localhost:27017/Hangman',{ useNewUrlParser: true },(err,client)=>{
//     err ? console.log('NOT ABLE TO CONNECT TO THE HANGMAN DB') : '';
//     if (client) {
//         console.log('CONNECTED TO THE DB SERVER');
//         db=client.db('Hangman');
//         db.createCollection('userScrPair',(err,results)=>{
//             if (err) return console.log('NOT ABLE TO CREATE COLLECTION:-'+err);
//             console.log('DB CREATED');
//             db.collection('userScrPair').find({name:"ryan"}).toArray().then((documents)=>{
//                 console.log('DOCUMENT FOUND '+JSON.stringify(documents,null,4)) 
//             }).catch((err)=>{
//                 console.log(`DOCUMENT WITH ${username} NOT FOUND. ADD NEW DOCUMENT`);
//                 db.collection('userScrPair').insertOne({
//                     name: username,
//                     username: username,
//                     latestScr: latestScr
//                 }),(err,results)=>{
//                     if (err) return console.log('NOT ABLE TO ADD DOCUMENT TO THE COLLECTION'+err)
//                     console.log(`${username} AND ITS SCORE ${latestScr} ADDED TO THE DB`)
//                     console.log('DOCUMENT ADDED:-'+JSON.stringify(results.ops,null,4));
//                 }
            
//             })     

    
//         })
//     } else {
//         console.log('DB DOESNT EXISTS');
//     }
// })
