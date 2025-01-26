import React, { useState } from 'react'
import Client from './Client'
import Editor from './Editor'

function EditorPage() {

    const [clients, setClients] = useState([
        { socketId: 1, username: 'rakesh k' },
        { socketId: 2, username: 'john dofikepokjieoe' },
        { socketId: 3, username: 'john feikfjoeij' },
        { socketId: 3, username: 'john feikfjoeij' },
        { socketId: 3, username: 'john feikfjoeij' },
        { socketId: 3, username: 'john feikfjoeij' },

    ])

    return (
        <div className='mainWrap h-screen flex text-white'>
            <div className='aside bg-slate-950 w-56 p-2 px-3 flex flex-col overflow-y-auto scrollbar-hide'>
                <div className="asideInner">
                    <div className='logo mb-2'>
                        <img
                            src="/code-sync.png"
                            alt="code-sync logo" />
                    </div>
                    <hr className='text-white mb-2' />
                    <h2 className='font-bold '>Connected </h2>
                    <div className='all_members flex justify-between flex-wrap'>
                        {
                            clients.map((client) => {
                                return <Client key={client.socketId} username={client.username} />
                            })
                        }
                    </div>
                </div>
                <div className='flex flex-col w-full mt-auto '>
                    <button className="btn hover:bg-gray-300 hover:cursor-pointer text-black bg-white mt-4 py-1 rounded-lg font-semibold ">Copy ROOM ID</button>
                    <button className="btn hover:bg-green-800 hover:cursor-pointer bg-green-600 text-black rounded-lg mt-4 py-1 font-semibold mb-2">Leave</button>
                </div>
            </div>
            <div className='editorWrap bg-slate-900 w-screen'>
                <Editor />
            </div>
        </div>
    )
}

export default EditorPage