// console.log(username,roomId,password,window.stream);



(() => {
    if (!window.stream) {
        window.location.hash = "/";  
        return;
    }
    const socket = io("http://localhost:5000");
    const peer = new Peer();
    const roomId = window.roomId;
    const username = window.username;
    document.getElementById('messageInput').focus();
    let peerId ;

    function addVideo(stream , Id){
        if(document.getElementById(Id)){
            return;
        }
        const videoDiv = document.getElementById('video-container');
        const video = document.createElement('video');
        video.id = Id;
        video.srcObject = stream;
        video.play();
        videoDiv.appendChild(video);
        return video;
    }

    function removeVideo(Id){
        const video = document.getElementById(Id);
        if(video)video.remove();
    }

    function addRoomInfo(){
        roomButton.innerText = `roomId : ${window.roomId}`;
        passwordButton.innerText = `password : ${window.password}`;
    }

    const roomButton = document.getElementById('room-id');
    const passwordButton = document.getElementById('room-password');
    const sendButton = document.getElementById('sendBtn');
    
    addRoomInfo();

    peer.on('open' , (id)=> {
        peerId=id;
        socket.emit('join-room',({roomId,peerId,username}));
        addVideo(window.stream,peerId);
    })

    socket.on('user-connected', ({peerId:destPeerId}) => {
        var call = peer.call(destPeerId,(window.stream));
        call.on('stream' , (stream) =>{
            console.log("new video added")
            const video = addVideo(stream,destPeerId);
        })
        call.on('close' , () =>{
            removeVideo(call.peer);
        })
    })

    peer.on('call' , (call) => {
        call.answer(window.stream);
        let newVideo;
        call.on('stream' , (stream) =>{
            console.log("new video add")
            newVideo = addVideo(stream,call.peer);
        })
        call.on('close' , () =>{
            removeVideo(call.peer);
        })
    })

    document.getElementById('messageInput').addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            sendButton.click();
        }
    })

    sendButton.addEventListener('click' , (e) =>{
        e.preventDefault();
        const message = document.getElementById('messageInput').value.trim();
        if(message.length===0){
            return;
        }
        socket.emit('new-message', ({username,message}));
    })

    socket.on('new-message', ({username:name, message})=> {
        const chatDiv = document.getElementById('chat-messages');
        const chatMessage = document.createElement('div');
        chatMessage.innerText = `${name}: ${message}`;
        chatMessage.style.marginBottom = '7px';
        chatDiv.appendChild(chatMessage);
        document.getElementById("messageInput").value = "";
        document.getElementById("messageInput").focus();
    })

    socket.on('user-disconnected', ({peerId:destPeerId}) => {
        removeVideo(destPeerId);
    })

    const videoButton = document.getElementById('toggleVideo');
    const micButton = document.getElementById('toggleAudio');
    const leaveButton = document.getElementById('leaveRoom');

    videoButton.addEventListener('click', () => {
        const videoTrack = window.stream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        const icon = videoButton.querySelector('i');
        if(icon.classList.contains('fa-video')){
            icon.classList.remove('fa-video');
            icon.classList.add('fa-video-slash');
        }
        else{
            icon.classList.remove('fa-video-slash');
            icon.classList.add('fa-video');
        }
    })

    micButton.addEventListener('click' , () => {
        const AudioTrack = window.stream.getAudioTracks()[0];
        AudioTrack.enabled = !AudioTrack.enabled;
        const icon = micButton.querySelector('i');
        if(icon.classList.contains('fa-microphone')){
            icon.classList.remove('fa-microphone');
            icon.classList.add('fa-microphone-slash');
        }
        else{
            icon.classList.remove('fa-microphone-slash');
            icon.classList.add('fa-microphone');
        }
    })

    leaveButton.addEventListener('click' , () => {
        peer.destroy();
        socket.disconnect();
        window.location.hash = '/';
    })

})();