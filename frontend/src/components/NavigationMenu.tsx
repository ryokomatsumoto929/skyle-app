import React from "react";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { Camera, Info } from "@mui/icons-material";
import { TimePeriod } from "../types";

interface NavigationMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  demoMode: TimePeriod | null;
  onClose: () => void;
  onPageChange: (page: string) => void;
  onTimePeriodChange: (period: TimePeriod | null) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  anchorEl,
  open,
  demoMode,
  onClose,
  onPageChange,
  onTimePeriodChange,
}) => {
  const handleMenuItemClick = (page: string) => {
    onPageChange(page);
    onClose();
  };

  const handleTimePeriodClick = (period: TimePeriod | null) => {
    onTimePeriodChange(period);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 8,
          sx: {
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            minWidth: 200,
          },
        },
      }}
    >
      <MenuItem
        onClick={() => handleMenuItemClick("home")}
        sx={{ py: 1.5, px: 2 }}
      >
        <Camera sx={{ mr: 2, color: "#64748b" }} />
        <Typography sx={{ color: "#374151", fontWeight: 500 }}>
          今日の空
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={() => handleMenuItemClick("about")}
        sx={{ py: 1.5, px: 2 }}
      >
        <Info sx={{ mr: 2, color: "#64748b" }} />
        <Typography sx={{ color: "#374151", fontWeight: 500 }}>
          このアプリについて
        </Typography>
      </MenuItem>
      <Box sx={{ borderTop: "1px solid rgba(203, 213, 225, 0.3)", my: 1 }} />
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.7rem" }}
        >
          時間帯プレビュー
        </Typography>
      </Box>
      <MenuItem
        onClick={() => handleTimePeriodClick("earlyMorning")}
        sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
      >
        🌌 早朝 (4-6時)
      </MenuItem>
      <MenuItem
        onClick={() => handleTimePeriodClick("morning")}
        sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
      >
        🌅 朝 (6-9時)
      </MenuItem>
      <MenuItem
        onClick={() => handleTimePeriodClick("daytime")}
        sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
      >
        ☀️ 昼 (9-16時)
      </MenuItem>
      <MenuItem
        onClick={() => handleTimePeriodClick("evening")}
        sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
      >
        🌆 夕方 (16-18時)
      </MenuItem>
      <MenuItem
        onClick={() => handleTimePeriodClick("night")}
        sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
      >
        🌙 夜 (18-4時)
      </MenuItem>
      {demoMode && (
        <MenuItem
          onClick={() => handleTimePeriodClick(null)}
          sx={{
            py: 1,
            px: 2,
            fontSize: "0.9rem",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
          }}
        >
          ↻ 現在時刻に戻る
        </MenuItem>
      )}
    </Menu>
  );
};
