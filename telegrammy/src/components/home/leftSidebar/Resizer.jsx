
const minWidth = 300; // Minimum sidebar width
const maxWidth = 600; // Maximum sidebar width

function Resizer({ setWidth }) {
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
        <div
            className="w-[3px] bg-gray-600 cursor-col-resize absolute top-0 right-0 bottom-0"
            onMouseDown={handleMouseDown}
        />
    )
}

export default Resizer
