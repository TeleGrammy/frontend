import { useEffect, useState } from 'react';

function Progressbar({ duration, handleEnd, isCompleted, isActive, count }) {
  const [progress, setProgress] = useState(0);
  const width = 100 / count;

  useEffect(() => {
    if (!isActive) {
      if (isCompleted) setProgress(100);
      else setProgress(0);
      return;
    }

    const interval = 5;
    const increment = 100 / ((duration * 1000) / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + increment;
        if (nextProgress >= 100) {
          clearInterval(timer);
          handleEnd();
          return 100;
        }
        return nextProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, isActive, handleEnd, isCompleted]);

  return (
    <div
      className={`relative h-1 bg-gray-600`}
      style={{ width: `${width - 3}%` }}
    >
      <div
        className="absolute left-0 top-0 h-full bg-gray-400"
        style={{ width: isActive ? `${progress}%` : isCompleted ? '100%' : 0 }}
      ></div>
    </div>
  );
}

export default Progressbar;
