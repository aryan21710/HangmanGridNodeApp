
class HangmanClass {
    constructor(movieArr,shape=['Head','Body','LeftLeg','RightLeg','LeftHand','Kill'],score=0,movieName='') {
        this.movieArr=movieArr;
        this.shapeArr=shape;
        this.shape=null;
        this.score=score;
        this.movieName=movieName;
    }

    static createTags(movie) {
        console.log('*********createTags is called***********');
        console.log('INSIDE STATIC:-'+movie);
        document.getElementById('userInpDiv').innerHTML='<input type="text" maxlength="1" id="userInpTag" \
        style="  color: white;  \
         text-align: center;" placeholder="ENTER TEXT HERE">'

        const inputTags=[];
        const wrongOptions=[];
        const wrongOptionsId=[];
        movie.split('').forEach((v,ind)=>{
            v != ' ' ? inputTags.push(`<input id=${v.toUpperCase()} style="color: white; background-image: url('brick-black-wallpaper.jpg'); width: 30px; height: 30px; font-size: 1.5em; text-align: center;" maxlength="1">`) : inputTags.push('&nbsp&nbsp');
            v != ' ' ? wrongOptions.push(`<span id=${ind} style="margin-left: 20px; text-align: center; display: inline;"></span>`): '';
            v != ' ' ? wrongOptionsId.push(ind): '';
        })
        // console.log('inputTags:-'+inputTags);
        const userInput=[];
        // console.log(':'+wrongOptions);
        document.getElementById('WrongOptions').innerHTML=wrongOptions.join('');
        document.getElementById('mydiv').innerHTML=inputTags.join('');
        return wrongOptionsId;
    }

  
    static removeFoundLetter(dupmovieVar,letter) {
        console.log('***********removeFoundLetter is called***********');

        dupmovieVar=dupmovieVar.split('');
        let newmovie=[];
        for (let i=0; i < dupmovieVar.length; i++) {
            dupmovieVar[i]!=letter ? newmovie.push(dupmovieVar[i]) : ''
        }
        newmovie=newmovie.join('');
        console.log(`after removing ${letter} the new movie name is ${newmovie}`);
        return newmovie;        
    }

    static wrngOption(letterEntered,wrongOptionsId) {
        console.log('NO MATCH FOR:-'+letterEntered);
        console.log('wrongOptions'+wrongOptionsId.length);
        for(let i=0; i < wrongOptionsId.length; i++) {
            if(document.getElementById(wrongOptionsId[i]).innerHTML!=undefined && document.getElementById(wrongOptionsId[i]).innerHTML=='') {
                document.getElementById(wrongOptionsId[i]).innerHTML=letterEntered;
                setTimeout(()=>{
                    document.getElementById(wrongOptionsId[i]).style.transform='rotate(20deg)';
                },200);
                break;
            }
        }
    }

    static soundEffects(type) {
        document.getElementById('audio').src='';
        if (type=='wrong') {
            console.log('PLAY WRONG OPTION SOUND NOW');
            document.getElementById('audio').src='Pain.mp3';    
        } else if (type=='kill') {
            document.getElementById('audio').src='Scary Scream.mp3';    
        } else if (type=='right') {
            document.getElementById('audio').src='Kid Laughing.mp3';    
        } else if (type=='won') {
            document.getElementById('audio').src='Applause Light.mp3';    
        }
    }

