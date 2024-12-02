import { useSelector } from 'react-redux';

function SelectedInfo() {
  const { currentRightSidebar } = useSelector((state) => state.sidebar);

  return (
    <h1 className="mx-4 mb-1 text-xl leading-none text-text-primary">
      {currentRightSidebar}
    </h1>
  );
}

export default SelectedInfo;
