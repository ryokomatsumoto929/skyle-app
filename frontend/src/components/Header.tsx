import React from "react";
import { Box, Container, IconButton, Paper, Typography } from "@mui/material";
import { Menu as MenuIcon, Close } from "@mui/icons-material";

interface HeaderProps {
  open: boolean;
  demoMode: boolean;
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({ open, demoMode, onMenuClick }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: 0,
        mb: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 3,
          }}
        >
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 200,
                color: "#1e293b",
                letterSpacing: "0.1em",
                mb: 0.5,
              }}
            >
              Skyle
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontWeight: 300 }}
            >
              空に余白と彩りを
            </Typography>
            {demoMode && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  color: "#3b82f6",
                  fontWeight: 500,
                  fontSize: "0.7rem",
                }}
              >
                プレビューモード
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={onMenuClick}
            sx={{
              backgroundColor: "white",
              boxShadow: 2,
              "&:hover": { backgroundColor: "white", boxShadow: 4 },
            }}
          >
            {open ? <Close /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Container>
    </Paper>
  );
};
