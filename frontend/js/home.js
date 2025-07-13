
(() =>{

const joinButton = document.getElementById('joinbtn');
const createButton = document.getElementById('createRoomBtn');

function getUserMedia(){
    navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true,
    }).then((mediaStream) => {
        window.stream = mediaStream;
        console.log("got stream");
    }).catch((err) => {
        alert("media permissions are needed for joining room");
    })
}

getUserMedia();

joinButton.addEventListener('click' , async (e) => {
    e.preventDefault();
    const roomId = document.getElementById('roomId').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    if(!window.stream){
        alert("Please reset permissions.");
        getUserMedia();
        return;
    }
    if(!username){
        return alert("Username Required");
    }
    try{
        const res = await fetch('http://localhost:5000/api/verify',{
            method : "POST",
            headers : {
                "Content-type" : "application/json",
            },
            body: JSON.stringify({roomId, password })
        })
        const data = await res.json();
        // console.log(data);
        if(!res.ok){
            return alert(data.message||"Joining Failed");
        }
        window.roomId = roomId;
        window.password = password;
        window.username = username;
        document.getElementById('roomId').value = "";
        window.location.hash = `/room/${data.uuid}`;
    }catch(err){
        alert("Something went Wrong");
    }
})

createButton.addEventListener('click' , async () => {
    const div = document.getElementById('createRoomDiv');
    const username = document.getElementById('username').value;
    if(!window.stream){
        alert("Please reset permissions.");
        getUserMedia();
        return;
    }
    if(!username){
        return alert("Username Required");
    }
    try{
        const res = await fetch('http://localhost:5000/api/addRoom',{
            method : "POST"
        })
        const data = await res.json();
        window.roomId = data.roomId;
        window.password = data.password;
        window.username = username;
        window.location.hash = `/room/${data.uuid}`;
    }catch(err){
        alert("Something went Wrong");   
    }
})

})();