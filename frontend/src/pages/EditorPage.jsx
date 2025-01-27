import React, { useEffect, useRef, useState } from 'react';
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../socket';
import { ACTIONS } from '../Actions';
import { useLocation } from 'react-router-dom';

function EditorPage() {
    const location = useLocation();
    const socketRef = useRef(null);
    const [clients, setClients] = useState([]);  // Ensure clients state is initialized as an empty array

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId: location.state?.formData.roomId,
                username: location.state?.formData?.username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ client }) => {
                // Ensure the clients array is valid before updating state
                console.log(client.username);
                if (client && Array.isArray(client)) {
                    setClients(prevClients => [...prevClients, client]);
                }
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId }) => {
                setClients(prevClients => prevClients.filter(client => client.socketId !== socketId));
            });
        };
        
        init();
    }, [location.state?.formData.roomId, location.state?.formData.username]);

    return (
        <div className='mainWrap h-screen flex text-white'>
            <div className='aside bg-slate-950 w-56 p-2 px-3 flex flex-col overflow-y-auto scrollbar-hide'>
                <div className="asideInner">
                    <div className='logo mb-2'>
                        <img src="/code-sync.png" alt="code-sync logo" />
                    </div>
                    <hr className='text-white mb-2' />
                    <h2 className='font-bold '>Connected </h2>
                    <div className='all_members flex justify-between flex-wrap'>
                        {clients && Array.isArray(clients) && clients.length > 0 ? (
                            clients.map((client) => {
                                return client.username ? (
                                    <Client key={client.socketId} username={client.username} />
                                ) : (
                                    <p key={client.socketId}>No username</p> // Fallback for missing username
                                );
                            })
                        ) : (
                            <p>No clients connected</p> // Message when no clients are present
                        )}
                    </div>
                </div>
                <div className='flex flex-col w-full mt-auto '>
                    <button className="btn hover:bg-gray-300 hover:cursor-pointer text-black bg-white mt-4 py-1 rounded-lg font-semibold ">
                        Copy ROOM ID
                    </button>
                    <button className="btn hover:bg-green-800 hover:cursor-pointer bg-green-600 text-black rounded-lg mt-4 py-1 font-semibold mb-2">
                        Leave
                    </button>
                </div>
            </div>
            <div className='editorWrap bg-slate-900 w-screen'>
                <Editor />
            </div>
        </div>
    );
}

export default EditorPage;
