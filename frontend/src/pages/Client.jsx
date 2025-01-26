import React from 'react'
import Avatar from 'react-avatar'

function Client({ username }) {
    console.log(username);
    
    return (
        <div className='client flex flex-col justify-center pt-2 items-center  overflow-clip' >
            <Avatar name={username} size={50} round="14px" className='p-0' />
            <span className="username text-xs w-[72px] truncate overflow-hidden whitespace-nowrap text-center block"> {username}</span>
        </div>
    )
}

export default Client