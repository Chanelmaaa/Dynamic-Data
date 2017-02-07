var num = 100;
var num1 = 1;
var word = "hello";
var word1 = "goodbye";


document.getElementById("box1").style.fontSize = "50px";

document.getElementById("box2").style.fontSize = "50px";

document.getElementById("box4").style.fontSize = "50px";
document.getElementById("box5").style.fontSize = "50px";

var box3 = document.getElementById("box3");
box3.style.display = "none";

changeBackgroundColor("box4", "rebeccapurple");
changeBackgroundColor("box5", "Grey");


addElement();

function changeBackgroundColor(id, color) {
    var currentId = document.getElementById(id);
    currentId.style.backgroundColor = color;
}

function changeText() {
    var h1List = document.getElementsByTagName("H1");
    console.log(h1List.length);
    h1List[0].innerHTML = "Smile";
}

function mDown(obj) {
    obj.style.backgroundColor = "orange";
    obj.innerHTML = "Power";
}

function mUp(obj) {
    obj.style.backgroundColor = "rebeccapurple";
    obj.innerHTML = "Gentle";
}

function mOver(obj) {
    obj.innerHTML = "Fun";
}

function mOut(obj) {
    obj.style.backgroundColor = "yellowgreen";
    obj.innerHTML = "And More Fun";
}


