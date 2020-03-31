window.onload = ()=>{
    const {ipcRenderer} = require('electron');
    const BrowserWindow = require('electron').remote.BrowserWindow;
    const Timer = require('timer.js');
    const fs = require('fs');
    const dialog = require('electron').remote.dialog;

    const btn  = document.querySelector('#btn');
    const timeContainer =document.getElementById('time-container');
    const input = document.getElementById('input');
    
    const player = document.getElementById('music');
    window.alert(input);
    let workTimeCounter = 0;
    let timeToWork;
    let workState = false;

    btn.onclick = ()=>{
        timeToWork =  input.value;
        startWork(timeToWork);
    }

    function startWork(){
        workState = true; //开始工作
       
        let workTimer = new Timer({
            ontick: (ms) =>{
                updateTime(ms);
            },
            onend: ()=>{
                workState = false;
                player.play();
                timeContainer.innerHTML = '';
                notification();
            }
        })
        if(timeToWork === undefined){
            window.alert('time undefined');
            return;
        }
        workTimer.start(timeToWork);
    }

    function updateTime(ms) {
    let timeContainer = document.getElementById('time-container');
    let s = (ms/1000).toFixed(0);
    let ss = (s%60);
    let min = (s/60).toFixed(0);
    timeContainer.innerText = `${min.toString().padStart(2,0)}: ${ss.toString().padStart(2,0)}`
    
    }

    async function notification(){
        let res = await ipcRenderer.invoke('work-notification');
        if(res === 'rest'){
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
            },5*1000)
        }else if(res === 'work'){
            startWork()
        }
    }
    
}






