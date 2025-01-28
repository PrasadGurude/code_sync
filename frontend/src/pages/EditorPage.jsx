import React, { useEffect, useRef, useState } from 'react';
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../socket';
import { ACTIONS } from '../Actions';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

function EditorPage() {
    const location = useLocation();
    const socketRef = useRef(null);
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);  

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId: location.state?.formData.roomId,
                username: location.state?.formData.username,
            });

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later');
                reactNavigator('/');
            }

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.formData.username) {
                    toast.success(`${username} joined the room`);
                }
                setClients(clients);
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room`);
                setClients(prevClients => prevClients.filter(client => client.socketId !== socketId));
            });
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
        };
    }, [location.state?.formData.roomId, location.state?.formData.username]);

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className='mainWrap h-screen flex text-white'>
            {/* Sidebar for showing connected users */}
            <div className='aside bg-slate-950 w-56 p-4 flex flex-col overflow-y-auto scrollbar-hide'>
                <div className="asideInner">
                    <div className='logo mb-2'>
                        <img src="/code-sync.png" alt="code-sync logo" />
                    </div>
                    <hr className='text-white mb-2' />
                    <h2 className='font-bold text-lg'>Connected Users</h2>

                    {/* Clients Grid - 2 per row */}
                    <div className='grid grid-cols-2 gap-2 mt-2'>
                        {clients.length > 0 ? (
                            clients.map((client) => (
                                <Client key={client.socketId} username={client.username} />
                            ))
                        ) : (
                            <p className="text-gray-400 col-span-2 text-center">No users connected</p>
                        )}
                    </div>
                </div>
                
                {/* Sidebar buttons */}
                <div className='mt-auto'>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(location.state?.formData.roomId);
                            toast.success('Room ID copied!');
                        }}
                        className="btn bg-white text-black py-1 rounded-lg font-semibold mt-4 hover:bg-gray-300 w-full">
                        Copy Room ID
                    </button>

                    <button
                        onClick={() => {
                            socketRef.current?.disconnect();
                            reactNavigator('/');
                        }}
                        className="btn bg-red-600 text-white rounded-lg mt-4 py-1 font-semibold hover:bg-red-800 w-full">
                        Leave Room
                    </button>
                </div>
            </div>

            {/* Code Editor */}
            <div className='editorWrap bg-slate-900 w-full'>
                <Editor socketRef={socketRef} roomId={location.state?.formData.roomId} />
            </div>
        </div>
    );
}

export default EditorPage;
