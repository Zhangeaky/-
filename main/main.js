const {app, BrowserWindow, Notification, ipcMain,dialog} = require('electron');

let win 
app.on('ready', ()=> {
    win = new BrowserWindow({
        width: 1300,
        height:1300,
        webPreferences:{
            nodeIntegration: true
        }
    })
    win.webContents.openDevTools();
    win.loadFile('./view/index.html');
    handleIPC();
})
app.on('closed',()=>{
    win = null;
});


function handleIPC(){
    ipcMain.handle('work-notification',async function () {
        let res = await new Promise((resolve, reject) => {
        dialog.showMessageBox({
                title:'Timer is out',
                type:'info',
                buttons:['休息','继续干活']
            }).then((result)=>{
                if(result.response === 0){
                    resolve('rest');

                }else if(result.response === 1){
                    resolve('work');
                }
            });
    })
    return res
    })
}
    


  



