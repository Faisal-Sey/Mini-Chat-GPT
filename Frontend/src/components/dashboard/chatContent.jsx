import React, { useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { axiosClientWithHeaders } from "../../libs/axiosClient.js";
import { formatDate } from "../../utils/helpers.js";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionsData, updateQuestionsData } from "../../redux/slices/questionsSlice.js";
import { useNavigate } from "react-router-dom";
import { updateSessionsData } from "../../redux/slices/sessionsSlice.js";

function ChatContent({ id }) {
    const questions = useSelector((state) => state.questions.questions);
    const [question, setQuestion] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        if (id) {
            getMessages();
            const ws = new WebSocket(`ws://${import.meta.env.VITE_APP_BACKEND_DOMAIN_WEBSOCKET}/ws/chat/${id}/`);
            ws.onopen = () => {
                console.log("WebSocket connected");
            };
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                dispatch(updateQuestionsData(data.message));
            };
            ws.onerror = (err) => {
                console.log("WebSocket error");
            }
            ws.onclose = () => {
                console.log("WebSocket disconnected");
            };
        }
    }, [id]);

    const getMessages = async () => {
        try {
            const resp = await axiosClientWithHeaders.get(`chat/sessions/${id}`);
            dispatch(setQuestionsData(resp.data.data.chat_history));
        } catch (error) {
            console.error(error);
        }
    };

    const saveMessage = async () => {
        const data = {
            question,
        };
        if (id) {
            data.session_id = id;
        }
        try {
            const resp = await axiosClientWithHeaders.post(`chat/messages`, data);
            setQuestion("");
            const respData = resp.data.data;
            const sessionData = respData?.session;
            const sessionName = respData?.session_name;

            delete respData.session;
            delete respData?.name;

            // dispatch(updateQuestionsData(resp.data.data));
            if (sessionName) {
                dispatch(updateSessionsData(sessionData));
                navigate(`/sessions/${respData.session_id}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const scrollToBottom = () => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    };

    const handleKeyPress = async (e) => {
        if (e.code === 'Enter' && question.trim() !== '') {
            await saveMessage();
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [questions]);

    return (
        <div className="flex flex-col w-9/12 justify-between p-4 bg-[#3A4454]">
            <div className="flex items-center flex-col h-[88vh] overflow-auto" ref={containerRef}>
                {!id && <p className="text-center w-full text-white">New Chat</p>}
                {id && questions.map((question, index) =>
                    <div className="w-full flex flex-col" key={index}>
                        <div className="flex flex-col bg-[#53687E] text-white p-4">
                            <span>{question.question}</span>
                            <span className="flex justify-end text-[10px]">{formatDate(question.created_on)}</span>
                        </div>
                        <div className="text-white p-4">{question.response}</div>
                    </div>
                )}
            </div>
            <div className="relative bottom-2">
                <div className="flex w-full items-center border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500">
                    <input
                        type="text"
                        placeholder="Send question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full focus-visible:outline-none bg-inherit text-white mr-4"
                        onKeyDown={handleKeyPress}
                    />
                    <BsSend size={20} className="cursor-pointer text-white" onClick={saveMessage} />
                </div>
            </div>
        </div>
    );
}

export default ChatContent;