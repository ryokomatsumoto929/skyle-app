import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Cloud } from "@mui/icons-material";
import { NextMoment, WeatherData } from "../types";
import { MomentIcon } from "./MomentIcon";

interface MomentCardProps {
  nextMoment: NextMoment;
  weatherData: WeatherData;
}

export const MomentCard: React.FC<MomentCardProps> = ({
  nextMoment,
  weatherData,
}) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        width: "100%",
        animation: "fadeSlideUp 0.7s ease-out",
        "@keyframes fadeSlideUp": {
          from: {
            opacity: 0,
            transform: "translateY(8px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <MomentIcon
        type={nextMoment.type}
        visibility={nextMoment.visibility}
        size={120}
      />

      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          width: "calc(100% - 32px)",
          mx: "auto",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 6 } }}>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 400,
              color: "#94a3b8",
              letterSpacing: "0.15em",
              fontSize: "0.7rem",
              mb: 0.5,
            }}
          >
            {nextMoment.type === "magic" ? "Magic Hour" : "Blue Moment"}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 200,
              color: "#0f172a",
              mb: 1,
              letterSpacing: "-0.03em",
              fontSize: { xs: "3.5rem", sm: "5rem" },
            }}
          >
            {nextMoment.time}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#cbd5e1",
              mb: { xs: 2, sm: 4 },
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
          >
            {nextMoment.timeRange}
          </Typography>

          <Box
            sx={{
              mb: { xs: 2, sm: 4 },
              py: { xs: 2, sm: 3 },
              borderTop: "1px solid rgba(203, 213, 225, 0.3)",
              borderBottom: "1px solid rgba(203, 213, 225, 0.3)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.9rem",
                mb: 2,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              {weatherData.visibility}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Cloud sx={{ fontSize: 16, color: "#94a3b8" }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                    fontSize: "0.8rem",
                    fontWeight: 300,
                  }}
                >
                  {weatherData.clouds}%
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  fontWeight: 300,
                }}
              >
                {weatherData.description}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              lineHeight: 1.9,
              fontWeight: 300,
              fontSize: "0.95rem",
            }}
          >
            {nextMoment.message}
          </Typography>

          {weatherData?.haloVisibility && (
            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: "1px solid rgba(203, 213, 225, 0.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src={`/images/halo-${
                  weatherData.haloVisibility.level === "fair"
                    ? "poor"
                    : weatherData.haloVisibility.level
                }.jpg`}
                alt="ハロ"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  objectFit: "cover",
                }}
                onError={(e: any) => {
                  e.currentTarget.src = `/images/halo-good.jpg`;
                }}
              />
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 400,
                    color: "#94a3b8",
                    letterSpacing: "0.15em",
                    fontSize: "0.65rem",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Halo Forecast
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.85rem",
                    fontWeight: 300,
                  }}
                >
                  {weatherData.haloVisibility.message}
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
