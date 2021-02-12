const root = document.querySelector('.root');
const needle = document.querySelector('.needle');
const btnStart = document.querySelector('.button');
const btnOK = document.querySelector('.restart');
const results = document.querySelector('.results');
const burst = document.querySelector('.burst');
const departed = document.querySelector('.departed');

let mainElems= {
    start: 0
    ,plus: 0
    ,min: 0
    ,checher: false
    ,ind: 0
    ,windsDirecition: false
}


function movementCreator(code){

   if(motionCheck(code))
        needle.style.left = code == "KeyA"? needle.offsetLeft - 10 +"px" : needle.offsetLeft + 10 +"px";
 
}

function motionCheck(code){
    let cutout = false
    
    if(needle.offsetLeft-10>root.offsetLeft && code == "KeyA" ){
        cutout = !cutout;
    }else if(needle.offsetLeft+10<root.offsetLeft+root.offsetWidth && code == "KeyD"){
        cutout = !cutout;
    }

    return cutout;
}



function connectionCheck() {
    let arr = document.querySelectorAll('.ballon')
    
    arr.forEach((e)=>{
        if(e.offsetTop+e.offsetHeight <0){//удаление улетевших шаров
            e.remove()
            mainElems.min++;
        }else if(e.offsetTop <= needle.offsetHeight&&needle.offsetHeight-14<=e.offsetTop){//проверка шаров на протыкание иглой
            if(needle.offsetLeft>e.offsetLeft&&needle.offsetLeft<(e.offsetLeft+e.offsetWidth)){
                e.remove()
                mainElems.plus++;
            }
        }

    })
}

function balloonsCreator() {

    
    let timer = 1200 -(Date.now()- mainElems.start)/100 //увеличение количества шаров со временем

    let balloonsTimer = setInterval(()=>{
        let elem = ballDraw()               // создание нового шарика
        root.appendChild(elem.ball);
        balloonMove(elem)
        mainElems.windsDirection = !!Math.round(Math.random())//изменение направления дыижения ветра 
    }, timer)

    setTimeout(() => { 
        clearInterval(balloonsTimer); 
        if(mainElems.ind<5){
            balloonsCreator();
        } mainElems.ind++;}, 10000);
}


function ballDraw(){ //отрисовка шара и его параметров
    let size = Math.floor(20 + Math.random()*40)
    let ball = document.createElement('div');
    let speed = 4 + Math.floor((Math.random()*8))

    ball.classList.add(`ballon`);
    ball.style.height = Math.floor(1.3*size) + "px";
    ball.style.width = size + "px";
    ball.style.backgroundColor = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
    ball.style.left = root.offsetLeft  + (Math.floor(Math.random() *( root.offsetWidth - size))) + "px"
    ball.style.top  = root.offsetHeight - size + "px"

    let ballElem = {
        ball,
        mSpeed: speed,
    }
    
    return ballElem;
}


function balloonMove(element) {

    const { ball, mSpeed } = element;
    let mooov = setInterval(() => {
        
        ball.style.top = ball.offsetTop - mSpeed+'px'//двидение шариков вверх

        if(mainElems.windsDirection&&(ball.offsetLeft-root.offsetLeft)<=root.offsetWidth){//движение шариков под действием ветра
            ball.style.left = ball.offsetLeft + Math.round((root.offsetWidth +root.offsetLeft - ball.offsetLeft)*0.01) +'px'
        }else if(ball.offsetLeft>root.offsetLeft){
            ball.style.left = ball.offsetLeft - Math.round((ball.offsetLeft*0.01)) +'px'
        }

        connectionCheck()
    }, 100);


    setTimeout(() => { 
        clearInterval(mooov);
        theEnd();
    }, 60000-(Date.now()-mainElems.start));    //остановка в конце всех шаров одновременно 

}

function resultCheck(){

    burst.textContent = `Лопнувших: ${mainElems.plus}`;
    departed.textContent = `Улетевших: ${mainElems.min}`;
}

function theEnd(mass){
    document.querySelectorAll('.ballon').forEach((e)=>{ //конец игры, все шарики вместе поднимаются вверх
        setInterval(() => {
            e.style.top = e.offsetTop - 6+'px';
            connectionCheck();
        }, 100);

    })
    resultCheck()
    results.style.display = "flex";
    // mainElems.checher = !mainElems.checher
        
    
}

btnOK.addEventListener('click',()=>{results.display = "none"})

btnStart.addEventListener('click', ()=>{//Прослушивает событие нажатия мышкой на кнопку и запускает таймер 

    if(!mainElems.checher){ // проверка на уже запушенный таймер
        mainElems.start = Date.now();
        mainElems.checher = !mainElems.checher;
        balloonsCreator();
   }
})
    
window.addEventListener('keydown', (e)=>{//Прослушивает событие нажатия клавиатуры. Латинскими клавишами "A" и "D" управляется игла. 
    
   
    if(e.code == "Space" && !mainElems.checher){ //"Space" - запускает таймер. Проверка на уже запушенный таймер
        mainElems.start = Date.now();
        mainElems.checher = !mainElems.checher;

        balloonsCreator();
   }
    movementCreator(e.code)

})

    

