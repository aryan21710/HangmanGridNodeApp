const fs=require('fs');

fs.readFile('hollywood','utf8',(err,data)=>{
    err ? console.log('ERROR OCCURED:-'+err) : ''
    if(data) {
        let b=[];
        const arr=String(data).trim().split('\n');
        arr.forEach((x)=>{
            // let a=x.split('');
            // if (a.includes("'")) {
            //     b.push(a.splice(0,a.indexOf("'")).join('').trim());
            // } else {
            //     b.push(x);
            // }
            let a=x.toUpperCase();
            console.log('a:-'+a);
            fs.appendFileSync('hollywood_new1',a+'\n');
            // b.push(x.toUpperCase());
            // console.log('b:-'+b);

           })
        // b.forEach((x)=>{
        //     fs.appendFileSync('hollywood_new1',x+'\n');
        // })


   } else {
       console.log('hollywood file doesnt exist');
   }
})