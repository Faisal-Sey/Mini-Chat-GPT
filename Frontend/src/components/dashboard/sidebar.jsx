import React, {useEffect, useState} from 'react';
import {axiosClientWithHeaders} from "../../libs/axiosClient.js";
import {MdDeleteOutline} from "react-icons/md";
import {AiOutlineCheck, AiOutlineEdit} from "react-icons/ai";
import {BsChatLeftDots} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {resetQuestionsData} from "../../redux/slices/questionsSlice.js";
import {
    deleteSessionsData,
    modifySessionData,
    resetSessionsData,
    setSessionsData
} from "../../redux/slices/sessionsSlice.js";
import Modal from "./modal.jsx";
import {resetUserData} from "../../redux/slices/userSlice.js";
import {LiaTimesSolid} from "react-icons/lia";

const Sidebar = ({id}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [deletingSession, setDeletingSession] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingName, setIsEditingName] = useState('');
    const sessions = useSelector((state) => state.sessions.sessions);

    const user = useSelector((state) => state.user.user);

    const getAllSessions = async () => {
        try {
            const resp = await axiosClientWithHeaders.get("/chat/sessions");
            dispatch(setSessionsData(resp.data.data));
        } catch (error) {
            console.error(error);
        }
    }

    const deleteSession = async () => {
        setDeletingSession(true);
        try {
            await axiosClientWithHeaders.delete(`/chat/sessions/${selectedId}`);
            setDeletingSession(false);
            dispatch(deleteSessionsData({id: selectedId}));
            setIsModalOpen(false);
            navigate('/sessions');
        } catch (error) {
            console.error(error);
            setDeletingSession(false);
        }
    }

    const editSession = async () => {
        try {
            await axiosClientWithHeaders.put(`/chat/sessions/${selectedId}`, {
                name: isEditingName.trim()
            });
            const session = sessions.find((session) => session.id === selectedId);
            dispatch(modifySessionData({...session, name: isEditingName.trim()}));
            setIsEditingName("");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            setDeletingSession(false);
        }
    }

    const handleSessionDelete = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    }

    const handleIsEditing = (id, name) => {
        setIsEditing(true);
        setIsEditingName(name);
        setSelectedId(id);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
        setIsEditingName('');
        setSelectedId(0);
    }

    const handleLogout = () => {
        dispatch(resetQuestionsData());
        dispatch(resetSessionsData());
        dispatch(resetUserData());
    }

    useEffect(() => {
        getAllSessions();
    }, []);

    return (
        <>
            <div className="bg-gray-900 text-white w-64 h-screen p-4 flex flex-col justify-between">
                <div>
                    <ul className="space-y-4 border-2" onClick={() => navigate("/sessions")}>
                        <li className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer text-center">+ New Chat</li>
                    </ul>
                    <div className="mt-4">
                        {sessions.map((session, index) =>
                            <div
                                className={`flex ${(Number(id) === session.id) && "bg-gray-700"} items-center justify-between mb-2 px-2 py-1 rounded cursor-pointer text-center`}
                                onClick={() => navigate(`/sessions/${session.id}`)}
                                key={index}
                            >
                                <div className="flex">
                                    <span><BsChatLeftDots size={20}/></span>
                                    {isEditing && selectedId === session.id
                                    ?
                                        <input
                                            type="text"
                                            value={isEditingName}
                                            onChange={(e) => setIsEditingName(e.target.value)}
                                            className="text-[15px] ml-2 bg-gray-700 h-[15px] w-[90%]"
                                            autoFocus={true}
                                        />
                                    : <>
                                            <span className="ml-2">{session?.name?.substring(0, 16)?.titleWords()}</span>
                                            {session?.name?.length > 16 && "..."}
                                        </>
                                    }
                                </div>
                                {(Number(id) === session.id) && <div className="flex">
                                    {!isEditing ?
                                    <>
                                        <span>
                                            <AiOutlineEdit
                                                size={20}
                                                onClick={() => handleIsEditing(session.id, session.name)}
                                            />
                                        </span>
                                        <span>
                                            <MdDeleteOutline
                                                size={20}
                                                onClick={() => handleSessionDelete(session.id)}
                                            /></span>
                                    </>
                                        :
                                        <>
                                        <span>
                                            <AiOutlineCheck
                                                size={20}
                                                onClick={editSession}
                                            />
                                        </span>
                                            <span>
                                            <LiaTimesSolid
                                                size={20}
                                                onClick={handleCancelEdit}
                                            /></span>
                                        </>
                                    }
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col'>
                    Welcome {user?.first_name} {user?.last_name}
                    <button onClick={handleLogout} className="text-left cursor-pointer underline">Logout</button>
                </div>
            </div>
            <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} loading={deletingSession} callback={deleteSession}/>
        </>
    );
};

export default Sidebar;
