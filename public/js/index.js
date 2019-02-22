// io will make the web socket connection open between server and will
// let us have bi-directional communication.
const socket=io();
// DONT USE ARROW FUNCTION AS THE ES6 FEATURES MIGHT NOT BE 
// COMPATIBLE WITH MOBILE BROWSER ON MOBILE PHONE. INSTEAD
// USE NORMAL ES5 FUNCTION SYNTAX.

// 1b] LET THE CLIENT CONNECT TO THE SERVER USING SOCKET connect METHOD. AND ONCE THE CLIENT IS
// CONNECTED AND WEBPAGE IS READY ON THE LANDING PAGE DISPLAY HANGMAN CHALLENGE IN THE #PrintStatusCont div
    socket.on('connect',()=> {
    console.log('CONNECTED TO SERVER');
    document.querySelector('#PrintStatusCont div').innerHTML='THE HANGMAN CHALLENGE'
    socket.on('disconnect',()=> {
        console.log('DISCONNECTED TO SERVER');
    });
});

// 8] TOPSCORE WILL BE RECEIVED BY CLIENT IN THE FORM OF STRING 'topScorers'.


socket.on('topScorers',(topScorers)=>{
    console.log('topScorers on client:-'+topScorers);
// 9] THE TOPSCORER STRING WILL BE DISPLAYED INSIDE THE DIV 'TopUserText' NOW.
    document.getElementById('TopUserText').innerHTML='TOP SCORERS:-' + topScorers;
})




// 1] BODY ONLOAD enterNameAnimation FUNCTION IS CALLED WHEN HTML PAGE IS LOADED;

// 2] SET THE ANIMATION TO BE BLINKING ON DIV 'userInpTag' WHERE USERNAME IS ENTERED BY USER.
let enterNameAnimation=(function() {
    let cnt=0;
    let countdown=setInterval(()=>{
        if (cnt % 2==0 && cnt < 10) {
           document.getElementById('userInpTag').style.border='5px groove black';
        } else if (cnt % 2!=0 && cnt < 10) {
            document.getElementById('userInpTag').style.border='';
        } else {
            clearInterval(countdown);
        }
        cnt++;
    },100);

}())

// 3] THE USERNAME ENTERED IN HTML PAGE WILL ATTACH KEYPRESS EVENT on 'userInpTag' WHICH WILL STORE THE 
// VALUE OF 'username'
function userOptionsInit(event) {   
    const username=[];
    console.log('inside:-userOptionsInit:-');
    event.preventDefault();
    document.getElementById('userInpTag').addEventListener('keypress',(event)=>{
        console.log('event.keyCode:-'+event.keyCode);
        event.keyCode==13? event.preventDefault() : "";
    })
    console.log(event.target.value);
    username.push(event.target.value);

// 4] THE ENTERED USERNAME WILL BE EMITTED BY CLIENT TO SERVER.
    username.forEach((v)=>{
        console.log('emitting:-'+v);
        socket.emit('userName',v);
    }); 

// 5] THE movieOptionAnimation FUNCTION WILL BE CALLED ONCE USERNAME IS ENTERED AND EMITTED TO SERVER
// WHICH WILL HAVE A BLINKING EFFECT ON THE TWO BUTTONS BOLLYWOOD AND HOLLYWOOD.
    movieOptionAnimation();

// 7] ONCE USERNAME IS ENTERED AND EMITTED THE HOLLWOOD/BOLLYWOOD BUTTONS WILL BE ENABLED FOR USER
// TO CLICK ON THEM
    document.querySelectorAll(".movieType").forEach((v)=>{
        v.style.color='white';
        v.disabled=false;
    })  
}


// 6] movieOptionAnimation FUNCTION CODE EXECUTED.
function movieOptionAnimation() {
    console.log('INSIDE movieOptionAnimation FUNCTION INSIDE INDEX.JS');
    let cnt=0;
    
        
            let countdown=setInterval(()=>{
                if(document.querySelector('#bollywood')!=null) {
                        if (cnt % 2==0 && cnt < 16) {
                    
                            document.querySelector('#bollywood').style.border='2px groove black';
                            document.querySelector('#hollywood').style.border='2px groove black';
                
                        } else if (cnt % 2!=0 && cnt < 16) {
                            document.querySelector('#bollywood').style.border='';
                            document.querySelector('#hollywood').style.border='';
                
                        } else {
                            clearInterval(countdown);
                        }
                        cnt++;
                } else {
                    clearInterval(countdown);
                }
             },100);
        
}


// 7] THE MOVIETYPE CLICKED AND SELECTED BY USER IS EMITTED TO SERVER BY CLIENT. AND START BUTTON TO
// PLAY THE GAME IS ENABLED FOR USER.
function movieType(event) {
    console.log('inside movieType:-');
    event.preventDefault();
    console.log(event.target.value);
    socket.emit('movieType',event.target.value);
    setTimeout(()=>{
        document.getElementById('QuizArea').innerHTML='';
        document.getElementById('QuizArea').innerHTML='<audio id="audio" autoplay=""><source src="" type="audio/mpeg"> </audio><div id="WrongOptions"></div><div id="mydiv"></div><div id="userInpDiv"></div>'
       
        clickStartAnimation();
        document.getElementById('startBtn').disabled=false;
        document.getElementById('startBtn').style.color='white';
    },10)
}

// 8] THE FUNCTION CLICK START ANIMATION IS STARTED AFTER MOVIETYPE IS SELECTED BY USER.
function clickStartAnimation() {
    console.log('INSIDE clickStartAnimation FUNCTION INSIDE INDEX.JS');
    let cnt=0;
    document.querySelector('#PrintStatusCont div').style.fontSize='1.5em';
    document.querySelector('#PrintStatusCont div').innerHTML='CLICK START';
    let countdown=setInterval(()=>{
        if (cnt % 2==0 && cnt < 14) {
            document.querySelector('#PrintStatusCont div').style.opacity='1';

        } else if (cnt % 2!=0 && cnt < 14) {
            document.querySelector('#PrintStatusCont div').style.opacity='0';

        } else {
            document.querySelector('#PrintStatusCont div').style.opacity='1';

            document.querySelector('#PrintStatusCont div').style.fontSize='';
            document.querySelector('#PrintStatusCont div').innerHTML='';
            clearInterval(countdown);
        }
        cnt++;
    },100);


}

// 11] THE MOVIENAME STRING WHICH CONTAINS NAMES OF ALL MOVIES IS RECEIVED BY CLIENT AND STORED IN VARIABLE CALLED
// OBJ
socket.on('sendMovieList',(obj)=>{
// 12] THE OBJ RECEIVED CONTAINS INTIAL SCORE WHICH 0, LIST OF ALL THE MOVIES AND NO OF MOVIES SENT BY USER.

    console.log('sendMovielist received on client..:-'+obj.scr+':'+obj.movieName+':'+obj.movieName.length);
// 13] AN OBJECT 'hangman' IS MADE OUT OF 'HangmanClass' WITH VARIABLES PASSED AS INTIAL SCORE WHICH 0, LIST OF ALL THE MOVIES 
// AND NO OF MOVIES SENT BY USER
    const hangman=new HangmanClass(obj.movieName,undefined,obj.scr,undefined);

// 14] hangman.start() function IS CALLED WHICH SETUPS THE GAME FOR USER.
    hangman.start();
    
})





function clicked() {
    console.log('IN INDEX.JS. USER CLICKED START. EMITTING startBtnClicked NOW')
    socket.emit('startBtnClicked',true);
}
