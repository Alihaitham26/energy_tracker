import "./Relay.css";
import { useEffect, useState } from 'react';
import { ref, get, onValue, set } from 'firebase/database';
import { database } from '../firebase';

export default function Relay({ pin }) {
  const [relayState, setRelayState] = useState(false);
  const [loading, setLoading] = useState(true);

  const relayPath = `board1/outputs/digital/${pin}`;

  // Subscribe to relay state from Firebase
  useEffect(() => {
    if (!pin) {
      setLoading(false);
      return;
    }

    const relayRef = ref(database, relayPath);

    // Get initial value first
    get(relayRef).then((snapshot) => {
      const value = snapshot.val();
      setRelayState(value === 1 || value === true || value === '1');
    }).catch(error => console.error('Error reading initial relay state:', error));

    // Then subscribe to changes
    const listener = onValue(relayRef, (snapshot) => {
      const value = snapshot.val();
      setRelayState(value === 1 || value === true || value === '1');
      setLoading(false);
    });

    return () => listener();
  }, [pin]);

  // Toggle relay state
  const handleToggle = async () => {
    try {
      const newState = relayState ? 0 : 1;
      const relayRef = ref(database, relayPath);
      await set(relayRef, newState);
    } catch (error) {
      console.error('Error toggling relay:', error);
    }
  };

  return (
    <div className="relay">
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{ opacity: relayState ? 1 : 0.5 }}
    >
        {relayState ? "Turn off" : "Turn on"}
    </button>
    </div>

  );
}