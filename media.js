let video = document.querySelector('video')
video.addEventListener('ended', function(e){
    e.stopImmediatePropagation()
    n.stop()
    
   }, {
    capture:true
})
let n = new MediaRecorder(video.captureStream(), {
    mimeType:'video/mp4'
})
while(true)try {
    video.currentTime = 0
    n.start()
    break
}
catch {
await new Promise(queueMicrotask)
}
n.addEventListener('dataavailable', function(e) {
    debugger
    download(URL.createObjectURL(e.data))
})
function download(blob) {
    let n =document.createElement('a')
    n.setAttribute('href', blob)
    n.setAttribute('download','video.mp4')
    n.click()
}