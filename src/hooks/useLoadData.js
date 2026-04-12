import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';

/**
 * Custom hook to subscribe to a Firebase load path (e.g. "load11", "load2", "load3").
 *
 * Expected DB structure under each load:
 * {
 *   "amps":       { "<pushKey>": <number>, ... },
 *   "volts":      { "<pushKey>": <number>, ... },
 *   "watts":      { "<pushKey>": <number>, ... },
 *   "energy_kWh": { "<pushKey>": <number>, ... },
 *   "time":       { "<pushKey>": <number>, ... }
 * }
 *
 * Firebase push keys are lexicographically ordered by creation time,
 * so sorting by key gives chronological order.
 */
export function useLoadData(loadPath) {
  const [data, setData] = useState({
    watts: [],
    amps: [],
    volts: [],
    energyKwh: [],
    time: [],
    entries: [],     // Combined entries with all fields aligned
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!loadPath) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const loadRef = ref(database, loadPath);

    const listener = (snapshot) => {
      try {
        const val = snapshot.val();

        if (!val) {
          setData({
            watts: [], amps: [], volts: [], energyKwh: [], time: [],
            entries: [], loading: false, error: null,
          });
          return;
        }

        // Parse each metric from the push-key map
        const wattsMap = val.watts || {};
        const ampsMap = val.amps || {};
        const voltsMap = val.volts || {};
        const energyMap = val.energy_kWh || {};
        const timeMap = val.time || {};

        // Extract and sort by push key (chronological order)
        const sortedEntries = (map) => {
          return Object.entries(map)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([, value]) => Number(value));
        };

        const wattsArr = sortedEntries(wattsMap);
        const ampsArr = sortedEntries(ampsMap);
        const voltsArr = sortedEntries(voltsMap);
        const energyArr = sortedEntries(energyMap);
        const timeArr = sortedEntries(timeMap);

        // Build combined entries (aligned by index)
        const maxLen = Math.max(wattsArr.length, ampsArr.length, voltsArr.length);
        const entries = [];
        for (let i = 0; i < maxLen; i++) {
          entries.push({
            index: i + 1,
            watts: wattsArr[i] ?? null,
            amps: ampsArr[i] ?? null,
            volts: voltsArr[i] ?? null,
            energyKwh: energyArr[i] ?? null,
            time: timeArr[i] ?? null,
          });
        }

        setData({
          watts: wattsArr,
          amps: ampsArr,
          volts: voltsArr,
          energyKwh: energyArr,
          time: timeArr,
          entries,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error(`Error parsing ${loadPath}:`, err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      }
    };

    onValue(loadRef, listener, (error) => {
      console.error(`Firebase listener error for ${loadPath}:`, error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    });

    return () => off(loadRef, 'value', listener);
  }, [loadPath]);

  // Computed values
  const latestWatts = data.watts.length > 0 ? data.watts[data.watts.length - 1] : 0;
  const latestAmps = data.amps.length > 0 ? data.amps[data.amps.length - 1] : 0;
  const latestVolts = data.volts.length > 0 ? data.volts[data.volts.length - 1] : 0;
  const totalEnergy = data.energyKwh.reduce((sum, v) => sum + (v || 0), 0);

  return {
    ...data,
    latestWatts,
    latestAmps,
    latestVolts,
    totalEnergy,
  };
}
