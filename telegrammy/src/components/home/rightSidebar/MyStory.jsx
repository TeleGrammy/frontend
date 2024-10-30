

import { FaRegEye } from "react-icons/fa";

function MyStory({ story, index }) {

    return (
        <>
            <div className="relative">
                <div className="absolute flex flex-row items-center 
                     select-none bottom-0 left-0 p-1">
                    <FaRegEye className="text-sm text-text-primary" />
                    <span className="text-text-primary text-xs ml-1">{story.views}</span>
                </div>
                <img src={story.media} alt={`Story ${index + 1}`} className="w-full h-full" />
            </div>
        </>
    )
}

export default MyStory;
