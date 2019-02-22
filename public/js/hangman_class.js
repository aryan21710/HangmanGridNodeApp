
class HangmanClass {
    constructor(movieArr,shape=['Head','Body','LeftLeg','RightLeg','LeftHand','Kill'],score=0,movieName='') {
        this.movieArr=movieArr;
        this.shapeArr=shape;
        this.shape=null;
        this.score=score;
        this.movieName=movieName;
    }
  
    static removeFoundLetter(dupmovieVar,letter) {
        // console.log('***********removeFoundLetter is called***********');

// 32] USING dupmovieVar Array(movieName) look for alphabet entered by user in it. MAKE A NEW ARRAY
// called newmovie AFTER REMOVING THE MATCHED LETTER(alphabet entered by user) FROM THE MOVIENAME FOR FURTHER SEARCH.
        dupmovieVar=dupmovieVar.split('');
        let newmovie=[];
        for (let i=0; i < dupmovieVar.length; i++) {
            dupmovieVar[i]!=letter ? newmovie.push(dupmovieVar[i]) : ''
        }
        newmovie=newmovie.join('');
        // console.log(`after removing ${letter} the new movie name is ${newmovie}`);
// 33] RETURN THE NEW ARRAY 'newmovie' WITH ANYMORE UNMATCHED LETTERS IN IT. 
        return newmovie;        
    }

    static wrngOption(letterEntered,wrongOptionsId) {
        // console.log('NO MATCH FOR:-'+letterEntered);
        // console.log('wrongOptions'+wrongOptionsId.length);
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
            // console.log('PLAY WRONG OPTION SOUND NOW');
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
        // console.log('status inside printWinMessage:-'+status);

        // console.log('intial fontsize:-'+document.getElementById('PrintStatusCont').style.fontSize);
// 44] IF status ARGUMENT PASSED TO printWinMessage IS win or lose THEN CHANGE THE FONT SIZE OF
// '#PrintStatusCont div' TO 0.3em TO ENABLE THE YOU WON OR YOU LOST ANIMATION.
        if (status=='win' || status=='lose') {
            document.querySelector('#PrintStatusCont div').style.fontSize='0.3em';
            this.printMessage=()=> {
                // console.log('printWinMessage is called now..');
                let font=document.querySelector('#PrintStatusCont div').style.fontSize;
                font=parseFloat(font.slice(0,font.length-2));
                // console.log('font size:-'+font);
                // console.log('status:-'+status);
                if (font <= 1.5) {
                    // console.log('in if block of printWinMessage');
                    font+=0.3;
                    document.querySelector('#PrintStatusCont div').style.fontSize=font+'em';
                    // console.log('new font size:-'+document.querySelector('#PrintStatusCont div').style.fontSize);
                    // console.log('before:-'+document.querySelector('#PrintStatusCont div').innerHTML);
                    status=='lose'? document.querySelector('#PrintStatusCont div').innerHTML="YOU LOST.." :
                    document.querySelector('#PrintStatusCont div').innerHTML="YOU WON..";
                    // console.log('after:-'+document.querySelector('#PrintStatusCont div').innerHTML);
                } else {
// 46] SEND THE WIN LOSE GAME STATUS TO SERVER USING EMTI EVENT.
                    // console.log('in else block of printWinMessage');
                    socket.emit('gameStatus',{
                        scr: status,
                    })
// 48] CLEAR THE INTERVAL STOP THE ANIMATION OF FONT SIZE ONCE FONT-SIZE IS > 1.5          
                    clearInterval(clearInt);
                }
             

            }
    // 45] CALL THE function 'this.printMessage' TO CHANGE THE FONTSIZE EVERY 300 MSEC AND PRINT THE
    // MESSAGE YOU WON OR YOU LOSE.
            let clearInt=setInterval(this.printMessage,300);

        }
    
    }

