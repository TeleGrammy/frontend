import React, { useState } from 'react';
import SearchBar from './SearchBar';
import Menu from './Menu';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const minWidth = 300; // Minimum sidebar width
const maxWidth = 600; // Maximum sidebar width

const SideBar = () => {
    const [width, setWidth] = useState(minWidth); // Initial width of the sidebar

    const handleMouseDown = () => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'none'; 
    };

    const handleMouseMove = (e) => {
        const newWidth = e.clientX;
        // Restrict the width within the min and max limits
        if (newWidth >= minWidth && newWidth <= maxWidth) {
            setWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
    };


    return (
        <div className='relative flex h-screen flex-col items-center bg-bg-primary'
            style={{ width: `${width}px` }}>
            {/* Sidebar */}
            <Header>
                <Menu />
                <SearchBar/>
            </Header>
           {/* chats */}
           <div className='text-text-primary'>
           <Outlet/>
           </div>
           {/* Resizer handle */}
           <div
                className="w-[3px] bg-gray-600 cursor-col-resize absolute top-0 right-0 bottom-0"
                onMouseDown={handleMouseDown}
            />
        </div>
    );
};

export default SideBar;