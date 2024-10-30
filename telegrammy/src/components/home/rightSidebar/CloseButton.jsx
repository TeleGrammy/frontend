import { IoCloseSharp } from 'react-icons/io5';

function CloseButton({ handleClick }) {
  return (
    <div
      className="flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-full text-2xl text-text-primary hover:bg-bg-secondary"
      onClick={handleClick}
    >
      <IoCloseSharp />
    </div>
  );
}

export default CloseButton;