     checkResult(result,movie,animationCount) {
        // console.log('***********checkresult is called***********');
        // console.log('animationCount:-'+animationCount);
//41] LETTERS ENTERED BY USER IS STORED IN RESULT IS CONVERTED INTO UPPERCASE LETTERS
        result=result.toUpperCase();
        movie=movie.split(' ').join('').toUpperCase();
        // console.log(result+':'+movie);
      
        // console.log('CURRENT SCORE:-'+this.score);
// 42] TO DECIDE WHETHER USER WON a] animationCount IS GREATER THAN 0.AND LENGTH OF MOVIENAME IS SAME AS RESULT (WHICH 
// CONTAINS ALL THE LETTERS ENTERED BY USER). ONE BY ONE EVERY ELEMENT INSIDE RESULT STRING IS MATCHED WITH
// MOVIENAME IF ONE OF IT DOESNT MATCH, USER LOSES. IF ALL OF THEM MATCHES USER WINS.

        if (animationCount > 0) {
            if (result.length===movie.length) {
                for(let i=0;i < result.length; i++) {
                    if(!movie.includes(result[i])) { 
                        // console.log(`${result[i]} didnt match. User will Play next Move`);                
                    }
                }
// 43] IF ALL MATCHES CALL function 'printWinMessage'. CALL THE RIGHT SOUND EFFECTS ACCORDINLY
                HangmanClass.printWinMessage('win');
                document.getElementById('userInpTag').value='HIT START TO PLAY AGAIN'

                HangmanClass.soundEffects('won');
// 49] DISABLE THE BOX 'ENTER TEXT HERE' FOR ANY MORE INPUT BY USER SINCE GAME IS OVER.
                document.getElementById('userInpTag').disabled=true;
// 50] INCREASE THE SCORE BY +10 AND EMIT THE SAME TO SERVER.
                this.score+=10;
                socket.emit('clToSvScr',this.score);

//52] DISPLAY THE SCORE AFTER 1 SEC.                
             setTimeout(()=>{
                    document.querySelector('span').innerHTML=this.score;
                }, 1000);
                console.log('CHANGED SCORE:-'+this.score);
            }
        } else {
// 53] IF ALL CONDITION IN 42 STEP FAILS, KILL THE USER.
            HangmanClass.soundEffects('kill');
            // console.log('NO OF CHANCES ARE EXHAUSTED...CALLING printMessage AFTER THIS');
// 54] CALL function 'printWinMessage' WITH STATUS LOSE AND WITH THE UNCHANGED SCORE.
            HangmanClass.printWinMessage('lose');
            document.getElementById('mydiv').style.font='2em bold';
            document.getElementById('mydiv').style.fontFamily='ZCOOL KuaiLe, cursive';
            
//55] CHANGED THE FONT SIZE OF mydiv TO BE LIL BIGGER 2em AND PRINT THE MOVINAME SINCE GAME IS OVER
// FOR USER REFERENCE.            
            document.getElementById('mydiv').innerHTML=this.movieName;
            document.getElementById('userInpTag').value='GAME OVER. CLICK START'
           
            document.getElementById('userInpTag').disabled=true;   
            // this.score > 0 ? this.score-=10 : this.score=0;
// 56] EMIT THE UPDATED SCORE TO SERVER
            socket.emit('clToSvScr',this.score);

            setTimeout(()=>{
                document.querySelector('span').innerHTML=this.score;
            }, 1000);
            // console.log('CHANGED SCORE:-'+this.score);
           
        }
    }

    animation(shape=this.shape,whichShape=this.shapeArr.length) {
        // console.log('*********animation is called*********');
        let myCanvas=document.getElementById('myCanvas');
        // console.log('shape now:-'+shape+' WHICHSHAPE:-'+whichShape+' ..mycanvas id:-'+ myCanvas);

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
                        // console.log('HEAD');
                } else if(shape=='Body') {
                            ctx.moveTo(50,90);
                            ctx.lineTo(50,400);
                            ctx.stroke();
                            // console.log('BODY');
                } else if (shape=='LeftLeg') {
                            ctx.moveTo(50,400);
                            ctx.lineTo(10,500);
                            ctx.stroke();
                            // console.log('LEFT LEG');
                } else if (shape=='RightLeg'){
                            ctx.moveTo(50,400);
                            ctx.lineTo(90,500);
                            ctx.stroke();
                            // console.log('RIGHT LEG');
                } else if (shape=='LeftHand') {
                            // console.log('BOTH HANDS NOW');
                            ctx.moveTo(50,350);
                            ctx.lineTo(0,350);
                            ctx.stroke();

                            ctx.moveTo(50,350);
                            ctx.lineTo(100,350);
                            ctx.stroke();
                } else if (shape=='Kill') {
                            // console.log('KILLING NOW');
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
                // console.log('myCanvas element inside AnimationArea missing');
        }
    }

