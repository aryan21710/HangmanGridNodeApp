// io will make the web socket connection open between server and will
// let us have bi-directional communication.
const socket=io();
const s='i am passed from client to server';
// DONT USE ARROW FUNCTION AS THE ES6 FEATURES MIGHT NOT BE 
// COMPATIBLE WITH MOBILE BROWSER ON MOBILE PHONE. INSTEAD
// USE NORMAL ES5 FUNCTION SYNTAX.
    socket.on('connect',()=> {
    console.log('CONNECTED TO SERVER');
    socket.on('disconnect',()=> {
        console.log('DISCONNECTED TO SERVER');
    });
});
// socket.on('sendMovieList',x);
var m=[];
socket.on('sendMovieList',function(movieArr) {
        m.push(movieArr);
});

function clicked() {
    console.log('IN INDEX.JS. USER CLICKED START. EMITTING startBtnClicked NOW')
    socket.emit('startBtnClicked',true);
}


socket.on('sendMovieList',(obj)=>{
    // console.log('sendMovielist received on client:-'+obj.scr+':'+obj.movieName);
    const hangman=new HangmanClass(obj.movieName,undefined,obj.scr,undefined);
    hangman.start();
})




       