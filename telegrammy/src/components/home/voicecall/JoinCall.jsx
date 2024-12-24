import React from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

function JoinCall({ activeCall, setActiveCall }) {
  const handleclick = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/call/join/${activeCall._id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json', // Specify JSON response expected
        },
        credentials: 'include', // Include credentials (cookies)
      });
      if (!response.ok) {
        throw new Error('Failed to Join Call');
      }
      const data = await response.json();
      if (data.status === 'call ended') {
        setActiveCall({});
      } else if (data.status === 'call joining') {
        console.log('Joining Call');
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <button
      onClick={handleclick}
      className="rounded-lg bg-green-500 px-2 text-text-primary shadow-md transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-green-400 focus:ring-offset-2"
    >
      Join Call
    </button>
  );
}

export default JoinCall;
