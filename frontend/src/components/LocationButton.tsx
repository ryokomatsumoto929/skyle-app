import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import type { Location } from "../types";

interface LocationButtonProps {
  loading: boolean;
  location: Location | null;
  onGetLocation: () => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  loading,
  location,
  onGetLocation,
}) => {
  return (
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <Button
        variant="contained"
        startIcon={<LocationOn />}
        onClick={onGetLocation}
        disabled={loading}
        sx={{
          backgroundColor: "rgba(59, 130, 246, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          px: 3,
          py: 1.5,
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(37, 99, 235, 0.9)",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
          },
        }}
      >
        現在地の空を見る
      </Button>
      {location && (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, color: "#64748b" }}
        >
          緯度: {location.lat.toFixed(4)}, 経度: {location.lng.toFixed(4)}
        </Typography>
      )}
    </Box>
  );
};
