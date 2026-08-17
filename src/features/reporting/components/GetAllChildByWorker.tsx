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
import { getAllChildsByWorker } from "../../../api/reporting";
import { toErrorMessage } from "../../../utlis/errors";
import { useChildAssociatedWorker } from "../../employees/hooks/useChildAssociatedWorker";



type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (accepted: boolean) => void;
};


export default function GetAllChildByWorker({ open, onClose, onSuccess }: Props) {
  const [id, setID] = React.useState<number | null>(0);

  const { data: allWorkers } = useChildAssociatedWorker();
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
      await getAllChildsByWorker(id, (p: number) => setProgress(p));
      setProgress(100);
      setDownloading(false);
      onSuccess(true);
      onClose();
    } catch (e: unknown) {
            console.error("Failed to get childs associated with worker", toErrorMessage(e))
      setDownloading(false);
      onClose();
    }
  };

  React.useEffect(() => {
    if (!open) {
      setID(0);
    }
  }, [open]);

  const workerOptions = React.useMemo(
    () => [{ workerID: 0, worker_name: "All" }, ...(allWorkers ?? [])],
    [allWorkers],
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
      <DialogTitle>Report All Child By Worker</DialogTitle>
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
            options={workerOptions}
            value={workerOptions.find((d) => d.workerID === id) ?? workerOptions[0]}
            onChange={(_, value) => setID(value?.workerID ?? 0)}
            getOptionLabel={(option) => option.worker_name}
            isOptionEqualToValue={(option, value) =>
              option.workerID === value.workerID
            }
            renderInput={(params) => (
              <TextField {...params} label="Worker" margin="normal" fullWidth />
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