    static printWinMessage(status) { 
        console.log('status inside printWinMessage:-'+status);

        // console.log('intial fontsize:-'+document.getElementById('PrintStatusCont').style.fontSize);
        if (status=='win' || status=='lose') {
            document.querySelector('#PrintStatusCont div').style.fontSize='0.3em';
            this.printMessage=()=> {
                console.log('printWinMessage is called now..');
                let font=document.querySelector('#PrintStatusCont div').style.fontSize;
                font=parseFloat(font.slice(0,font.length-2));
                console.log('font size:-'+font);
                console.log('status:-'+status);
                if (font <= 1.5) {
                    console.log('in if block of printWinMessage');
                    font+=0.3;
                    document.querySelector('#PrintStatusCont div').style.fontSize=font+'em';
                    console.log('new font size:-'+document.querySelector('#PrintStatusCont div').style.fontSize);
                    console.log('before:-'+document.querySelector('#PrintStatusCont div').innerHTML);
                    status=='lose'? document.querySelector('#PrintStatusCont div').innerHTML="YOU LOST.." :
                    document.querySelector('#PrintStatusCont div').innerHTML="YOU WON..";
                    console.log('after:-'+document.querySelector('#PrintStatusCont div').innerHTML);
                } else {
                    console.log('in else block of printWinMessage');
                    socket.emit('gameStatus',{
                        scr: status,
                    })          
                    clearInterval(clearInt);
                }
             

            }
            let clearInt=setInterval(this.printMessage,300);

        }
    
    }

     checkResult(result,movie,animationCount) {
        console.log('***********checkresult is called***********');
        console.log('animationCount:-'+animationCount);
        result=result.toUpperCase();
        movie=movie.split(' ').join('').toUpperCase();
        console.log(result+':'+movie);
      
        console.log('CURRENT SCORE:-'+this.score);
        if (animationCount > 0) {
            if (result.length===movie.length) {
                for(let i=0;i < result.length; i++) {
                    if(!movie.includes(result[i])) { 
                        console.log(`${result[i]} didnt match. User will Play next Move`);                
                    }
                }
                HangmanClass.printWinMessage('win');
                HangmanClass.soundEffects('won');
                document.getElementById('userInpTag').disabled=true;
                this.score+=10;
                socket.emit('clToSvScr',this.score);

                
                setTimeout(()=>{
                    document.querySelector('span').innerHTML=this.score;
                }, 1000);
                console.log('CHANGED SCORE:-'+this.score);
            }
        } else {
            HangmanClass.soundEffects('kill');
            console.log('NO OF CHANCES ARE EXHAUSTED...CALLING printMessage AFTER THIS');
            HangmanClass.printWinMessage('lose');
           
            document.getElementById('userInpTag').disabled=true;   
            // this.score > 0 ? this.score-=10 : this.score=0;
            socket.emit('clToSvScr',this.score);

            setTimeout(()=>{
                document.querySelector('span').innerHTML=this.score;
            }, 1000);
            console.log('CHANGED SCORE:-'+this.score);
           
        }
    }

    animation(shape=this.shape,whichShape=this.shapeArr.length) {
        console.log('*********animation is called*********');
        let myCanvas=document.getElementById('myCanvas');
        console.log('shape now:-'+shape+' WHICHSHAPE:-'+whichShape+' ..mycanvas id:-'+ myCanvas);

        if(myCanvas) {
                let ctx = myCanvas.getContext("2d");
                ctx.lineWidth=10;
                // THE TOP LINE:-
                ctx.moveTo(0,0);
                ctx.lineTo(100,0);

                // THE VERTICAL LINE:-
                ctx.moveTo(50,0);
                ctx.lineTo(50,180);

                ctx.stroke();
                
                if (shape=='Head') {
                        ctx.beginPath();
                        ctx.arc(50, 180, 35, 0, 2 * Math.PI);
                        ctx.fillStyle = "black";
                        ctx.fill();
                        ctx.stroke();
                        console.log('HEAD');
                } else if(shape=='Body') {
                            ctx.moveTo(50,90);
                            ctx.lineTo(50,400);
                            ctx.stroke();
                            console.log('BODY');
                } else if (shape=='LeftLeg') {
                            ctx.moveTo(50,400);
                            ctx.lineTo(10,500);
                            ctx.stroke();
                            console.log('LEFT LEG');
                } else if (shape=='RightLeg'){
                            ctx.moveTo(50,400);
                            ctx.lineTo(90,500);
                            ctx.stroke();
                            console.log('RIGHT LEG');
                } else if (shape=='LeftHand') {
                            console.log('BOTH HANDS NOW');
                            ctx.moveTo(50,350);
                            ctx.lineTo(0,350);
                            ctx.stroke();

                            ctx.moveTo(50,350);
                            ctx.lineTo(100,350);
                            ctx.stroke();
                } else if (shape=='Kill') {
                            console.log('KILLING NOW');
                            ctx.beginPath();
                            ctx.clearRect(0, 130, 100, 200);
                            ctx.closePath();
                            ctx.moveTo(50,0);
                            ctx.lineTo(50,360);
                    
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.arc(90, 180, 35, 0, 2 * Math.PI);
                            ctx.fillStyle = "black";
                            ctx.fill();
                            ctx.stroke();
                }
        
        } else {
                console.log('myCanvas element inside AnimationArea missing');
        }
    }
    
