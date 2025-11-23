import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export const AboutPage: React.FC = () => {
  return (
    <Card
      elevation={8}
      sx={{
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        width: "100%",
      }}
    >
      <CardContent sx={{ p: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 500, color: "#1e293b", mb: 3 }}
        >
          Skyleについて
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#475569", lineHeight: 1.8, mb: 2 }}
        >
          日常に小さな余白と彩りを添える、空の美しい時間をお知らせするアプリです。
        </Typography>
        <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8 }}>
          マジックアワーとブルーモーメントの時刻を確認して、空の特別な瞬間を楽しんでください。
        </Typography>
      </CardContent>
    </Card>
  );
};