// 15] hangman.start() IS CALLED
    
     start() {

        // console.log('***************** NEW GAME **********************');

// 16] FETCHING ONE RANDOM MOVIE FROM THE MOVIENAME VARIABLE WHICH CONTAINS NAME OF ALL MOVIES.

        this.movieName=this.movieArr[Math.floor(Math.random()*this.movieArr.length-1)].trim();

//17] shapeArr IS INSTANTIATED WHICH CONTAINS WHICH HANGMAN ANIMATION TO CALL WHEN USER MISSES A MOVE.

        this.shapeArr=['Head','Body','LeftLeg','RightLeg','LeftHand','Kill'];

// 17] MAKING THE CONTENTS OF '#PrintStatusCont div' TO NULL FROM HANGMAN CHALLENGE AS SET IN INDEX.JS EARLIER.
        document.querySelector('#PrintStatusCont div').innerHTML='';
        document.querySelector('#PrintStatusCont div').style.fontSize='1.5em';

// 18] INSTANTIATING rightOptionMsg ARRAY WHICH CONTAINS ALL THE MESSAGES TO BE DISPLAYED WHEN USER MOVE
// IS CORRECT.
        let rightOptionMsg=['KYA BAAT HAI','SUPER MACHA','KEEP GOING','EK NUMBER','TUSSI CHA GAYE','GAMER ON FIRE', 'TUMBA CHENNAGIDE','KHUB BHALO', 'BAHU SARAS'];
        const AnimationArea=document.getElementById('AnimationArea');

//19] INTIALISING THE 'AnimationArea' DIV FOR THE HANGMAN ANIMATION USING CANVAS.
        AnimationArea.innerHTML='<canvas id="myCanvas" width= "280" height = "580"> </canvas>'

// 20] ANIMATION FUNCTION IS CALLED NOW.
        this.animation(null);
        let result='';

        let dupmovieVar=this.movieName;

        wm.set(this,()=>{
            //22] CREATING A TEXTBOX INSIDE 'userInpDiv' CALLED 'userInpTag' WHERE USER CAN ENTER THE TEXT.
            document.getElementById('userInpDiv').innerHTML='<input type="text" maxlength="1" id="userInpTag" \
            style="color: white;  \
            text-align: center;" placeholder="GUESS THE MOVIE">'

            const inputTags=[];
            const wrongOptions=[];
            const wrongOptionsId=[];
            // 23] THE MOVIENAME array WHICH CONTAINS NAME OF A MOVIE {INCLUDING SPACES} IS USED TO MAKE SAME AMOUNT
            // OF TEXTBOXES IN THE FORM OF inputTags and wrongOptions. ALSO THE NAME OF MOVIE IS SPLIT INTO ALPABETS
            // AND THOSE ALPHABETS ARE ASSIGNED TO EVERY TEXTBOX INSIDE inputTags array WHICH IS LATER ASSIGNED
            // TO DIV 'mydiv'


            this.movieName.split('').forEach((v,ind)=>{
                v != ' ' ? inputTags.push(`<input disabled id=${v.toUpperCase()} style="color: white; background-image: url('brick-black-wallpaper.jpg'); width: 30px; height: 30px; font-size: 1.5em; text-align: center;" maxlength="1">`) : inputTags.push('&nbsp&nbsp');
                v != ' ' ? wrongOptions.push(`<span id=${ind} maxlength="1" style="margin-left: 20px; text-align: center; display: inline;"></span>`): '';
                v != ' ' ? wrongOptionsId.push(ind): '';
            })
            // console.log('inputTags:-'+inputTags );
            const userInput=[];
            // console.log(':'+wrongOptions);
            //24] THE WRONGOPTIONS ARRAY WHICH CONTAINS SAME AMOUNT OF SPAN TAGS AS THE NO OF LETTERS IN THE MOVIENAME IS
            // CREATED INSIDE DIV 'WrongOptions'
            document.getElementById('WrongOptions').innerHTML=wrongOptions.join('');
            document.getElementById('mydiv').style.font='';

            //25] THE inputTags ARRAY WHICH CONTAINS SAME AMOUNT OF textboxes TAGS AS THE NO OF LETTERS IN THE MOVIENAME IS
            // CREATED INSIDE DIV 'mydiv'.

            document.getElementById('mydiv').innerHTML=inputTags.join('');

            //26] THE FUNCTION RETURNS the 'wrongOptionsId' ARRAY WHICH CONTAINS INDEXS OF moviename;
            return wrongOptionsId;

        })

        //21] CALLING THE WEAKMAP FUNCTION WITH ONE MOVIENAME AS AN ARGUMENT TO CREATE TEXTBOXES 
        // WHERE USER CAN ENTER THE ALPHABET's
        // AND SAME BEING DISPLAYED ON MATCH OR NO MATCH ON THE UI IN THEIR RESPECTIVE PLACES/DIV's
        let wrongOptionsId=wm.has(this)? wm.get(this): console.log('NOT ABLE TO CREATE TAGS');
        wrongOptionsId=wrongOptionsId();

        let keyDwnFunc=((e)=>{
                e.target.value=e.target.value.toUpperCase();

                // 28] alphabet entered by user is stored and made an ID with the same alphabet name. eg:-#A, #X.
                let idName='#'+e.target.value;

        // 29] dupMovieVar is duplicate value of this.moviename to preserve this.movieName for comparision purposes.

        //30] if dupMovieVar(movieName) includes the alphabet entered by user, find all the id set in step 23 and 
        // mark the value of all those tags which has same ID'S as the alphabet entered by user. The value marked
        // will have a] new ID to some random value(here no 9, #9) to take it out of search process. b] ALL the textboxes
        // tag will be displayed with alphabet entered by user. result is a string which contains all the LETTERS
        // ENTERED BY USER.

                if (dupmovieVar.includes(e.target.value)) {
                        document.querySelectorAll(idName).forEach((v)=>{
                            v.value=e.target.value;
                            v.id='9';
                            result+=e.target.value;
                        }) 
// 31] Call removeFoundLetter FUNCTION with alphabet entered by user and moviename. dupmovieVar becomes 'newmovie'
// as in STEP 33]
                    dupmovieVar=HangmanClass.removeFoundLetter(dupmovieVar,e.target.value);
//34] SINCE ITS MATCH AS PER STEP 30, DISPLAY ONE OF THE RANDOM TEXT FROM ARRAY rightOptionMsg inside
// '#PrintStatusCont div'
                    // console.log('rightOptionMsg1.:-'+ rightOptionMsg[Math.floor(Math.random()*rightOptionMsg.length)]);
                    document.querySelector('#PrintStatusCont div').style.fontSize='1.5em';
                    document.querySelector('#PrintStatusCont div').innerHTML= rightOptionMsg[Math.floor(Math.random()*rightOptionMsg.length)];

//35] ENABLE THE SOUNDEFFECTS BY CALLING soundEffects FUNCTION FOR THE RIGHT OPTION.
                    HangmanClass.soundEffects('right');

                    } else {
//36] CALL THE wrngOption function when movieName doesnt include the ALPHABET ENTERED BY USER.
                        HangmanClass.wrngOption(e.target.value,wrongOptionsId);
//37] SINCE THE LETTER ENTERED BY USER IS WRONG DONT DISPLAY ANY MESSAGE IN THE '#PrintStatusCont div'
                        document.querySelector('#PrintStatusCont div').innerHTML='';
//38] CALL THE HANGMAN ANIMATION TO KILL ONE BODY PART NOW AND THEN CALL THE WRONG OPTION SOUNDEFFECT.
                        if(this.shapeArr.length>0) {
                            this.shape=this.shapeArr.shift();
                            this.animation(this.shape,this.shapeArr.length);  
                            HangmanClass.soundEffects('wrong');
                        } 
                    }
// 39] MAKE THE TEXTBOX 'ENTER TEXT HERE' BLANK AGAIN FOR USER TO ENTER NEW LETTER.
                    e.target.value='';       
                    
// 40] CALL THE FUNCTION checkResult WITH THE result,moviename and NO OF OPTIONS LEFT BEFORE THE
// FINAL KILL EVENT.
                    this.checkResult(result,this.movieName,this.shapeArr.length);
            })

    // 27] Attach a keyDwnFunc on 'userInpTag' which will have the alphabets entered by user.
            document.getElementById('userInpTag').addEventListener('input',keyDwnFunc);   
    }

}

let wm=new WeakMap(); 


