import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import hooks

import { FaPen, FaPodcast, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MenuItem from './MenuItem';

const apiUrl = import.meta.env.VITE_API_URL;

const CreateButtonitems = [
  {
    Name: 'New Contact',
    icon: <FaUser />,
    newMenu: 'ContactList',
    isRightSidebar: false,
  },
  {
    Name: 'New Group',
    icon: <FaUsers />,
    newMenu: 'GroupList',
    isRightSidebar: false,
  },
  {
    Name: 'New Channel',
    icon: <FaPodcast />,
    newMenu: 'ChannelList',
    isRightSidebar: false,
  },
];

function CreateButton() {
  const [isCreateButtonOpen, setIsCreateButtonOpen] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  return (
    <>
      <div
        className="absolute bottom-8 right-8 flex min-h-14 min-w-14 cursor-pointer items-center justify-center rounded-full bg-bg-button text-2xl hover:bg-bg-button-hover"
        onClick={() => setIsCreateButtonOpen(!isCreateButtonOpen)}
        data-test-id="create-button"
      >
        <FaPen className="text-text-primary opacity-70" />
      </div>
      {isCreateButtonOpen && (
        <div
          className={`absolute bottom-24 right-10 min-w-60 rounded-2xl border border-border bg-bg-primary opacity-80 shadow-xl`}
          data-test-id="create-menu"
        >
          <ul className="text-l flex flex-col items-start justify-start space-y-2 p-2 px-4">
            {CreateButtonitems.map((item) => (
              <MenuItem
                key={item.Name}
                isRightSidebar={item.isRightSidebar}
                setIsMenuOpen={setIsCreateButtonOpen}
                newMenu={item.newMenu}
                data-test-id={`menu-item-${item.Name.replace(' ', '-').toLowerCase()}`}
              >
                {item.icon}
                <span
                  className="ml-4"
                  data-test-id={`menu-item-label-${item.Name.replace(' ', '-').toLowerCase()}`}
                >
                  {item.Name}
                </span>
              </MenuItem>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default CreateButton;
