import "./messenger.scss";
import Conversation from "../../components/Conversations/Conversation";
import Message from "../../components/message/Message";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {io} from "socket.io-client"; 

export default function Messenger() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef(io("ws://localhost:8000"));
    const {user} = useContext(AuthContext);
    const scrollRef = useRef();
    const box = useRef();

    useEffect(()=> {
        socket.current = io("ws://localhost:8000");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createAt : Date.now()
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage && 
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev)=>[...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users)=> {
            console.log("users 콘솔 : ", users);
        })
    }, [user]);

   console.log(socket);

    useEffect(() => {
        const getConversations = async () => {
            // console.log("id : ",user._id);
            console.log("현재 로그인 id : " ,user._id);
            try {
                const res = await axios.get("http://localhost:8080/api/conversations/" + user._id);
                setConversations(res.data)
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);


    // console.log("채팅확인currentChat : ", currentChat);
    useEffect(() => {
        const getMessages = async () => {
            try {
              const res = await axios.get("http://localhost:8080/api/messages/" + currentChat?._id );
              setMessages(res.data);
            } catch (err) {
              console.log(err);
            }
          };
          getMessages();
        }, [currentChat]);

        // console.log("메시지 확인 : ", messages);

        //보낸메시지 db저장
        const handleSubmit = async (e) => {
            e.preventDefault();
            const message = {
                sender: user._id,
                text: newMessage,
                conversationId : currentChat._id
            };

            const receiverId = currentChat.members.find((member)=> member !== user._id);

            socket.current.emit("sendMessage", {
                senderId : user._id,
                receiverId,
                text : newMessage
            });

            try{
                const res = await axios.post("http://localhost:8080/api/messages", message);
                setMessages([...messages, res.data])
                setNewMessage("");
            }catch(err){
                console.log(err)
            }
        };

        

        //스크롤다운useEffect
        useEffect(()=>{
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messages])
       


      return (
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for friends" className="chatMenuInput" />
                    {conversations.map((c) => (
                        <div onClick={() => setCurrentChat(c)}>
                            <Conversation key={c} conversation={c} currentUser={user} />
                        </div>
            ))}
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {
                        currentChat ? (
                    <>  
                        <div className="chatBoxTop" ref={box}>
                            {messages.map(m=>(
                                <div ref={scrollRef}>
                                    <Message message={m} own={m.sender === user._id} />
                                </div>
                            ))}
                            
                        </div>
                        <div className="chatBoxBottom">
                            <textarea 
                            className="chatMessageInput" 
                            placeholder="메시지를 작성해 주세요..." 
                            onChange={(e)=>setNewMessage(e.target.value)}
                            value={newMessage}
                            ></textarea>
                            <button className="chatSubmitButton" onClick={handleSubmit}>SEND</button>
                        </div>
                    </>
                    ) : (

                    <span className="noConversationText"> Open a conversation to start a chat.</span>

                )} 
                </div>
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                {/* <ChatOnline /> */}
                </div>
            </div>
        </div>
    )
}