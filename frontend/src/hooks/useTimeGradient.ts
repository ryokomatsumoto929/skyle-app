import { useState, useEffect } from "react";
import type { TimePeriod } from "../types";
import { TIME_GRADIENTS } from "../constants/gradients";
import { getCurrentTimePeriod } from "../utils/timeUtils";

export const useTimeGradient = (demoMode: TimePeriod | null) => {
  const [currentGradient, setCurrentGradient] = useState<string>(
    TIME_GRADIENTS[getCurrentTimePeriod()]
  );

  useEffect(() => {
    const updateGradient = () => {
      const period = demoMode || getCurrentTimePeriod();
      console.log("現在の時間帯:", period);
      console.log("適用されるグラデーション:", TIME_GRADIENTS[period]);
      setCurrentGradient(TIME_GRADIENTS[period]);
    };

    updateGradient();

    if (!demoMode) {
      const interval = setInterval(updateGradient, 60000);
      return () => clearInterval(interval);
    }
  }, [demoMode]);

  return currentGradient;
};
