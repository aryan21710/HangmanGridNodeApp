// io will make the web socket connection open between server and will
// let us have bi-directional communication.
const socket=io();
// DONT USE ARROW FUNCTION AS THE ES6 FEATURES MIGHT NOT BE 
// COMPATIBLE WITH MOBILE BROWSER ON MOBILE PHONE. INSTEAD
// USE NORMAL ES5 FUNCTION SYNTAX.
    socket.on('connect',()=> {
    //console.log('CONNECTED TO SERVER');
    socket.on('disconnect',()=> {
        //console.log('DISCONNECTED TO SERVER');
    });
});

socket.on('topScorers',(topScorers)=>{
    //console.log('topScorers on client:-'+topScorers);
    document.getElementById('TopUserText').innerHTML='TOP SCORERS:-' + topScorers;
})


socket.on('sendMovieList',(obj)=>{
    //console.log('sendMovielist received on client..:-'+obj.scr+':'+obj.movieName+':'+obj.movieName.length);
    const hangman=new HangmanClass(obj.movieName,undefined,obj.scr,undefined);
    hangman.start();
    
})


function enterNameAnimation() {
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

}

function movieType(event) {
    //console.log('inside movieType:-');
    event.preventDefault();
    //console.log(event.target.value);
    socket.emit('movieType',event.target.value);
    setTimeout(()=>{
        document.getElementById('QuizArea').innerHTML='';
        document.getElementById('QuizArea').innerHTML='<audio id="audio" autoplay=""><source src="" type="audio/mpeg"> </audio><div id="WrongOptions"></div><div id="mydiv"></div><div id="userInpDiv"></div>'
        document.querySelector('#PrintStatusCont div').innerHTML='CLICK START';
        document.getElementById('startBtn').disabled=false;
        document.getElementById('startBtn').style.color='white';
    },10)
}

function userOptionsInit(event) {   
        const username=[];
        //console.log('inside:-userOptionsInit:-');
        event.preventDefault();
        document.getElementById('userInpTag').addEventListener('keypress',(event)=>{
            //console.log('event.keyCode:-'+event.keyCode);
            event.keyCode==13? event.preventDefault() : "";
        })
        //console.log(event.target.value);
        username.push(event.target.value);

        username.forEach((v)=>{
            //console.log('emitting:-'+v);
            socket.emit('userName',v);
        }); 
        document.querySelectorAll(".movieType").forEach((v)=>{
            v.style.color='white';
            v.disabled=false;
        })  
}


function clicked() {
    //console.log('IN INDEX.JS. USER CLICKED START. EMITTING startBtnClicked NOW')
    socket.emit('startBtnClicked',true);
}
