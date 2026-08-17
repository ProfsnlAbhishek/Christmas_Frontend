import * as React from "react";
import { Alert, Snackbar } from "@mui/material";

type Props = {
  open: boolean;
  msg: string;
  sev: "success" | "error" | "warning" | "info";
  onClose: () => void;
};

export default function Toast({ open, msg, sev, onClose }: Props) {
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={sev} variant="filled" sx={{fontSize: "1.1rem"}}>
        {msg}
      </Alert>
    </Snackbar>
  );
}