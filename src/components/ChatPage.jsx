import React, { useEffect, useRef, useState } from 'react';
import { MdAttachFile, MdSend } from 'react-icons/md';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { baseURL } from '../config/AxiosHelper';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessagesApi } from '../services/RoomService';
import { timeAgo } from '../config/Helper';


const ChatPage = () => {
    const { roomId, userName, connected, setConnected, setRoomId, setUserName } = useChatContext();

    const navigate = useNavigate();
    useEffect(() => {
        if (!connected) {
            navigate('/')
        }
    }, [roomId, userName, connected])

    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);

    //page init:
    // message ko load krna hoga
    useEffect(() => {
        async function loadMessages() {
            try {
                const messages = await getMessagesApi(roomId);
                setMessages(messages);

            } catch (error) {

            }
        }
        if(connected){

            loadMessages();
        }
    })

    //stompClient ko initialize 
    //subscribe
    useEffect(() => {
        //stomp client
        const connectWebSocket = () => {
            //sockjs
            const socket = new SockJS(`${baseURL}/chat`);

            const client = Stomp.over(socket);

            client.connect({}, () => {

                setStompClient(client);
                toast.success("connected");

                client.subscribe(`/topic/room/${roomId}`, (messages) => {
                    const newMessages = JSON.parse(messages.body);
                    setMessages((prev) => [...prev, newMessages]);
                })


            });


        };
        if (connected) {

            connectWebSocket()
        }

    }, [roomId])




    //handle send message button
    const sendMessage = async () => {
        if (stompClient && connected && input.trim()) {
            console.log(input);

            const message = {
                sender: userName,
                content: input,
                roomId: roomId
            }

            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            setInput("")
        }



    }


    const [isUserScrolling, setIsUserScrolling] = useState(false);

    useEffect(() => {
        const chatBox = chatBoxRef.current;

        if (!chatBox) return;

        const handleScroll = () => {
            // Check if the user is near the bottom of the chat box
            const isAtBottom =
                chatBox.scrollTop + chatBox.clientHeight >= chatBox.scrollHeight - 10;

            setIsUserScrolling(!isAtBottom);
        };

        chatBox.addEventListener("scroll", handleScroll);

        return () => {
            chatBox.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (chatBoxRef.current && !isUserScrolling) {

            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behaviour: "smooth"
            })
        }
    }, [messages])

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    function handleLogout() {
        stompClient.disconnect();
        setConnected(false);
        setRoomId('');
        setUserName('');
        navigate("/")
    }

    return (
        // this is whole page container
        <div >
            {/* this is the header portion */}
            <header className=" dark:border-gray-600 shadow dark:bg-gray-950 flex justify-around items-center py-5 fixed w-full h-20">
                <div>
                    {/* showing room id container */}
                    <h1 className="text-xl font-semibold">Room : <span>{roomId}</span></h1>

                </div>
                <div>
                    {/* showing username container */}
                    <h1 className="text-xl font-semibold">UserName : <span>{userName}</span></h1>

                </div>
                <div>
                    {/* leave room button container */}
                    <h1 className="font-semibold">
                        <button onClick={handleLogout} className="border dark:border-gray-50 rounded-md px-2 py-2 dark:bg-red-500 dark:hover:bg-red-700">Leave Room</button>
                    </h1>
                </div>
            </header>

            {/* this is a messages portion */}
            <main ref={chatBoxRef}
                className="py-20 h-screen w-full mx-auto overflow-auto dark:bg-gray-800">
                {
                    messages.map((message, index) => (
                        <div key={index} className={`flex  px-10 ${message.sender === userName ? "justify-end" : "justify-start"}`}>
                            <div className={`my-1 ${message.sender === userName ? "dark:bg-green-700" : "dark:bg-gray-700"} p-3 rounded-md max-w-xs`}>
                                <div className='flex flex-row gap-1'>
                                    <img className="h-10 w-10 " src="https://avatar.iran.liara.run/public/7" />
                                    <div className='flex flex-col overflow-auto'>
                                        <p className="text-sm font-bold ">{message.sender}</p>
                                        <p className='wrap'>{message.content}</p>
                                        <p className='text-xs text-gray-400'>{timeAgo(message.dateTime)}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                }
            </main>

            {/* input message portion */}
            <div className="fixed bottom-5 w-full h-16">
                <div className="h-full dark:bg-gray-900 w-1/2 mx-auto pr-5 gap-4 rounded-full flex justify-between items-center">
                    <input
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                        }}
                        onKeyDown={handleKeyDown}
                        type='text' placeholder='Type your message here...' className=' dark:bg-gray-700 rounded-full w-full h-full px-4 focus:outline-none' />
                    {/* <span>select</span> */}
                    <div className='flex items-center'>
                        <button className="rounded-full flex justify-center h-10 w-10 items-center">
                            <MdAttachFile size={20} />
                        </button>
                        <button onClick={sendMessage}
                            className="dark:bg-green-500 rounded-full flex justify-center h-14 w-14 items-center">
                            <MdSend size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;