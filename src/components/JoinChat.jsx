import React, { useState } from 'react';
import chatIcon from "../assets/chat.png";
import toast from 'react-hot-toast';
import { createRoom as createRoomApi } from '../services/RoomService';
import { joinRoom as joinRoomApi } from '../services/RoomService';
import { useNavigate } from 'react-router';
import useChatContext from '../context/ChatContext';

const JoinChat = () => {
    const [details,setDetails] = useState({
        roomId:"",
        userName:""
    });

    function handleInputData(event){
        setDetails({
            ...details,
            [event.target.name]:event.target.value,
        });
    }

    function validateForm(){
        if(details.roomId==="" || details.userName===""){
            toast.error("Invalid Input !!")
            return false;
        }
        return true;
    }

    const {roomId,userName,connected,setRoomId,setUserName,setConnected}=useChatContext();
    const navigate = useNavigate();
    async function joinChat(){
        if(validateForm()){
            //join the chat
            try {
                const room = await joinRoomApi(details.roomId);
                toast.success("Joined..")
                setRoomId(room.roomId)
                setUserName(details.userName)
                setConnected(true)
                navigate("/chat")
                
            } catch (error) {
                if(error.status===400){
                    toast.error(error.response.data)
                }else{
                toast.error("Something went wrong...")}
                console.log(error)
            }
            

        }

    }

    async function createRoom(){
        if(validateForm()){
            //create the room
            console.log(details);
            //call api to create room
            try {

                const response = await createRoomApi(details.roomId);
                console.log(response)
                toast.success("Room Created Successfully !!")

                //set the details to the context
                setRoomId(response.roomId)
                setUserName(details.userName)
                setConnected(true)
                navigate("/chat")
            } catch (error) {
                console.log(error)
                if(error.status===400){
                    toast.error("Room already exists !!")
                }
                console.log("Error in creating room !!")
            }
            
        }

    }

    return (
        // body ka div
        <div className=" min-h-screen flex items-center justify-center">
            {/* room div */}
            <div className=" p-8 dark:border-gray-700 border flex flex-col gap-5 w-full max-w-md rounded dark:bg-gray-900 shadow">
                {/* chat Icon div */}
                <div className="w-20 mx-auto">
                    <img src={chatIcon}></img>
                </div>
                <h1 className="text-2xl font-semibold text-center">Join Room / Create Room</h1>
                {/* enter your name */}
                <div>
                    <label htmlFor="name" className="block mb-2 font-medium">Your Name</label>
                    <input type="text"
                        onChange={handleInputData}
                        value={details.userName}
                        name="userName"
                        id="name"
                        placeholder="Enter your name..."
                        className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:border-none focus:right-5"
                    />
                </div>
                {/* enter your roomid */}
                <div>
                    <label htmlFor="roomId" className="block mb-2 font-medium">Enter Room Id / Create Room Id</label>
                    <input type="text"
                        name="roomId"
                        onChange={handleInputData}
                        value={details.roomId}
                        id="roomId"
                        placeholder="Enter your unique room Id..."
                        className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:border-none focus:right-5"
                    />
                </div>
                {/* buttons */}
                <div className="flex justify-center gap-2">
                    <button onClick={joinChat} className="px-4 py-2 rounded-lg dark:bg-blue-500 dark:hover:bg-blue-800">Join Room!</button>
                    <button onClick={createRoom} className="px-4 py-2 rounded-lg dark:bg-orange-500 dark:hover:bg-orange-800">Create Room!</button>

                </div>
            </div>

        </div>
    );
};

export default JoinChat;