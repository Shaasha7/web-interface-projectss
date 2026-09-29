let count =
localStorage.getItem("counter")
?
Number(localStorage.getItem("counter"))
:
0;

let logs=[];
const display =
document.getElementById("count");
function updateUI(){
display.innerHTML=count;
localStorage.setItem(
"counter",
count
);

let degree=count*10;
document.getElementById("circle")
.style.background=
`
conic-gradient(
cyan ${degree}deg,
rgba(255,255,255,.2)
${degree}deg
)
`;


}
function increase(){
let step =
Number(
document.getElementById("step").value
);
count += step;
addHistory(
"Added +"+step
);
updateUI();
}

function decrease(){
let step =
Number(
document.getElementById("step").value
);
count -= step;
addHistory(
"Removed -"+step
);
updateUI();
}

function resetCounter(){
count=0;
addHistory(
"Counter Reset"
);
updateUI();
}

function addHistory(action){
let time =
new Date()
.toLocaleTimeString();
logs.unshift(
time+" : "+action
);


document.getElementById("history")
.innerHTML=
logs.join("<br>");
}
document.addEventListener(
"keydown",

function(event){
if(event.key=="+")
increase();
if(event.key=="-")
decrease();
if(event.key=="r" ||
event.key=="R")
resetCounter();

});

setInterval(()=>{
document.getElementById("time")
.innerHTML=
"🕒 "+
new Date()

.toLocaleString();
},1000);
updateUI();