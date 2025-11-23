import React, { useState } from "react";
import { Box } from "@mui/material";

interface MomentIconProps {
  type: "magic" | "blue" | "halo";
  visibility: "excellent" | "good" | "fair" | "poor";
  size?: number;
}

export const MomentIcon: React.FC<MomentIconProps> = ({ 
  type, 
  visibility, 
  size = 140 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getImageSrc = () => {
    const imageVisibility = visibility === "fair" ? "poor" : visibility;

    if (type === "magic") {
      return `/images/magic-hour-${imageVisibility}.jpg`;
    } else if (type === "blue") {
      return `/images/blue-moment-${imageVisibility}.jpg`;
    } else if (type === "halo") {
      return `/images/halo-${imageVisibility}.jpg`;
    }
  };

  const getAltText = () => {
    if (type === "magic") return "マジックアワー";
    if (type === "blue") return "ブルーモーメント";
    return "ハロ";
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 4 } }}
    >
      <Box
        component="img"
        src={getImageSrc()}
        alt={getAltText()}
        onLoad={() => setImageLoaded(true)}
        sx={{
          width: size,
          height: size,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          objectFit: "cover",
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in",
        }}
        onError={(e) => {
          if (type === "halo") {
            e.currentTarget.src = `/images/halo-good.jpg`;
          } else {
            e.currentTarget.src = `/images/${
              type === "magic" ? "magic-hour" : "blue-moment"
            }-good.jpg`;
          }
        }}
      />
    </Box>
  );
};
