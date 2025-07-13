const Room = require("../models/roomModel");
const { v4: uuidv4 } = require('uuid');

const addNewRoom = async (req,res,next) => {
    let roomId, password;
    while(1){
        roomId = (Math.floor(100000 + Math.random() * 900000)).toString(); 
        password = (Math.floor(1000 + Math.random() * 9000)).toString();
        const val = await Room.findOne({roomId});
        if(!val)break;
    }
    const uuid = uuidv4();
    await Room.create({'roomId':roomId,'uuid':uuid,'password':password});
    res.status(200).json({
        'created':'true',
        'roomId':roomId,
        'uuid':uuid,
        'password':password
    });
}


const verfityCredentials = async (req,res,next) =>{
    const {roomId,password} = req.body;
    if(!roomId || !password){
        return res.status(401).json({ success: false, message: 'both fields are required' });
    }
    const data = await Room.findOne({roomId});
    if(!data){
        return res.status(401).json({ success: false, message: 'room id doesnt exists' });
    }
    if(password === data.password){
        return res.status(200).json({ success: true, message: 'Entered successfully' , uuid : data.uuid });   
    }
    else{
        return res.status(200).json({ success: false, message: 'wrong password' });   
    }
}

module.exports = {addNewRoom,verfityCredentials};