import React from 'react';
import Sidebar from "../../components/dashboard/sidebar.jsx";
import ChatContent from "../../components/dashboard/chatContent.jsx";
import {useParams} from "react-router-dom";


function ChatSessionsPage() {
    const {id} = useParams();
    return (
        <div className="flex">
            <Sidebar id={id} />
            <ChatContent id={id} />
        </div>
    )
}

export default ChatSessionsPage;
