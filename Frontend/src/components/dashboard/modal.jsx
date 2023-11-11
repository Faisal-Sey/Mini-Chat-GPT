import React from "react";
import { IoCloseOutline } from "react-icons/io5";

const Modal = ({ isOpen, setIsOpen, loading, callback }) => {
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {isOpen && (
                <div className="modal fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <div
                            className={`bg-white max-w-[500px] rounded-lg p-6`}
                        >
                            <div className="flex justify-between">
                                <h2 className="text-xl font-bold mb-4">
                                    Delete session
                                </h2>
                                <span className="close-btn" onClick={toggleModal}>
                                    <IoCloseOutline size={20} fill="#eee" />
                                </span>
                            </div>
                            <p>Are you sure you want to delete this session?</p>
                            <div className="flex mt-8 justify-end items-center">
                                <button
                                    className="text-[14px] border rounded px-3 py-2"
                                    onClick={toggleModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="text-[14px] ml-2 text-white px-3 py-2 rounded bg-[#3A4454]"
                                    onClick={callback}
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
