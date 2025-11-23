import { useState, useEffect } from "react";
import { TimePeriod } from "../types";
import { TIME_GRADIENTS } from "../constants/gradients";
import { getCurrentTimePeriod } from "../utils/timeUtils";

export const useTimeGradient = (demoMode: TimePeriod | null) => {
  const [currentGradient, setCurrentGradient] = useState<string>(
    TIME_GRADIENTS[getCurrentTimePeriod()]
  );

  useEffect(() => {
    const updateGradient = () => {
      const period = demoMode || getCurrentTimePeriod();
      setCurrentGradient(TIME_GRADIENTS[period]);
    };

    updateGradient();

    if (!demoMode) {
      const interval = setInterval(updateGradient, 60000); // 1分ごとに更新
      return () => clearInterval(interval);
    }
  }, [demoMode]);

  return currentGradient;
};
