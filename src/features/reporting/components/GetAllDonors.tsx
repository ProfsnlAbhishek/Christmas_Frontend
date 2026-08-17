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
  Slider,
  LinearProgress,
  Typography,
} from "@mui/material";

import { toErrorMessage } from "../../../utlis/errors";
import { useDonor } from "../../donor/hooks/useDonor";
import { getDonorInformation } from "../../../api/reporting";



type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess : (accepted: boolean) => void;
};

export default function GetAllDonors({ open, onClose, onSuccess }: Props) {
  const [id, setID] = React.useState<number | null>(0);
  const [downloading, setDownloading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const { data: allDonors } = useDonor();

  const onSubmit = async () => {
    if (id === null) {
      console.log("IDNOTSET");
      return;
    }

    try {
        setDownloading(true);
        setProgress(0);
        await getDonorInformation(id, (p: number) => setProgress(p));
        setProgress(100);
        setDownloading(false);
        onSuccess(true);
        onClose();
    } catch (e: unknown) {
      console.error("Get all donors failed", toErrorMessage(e));
      setDownloading(false);
      onClose();
    }
  };

  React.useEffect(() => {
    if (!open) {
      setID(0);
    }
  }, [open]);

  const donorOptions = React.useMemo(
    () => [{ donorID: 0, donor_name: "All" }, ...(allDonors ?? [])],
    [allDonors],
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
      <DialogTitle>Print Donor Information</DialogTitle>
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
          <>
            <Autocomplete
              options={donorOptions}
              value={donorOptions.find((d) => d.donorID === id) ?? donorOptions[0]}
              onChange={(_, value) => setID(value?.donorID ?? 0)}
              getOptionLabel={(option) => option.donor_name}
              isOptionEqualToValue={(option, value) =>
                option.donorID === value.donorID
              }
              renderInput={(params) => (
                <TextField {...params} label="Worker" margin="normal" fullWidth />
              )}
            />
          </>
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
