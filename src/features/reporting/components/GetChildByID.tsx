import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  LinearProgress,
  Slider,
  Typography,
} from "@mui/material";
import { getAllChildByID } from "../../../api/reporting";
import { toErrorMessage } from "../../../utlis/errors";
import { useChild } from "../../child/hooks/useChild";



type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (accepted: boolean) => void;
};

export default function GetAllChildByID({ open, onClose, onSuccess }: Props) {
  const [id, setID] = React.useState<number | null>(0);

  const { data: allChilds } = useChild();
  const [downloading, setDownloading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  

  const onSubmit = async () => {
    if (id === null) {
      console.log("IDNOTSET");
      return;
    }

    try {
      setDownloading(true);
      setProgress(0);
      await getAllChildByID(id, (p: number) => setProgress(p));
      setProgress(100);
      setDownloading(false);
      onSuccess(true);
      onClose();
    } catch (e: unknown) {
      console.error("Getting childs by ID failed", toErrorMessage(e));
      setDownloading(false);
      onClose();
    }
  };

  React.useEffect(() => {
    if (!open) {
      setID(0);
    }
  }, [open]);



  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
      <DialogTitle>Print Child By ID</DialogTitle>
      <DialogContent>
        {downloading ? (
          <Box sx={{ width: "100%", mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Downloading report... {progress > 0 ? `${progress}%` : ``}
            </Typography>
            <LinearProgress variant={progress > 0 ? "determinate" : "indeterminate"} value={progress} />
            <Box sx={{ mt: 2 }}>
              <Slider value={progress} disabled aria-label="download-progress" />
            </Box>
          </Box>
        ) : (
          <Autocomplete
            options={allChilds ?? []}
            value={allChilds?.find((c) => c.childID === id) ?? null}
            onChange={(_, value) => setID(value?.childID ?? 0)}
            getOptionLabel={(option) =>option.childID + ": " + option.f_name + " " + option.l_name}
            isOptionEqualToValue={(option, value) =>
              option.childID === value.childID
            }
            renderInput={(params) => (
              <TextField {...params} label="Child" margin="normal" fullWidth />
            )}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={downloading}>
          Get Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}