     start() {

        console.log('***************** NEW GAME ************************');
      
        this.movieName=this.movieArr[Math.floor(Math.random()*this.movieArr.length-1)].trim();
        // // console.log('moviename:-'+this.movieName.split(''));
        // this.movieArr.forEach((v)=>{
        //     console.log(v+':'+v.trim().length);
        // })

        console.log('movieName:-'+this.movieName+':'+this.movieName.length); 
        this.shapeArr=['Head','Body','LeftLeg','RightLeg','LeftHand','Kill'];
        console.log('this.shapeArr:-'+this.shapeArr);
        console.log('moviename:-'+this.movieName);
        document.querySelector('#PrintStatusCont div').innerHTML='';
        document.querySelector('#PrintStatusCont div').style.fontSize='1.5em';
        let rightOptionMsg=['KYA BAAT HAI','SUPER MACHA','KEEP GOING','YAK NUMBER','PHAAD','GAMER ON FIRE'];
        const AnimationArea=document.getElementById('AnimationArea');
        AnimationArea.innerHTML='<canvas id="myCanvas" width= "280" height = "580"> </canvas>'
        this.animation(null);
        let result='';
        let dupmovieVar=this.movieName;
        let wrongOptionsId=HangmanClass.createTags(this.movieName);
        let keyDwnFunc=((e)=>{
                e.target.value=e.target.value.toUpperCase();
                console.log('entered :-'+e.target.value);
                let idName='#'+e.target.value;
                if (dupmovieVar.includes(e.target.value)) {
                        document.querySelectorAll(idName).forEach((v)=>{
                            v.value=e.target.value;
                            v.id='9';
                            result+=e.target.value;
                        }) 
                    dupmovieVar=HangmanClass.removeFoundLetter(dupmovieVar,e.target.value);
                    console.log('rightOptionMsg1.:-'+ rightOptionMsg[Math.floor(Math.random()*rightOptionMsg.length)]);
                    document.querySelector('#PrintStatusCont div').style.fontSize='1.5em';
                    document.querySelector('#PrintStatusCont div').innerHTML= rightOptionMsg[Math.floor(Math.random()*rightOptionMsg.length)];
                    HangmanClass.soundEffects('right');

                    } else {
                        HangmanClass.wrngOption(e.target.value,wrongOptionsId);
                        document.querySelector('#PrintStatusCont div').innerHTML='';
                        if(this.shapeArr.length>0) {
                            this.shape=this.shapeArr.shift();
                            this.animation(this.shape,this.shapeArr.length);  
                            HangmanClass.soundEffects('wrong');
                        } 
                    }
                    e.target.value='';               
                    this.checkResult(result,this.movieName,this.shapeArr.length);
            })
            document.getElementById('userInpTag').addEventListener('input',keyDwnFunc);   
    }

  


}

// const hangman=new HangmanClass('XQ JNHG PRTYW');
// const hangman=new HangmanClass('TAXI DRIVER');
// const hangman=new HangmanClass('FANNY AND ALEXANDER');
// // const hangman=new HangmanClass('INDIANA JONES AND THE LAST CRUSADE') --> UI breaking