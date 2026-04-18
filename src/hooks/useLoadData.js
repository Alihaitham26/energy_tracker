import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';

// Fallback data from Database.json
const db = {
  "load11": {
    "amps": {
      "-OpnRGIxyT9VDXaPipt_": 13.07,
      "-OpnRHrBh6Xn9P0aUekv": 1.94,
      "-OpnRK56CGpwT-TNnjPS": 2,
      "-OpnRMYIfEl0MssfErHn": 1.89,
      "-OpnRPvy3sKDN7SpG-mQ": 0.86
    },
    "energy_kWh": {
      "-OpnRGNoZPTS1jSwBfc8": 0,
      "-OpnRHwU3r3DM6Jok-VY": 0,
      "-OpnRKAi-mUs4I6ZAnr0": 0,
      "-OpnRMcMmMWyC9yozDnE": 0,
      "-OpnRQ-kahQsKU71HDhH": 0
    },
    "time": {
      "-OpnRGGODgRb5P59_Q5y": 10,
      "-OpnRHpYf8cYvC-iYGOv": 10,
      "-OpnRK29wKAV3N4DE2YP": 10,
      "-OpnRMWRIX1QKyf4kxPm": 10,
      "-OpnRPtOmZTBv_-Hphbh": 10
    },
    "volts": {
      "-OpnRGK9n1Ew6np38s3C": 0.16,
      "-OpnRHuywZVV4Fhbnjo6": 0.11,
      "-OpnRK9MTvSXSrIjGsb_": 0.1,
      "-OpnRMb0kX9kUjCfvIk8": 0.07,
      "-OpnRPz8Mq_jpcOX8ls0": 0
    },
    "watts": {
      "-OpnRGM9n1Ew6np38s3C": -0.91,
      "-OpnRHuywZVV4Fhbnjo6": 0.11,
      "-OpnRK9MTvSXSrIjGsb_": 0.1,
      "-OpnRMb0kX9kUjCfvIk8": 0.07,
      "-OpnRPz8Mq_jpcOX8ls0": 0
    }
  },
  "load2": {
    "amps": {
      "-OpnRGQy0Cxc1o72vEyd": 22.14,
      "-OpnRI2vkfGBTPZ87RCu": 17.67,
      "-OpnRKE98Osk_kbVhqnV": 14.32,
      "-OpnRMg2eeeqeT5LcAJ_": 17.91,
      "-OpnRQ8y0Cxc1o72vEyd": 12.5
    },
    "energy_kWh": {
      "-OpnRGQy0Cxc1o72vEyd": 0,
      "-OpnRI2vkfGBTPZ87RCu": 0,
      "-OpnRKE98Osk_kbVhqnV": 0,
      "-OpnRMg2eeeqeT5LcAJ_": 0,
      "-OpnRQ8y0Cxc1o72vEyd": 0
    },
    "time": {
      "-OpnRGQy0Cxc1o72vEyd": 10,
      "-OpnRI2vkfGBTPZ87RCu": 10,
      "-OpnRKE98Osk_kbVhqnV": 10,
      "-OpnRMg2eeeqeT5LcAJ_": 10,
      "-OpnRQ8y0Cxc1o72vEyd": 10
    },
    "volts": {
      "-OpnRGQy0Cxc1o72vEyd": 0.22,
      "-OpnRI2vkfGBTPZ87RCu": 0.18,
      "-OpnRKE98Osk_kbVhqnV": 0.14,
      "-OpnRMg2eeeqeT5LcAJ_": 0.18,
      "-OpnRQ8y0Cxc1o72vEyd": 0.13
    },
    "watts": {
      "-OpnRGQy0Cxc1o72vEyd": 0.22,
      "-OpnRI2vkfGBTPZ87RCu": 0.18,
      "-OpnRKE98Osk_kbVhqnV": 0.14,
      "-OpnRMg2eeeqeT5LcAJ_": 0.18,
      "-OpnRQ8y0Cxc1o72vEyd": 0.13
    }
  },
  "load3": {
    "amps": {
      "-OpnRGQy0Cxc1o72vEyd": 22.14,
      "-OpnRI2vkfGBTPZ87RCu": 17.67,
      "-OpnRKE98Osk_kbVhqnV": 14.32,
      "-OpnRMg2eeeqeT5LcAJ_": 17.91,
      "-OpnRQ8y0Cxc1o72vEyd": 12.5
    },
    "energy_kWh": {
      "-OpnRGQy0Cxc1o72vEyd": 0,
      "-OpnRI2vkfGBTPZ87RCu": 0,
      "-OpnRKE98Osk_kbVhqnV": 0,
      "-OpnRMg2eeeqeT5LcAJ_": 0,
      "-OpnRQ8y0Cxc1o72vEyd": 0
    },
    "time": {
      "-OpnRGQy0Cxc1o72vEyd": 10,
      "-OpnRI2vkfGBTPZ87RCu": 10,
      "-OpnRKE98Osk_kbVhqnV": 10,
      "-OpnRMg2eeeqeT5LcAJ_": 10,
      "-OpnRQ8y0Cxc1o72vEyd": 10
    },
    "volts": {
      "-OpnRGQy0Cxc1o72vEyd": 0.22,
      "-OpnRI2vkfGBTPZ87RCu": 0.18,
      "-OpnRKE98Osk_kbVhqnV": 0.14,
      "-OpnRMg2eeeqeT5LcAJ_": 0.18,
      "-OpnRQ8y0Cxc1o72vEyd": 0.13
    },
    "watts": {
      "-OpnRGQy0Cxc1o72vEyd": 0.22,
      "-OpnRI2vkfGBTPZ87RCu": 0.18,
      "-OpnRKE98Osk_kbVhqnV": 0.14,
      "-OpnRMg2eeeqeT5LcAJ_": 0.18,
      "-OpnRQ8y0Cxc1o72vEyd": 0.13
    }
  }
};

