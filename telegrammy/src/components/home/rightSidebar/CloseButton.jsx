import { useDispatch } from 'react-redux';

import { closeRightSidebar } from '../../../slices/sidebarSlice';

import { IoCloseSharp } from 'react-icons/io5';

function CloseButton() {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeRightSidebar());
  };
  return (
    <div
      className="flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-full text-2xl text-text-primary hover:bg-bg-secondary"
      onClick={handleClose}
      data-test-id="close-rightsidebar-button"
    >
      <IoCloseSharp />
    </div>
  );
}

export default CloseButton;
