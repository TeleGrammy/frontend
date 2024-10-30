import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Resizer from './Resizer';
import ChatList from './ChatList';

const minWidth = 300; // Minimum sidebar width
const maxWidth = 600; // Maximum sidebar width

const SideBar = () => {
    const [width, setWidth] = useState(minWidth); // Initial width of the sidebar

    const { currentMenu } = useSelector((state) => state.sidebar);

    return (
        <div className='relative flex h-screen flex-col items-center bg-bg-primary'
            style={{ width: `${width}px` }}>
            
            {/* Components to render */}
            {/* ChatList component */}
            {currentMenu === 'ChatList' && <ChatList />}

            {/** setting component */}
            {/* {currentMenu === 'setting' && <Setting />} */}

           {/* Resizer handle */}
           <Resizer setWidth={setWidth} />
        </div>
    );
};

export default SideBar;