/**
 * Custom hook to subscribe to a Firebase load path (e.g. "load11", "load2", "load3").
 *
 * Expected DB structure under each load:
 * {
 *   "amps":       { "<pushKey>": <number>, ... },
 *   "volts":      { "<pushKey>": <number>, ... },
 *   "watts":      { "<pushKey>": <watt-hours>, ... },  // Energy in watt-hours per interval
 *   "energy_kWh": { "<pushKey>": <number>, ... },
 *   "time":       { "<pushKey>": <minutes>, ... }      // Time intervals in minutes
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
    uptimeMinutes: 0,
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
      let val = snapshot.val();
      if (!val || Object.keys(val).length === 0) {
        // Fallback to local data
        val = db[loadPath];
      }

      try {
        if (!val) {
          setData({
            watts: [], amps: [], volts: [], energyKwh: [], time: [],
            entries: [], uptimeMinutes: 0, loading: false, error: null,
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
        const calculatedEnergyArr = [];
        let cumulativeEnergy = 0;
        let uptimeMinutes = 0;
        for (let i = 0; i < maxLen; i++) {
          const originalWatts = wattsArr[i] ?? 0;
          const timeInterval = timeArr[i] ?? 0;
          // originalWatts is watt-hours per interval, timeInterval in minutes
          // kWh = abs(originalWatts) / 1000
          const energyIncrement = Math.abs(originalWatts) / 1000;
          cumulativeEnergy += energyIncrement;
          calculatedEnergyArr.push(cumulativeEnergy);
          if (Math.abs(originalWatts) > 0) {
            uptimeMinutes += timeInterval;
          }
          entries.push({
            index: i + 1,
            watts: originalWatts,
            amps: ampsArr[i] ?? null,
            volts: voltsArr[i] ?? null,
            energyKwh: cumulativeEnergy, // Use calculated cumulative energy
            time: timeInterval,
          });
        }

        setData({
          watts: wattsArr,
          amps: ampsArr,
          volts: voltsArr.slice(200),
          energyKwh: calculatedEnergyArr, // Use calculated cumulative energy
          time: timeArr,
          entries,
          uptimeMinutes,
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
  const totalEnergy = data.energyKwh.length > 0 ? data.energyKwh[data.energyKwh.length - 1] : 0;

  // Get limit from localStorage
  const loadLimits = JSON.parse(localStorage.getItem('loadLimits') || '{}');
  const limit = loadLimits[loadPath] || 1000; // Default 1000W
  console.log({ ...data,latestWatts,latestAmps,latestVolts,totalEnergy,limit,})
  return {
    ...data,
    latestWatts,
    latestAmps,
    latestVolts,
    totalEnergy,
    limit,
  };
}
