window.onload = ()=>{
    const {ipcRenderer} = require('electron');
    const BrowserWindow = require('electron').remote.BrowserWindow;
    const Timer = require('timer.js');
    const fs = require('fs');
    const dialog = require('electron').remote.dialog;

    const btn  = document.querySelector('#btn');
    const timeContainer =document.getElementById('time-container');
   
    const player = document.getElementById('player');

    const setH = document.getElementById('hours');
    const setM = document.getElementById('minutes');
    const setS = document.getElementById('seconds');
     
    let workTimeCounter = 0;
    let timeToWork;
    let workState = false;

    btn.onclick = ()=>{
        if(workState == true) return;
        timeToWork =  setH.value*360 + setM.value*6 + setS.value;
        startWork(timeToWork*1000);
    }

    function startWork(){
        workState = true; //开始工作
        let workTimer = new Timer({
            ontick: (sec) =>{
                updateTime(sec);
            },
            onend: ()=>{
                workState = false;
                timeContainer.innerHTML = '';
                notification();
                player.play();
            }
        })
        if(timeToWork === undefined){
            window.alert('time undefined');
            return;
        }
        workTimer.start(timeToWork);
    }

    function updateTime(sec) {
        
        sec = ((sec+1)/1000).toFixed(0);
        console.log(sec);
        let timeContainer = document.getElementById('time-container');
        let h = (sec/3600).toFixed(0);
        console.log('h:'+h)
        let min = ((sec-h*3600)/60-1).toFixed(0);
        let s = sec%60;
        timeContainer.innerText = 
        `${h.toString().padStart(2,0)}:${min.toString().padStart(2,0)}:${s.toString().padStart(2,0)}`
    }

    async function notification(){
        let res = await ipcRenderer.invoke('work-notification');
        if(res === 'rest'){
            player.pause();
            setTimeout(() =>{
                var note = {
                    title:'小主,该回去工作啦!',
                    body:'一天之计在于晨,加油^_^'
                }
                new window.Notification(note.title,note);
                dialog.showMessageBox({
                    title:'休息结束',
                    type:'info',
                    buttons:['继续休息','干活']
                }).then((result)=>{
                    if(result.response === 0){
                    

                    }else if(result.response === 1){
                        startWork();
                    }
                });
            },5*60*1000)
        }else if(res === 'work'){
            player.pause();
            startWork();
        }
    }
    
}






