import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import type { Lottery } from "../../../types/Lottery";
import {
  LotterySchema,
  type LotteryFormValues,
} from "../components/LotterySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import LotteryTable from "../components/LotteryTable";
import { useUpdateSold } from "../hooks/useUpdateSold";
import { useUpdateLottery } from "../hooks/useUpdateLottery";
import { toErrorMessage } from "../../../utlis/errors";
import { useDeleteLottery } from "../hooks/useDeleteLottery";
import { useArchiveLottery } from "../hooks/useArchiveLottery";
import { toUpperStr } from "../../../utlis/formatting";
import Toast from "../../../utlis/Toast";

const DollarRain = React.memo(() => {
  const notes = Array.from({ length: 40 });

  return notes.map((_, i) => {
    const style: React.CSSProperties = {
      position: "absolute",
      top: "-50px",
      left: `${Math.random() * 100}vw`,
      fontSize: `${Math.random() * 30 + 20}px`,
      color: "rgba(0, 100, 0, 0.4)",
      animation: `fall ${Math.random() * 4 + 4}s linear infinite`,
      animationDelay: `${Math.random() * 5}s`,
    };
    return (
      <div key={i} style={style}>
        💵
      </div>
    );
  });
});

export default function Lottery() {
  const [selectedLottery, setSelectedLottery] = React.useState<Lottery | null>(
    null,
  );

  const [toast, setToast] = React.useState<{
    open: boolean;
    msg: string;
    sev: "error" | "success" | "info" | "warning";
  } | null>(null);

  const emptyForm = React.useCallback(
    (): LotteryFormValues => ({
      ticketID: "",
      packetID: 0,
      sold_by: "",
      purchased_by: "",
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    watch,
    reset,

  } = useForm<LotteryFormValues>({
    resolver: zodResolver(LotterySchema),
    defaultValues: selectedLottery ?? {
      ticketID: "",
      packetID: 0,
      sold_by: "",
      purchased_by: "",
    },
  });

  const grabSelectedLottery = (row: Lottery) => {
    setSelectedLottery(row);
    reset({
      ...row,
    });
  };

  const fullFormReset = () => {
    setSelectedLottery(null);
    reset(emptyForm());
    setToast({ open: true, msg: "Form Cleared", sev: "warning" });
  };

  const ticketID = watch("ticketID");
  const packetID = watch("packetID");

  const updateSold = useUpdateSold(packetID || 0);
  const updateLottery = useUpdateLottery(Number(ticketID) || 0);

  const submit = handleSubmit(async (vals) => {
    try {
      const payload: Lottery = {
        ticketID: vals.ticketID,
        packetID: vals.packetID,
        sold_by: vals.sold_by!,
        purchased_by: vals.purchased_by!,
      };

      if (
        ticketID[ticketID.length - 1] === "0" &&
        payload.sold_by !== selectedLottery?.sold_by
      ) {
        const lottery = await updateSold.mutateAsync(payload);
        if (selectedLottery?.purchased_by !== payload.purchased_by) {
          await updateLottery.mutateAsync(payload);
        }

        setSelectedLottery(lottery);
      } else if (
        ticketID[ticketID.length - 1] === "0" &&
        payload.sold_by === selectedLottery?.sold_by
      ) {
        await updateLottery.mutateAsync(payload);
      } else {
        await updateLottery.mutateAsync(payload);
      }

      setToast({ open: true, msg: "Lottery Updated", sev: "success" });
    } catch (e: unknown) {
      console.error("Update lottery failed", toErrorMessage(e));
      setToast({ open: true, msg: "Lottery Update Failed", sev: "error" });
    }
  });

  const deleteLottery = useDeleteLottery(Number(ticketID) || 0);

  const onDeleted = (row: Lottery) => {
    (async () => {
      try {
        await deleteLottery.mutateAsync(row);
        reset(emptyForm());
        setToast({ open: true, msg: "Lottery Deleted", sev: "success" });
      } catch (e: unknown) {
        console.error("Lottery Deletion Failed", toErrorMessage(e));
        setToast({ open: true, msg: "Lottery Delete Failed", sev: "error" });
      }
    })();
  };

  const upadateMutation = useArchiveLottery();

  const [onOpen, setOnOpen] = React.useState<boolean>(false);

  const [onDeleteOpen, setOnDeleteOpen] = React.useState<boolean>(false);

  const confirmDeleteRef = React.useRef("");

  const onClose = () => setOnOpen(false);
  const onDeleteClose = () => setOnDeleteOpen(false);

  const clearingLottery = () => {
    setOnOpen(true);
  };
  const deleteLotteryData = () => {
    setOnOpen(false);
    setOnDeleteOpen(true);
  };

  const finalDelete = () => {
    if (confirmDeleteRef.current.toLowerCase() === "delete") {
      setOnDeleteOpen(false);
      upadateMutation.mutate();
      fullFormReset();
      setToast({ open: true, msg: "All Lottery Cleared", sev: "success" });
    } else {
      setToast({ open: true, msg: "Clearing Failed", sev: "error" });
    }
  };

  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        height: "92.5vh",
        width: "100vw",
        backgroundColor: "lightgreen",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(-10vh) rotate(0deg);
              opacity: 0.9;
            }
            100% {
              transform: translateY(110vh) rotate(360deg);
              opacity: 0.6;
            }
          }
        `}
      </style>

      <DollarRain />

      <Stack direction="row" spacing={2}>
        {/* Your content */}
        <Box sx={{ p: 5, width: "70%", flexDirection: "row" }}>
          <Box
            sx={{
              p: 2,
              width: "100%",
              flexDirection: "row",
              background: "rgba(255, 255, 255, 0.4)", // translucent white
              backdropFilter: "blur(10px)", // blur behind content
              WebkitBackdropFilter: "blur(10px)", // safari support
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.3)", // soft outline
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)", // subtle shadow
            }}
          >
            <Stack direction="row" spacing={2}>
              <Typography variant="h4" component="h2" sx={{ flex: 1 }}>
                LOTTERY
              </Typography>

              <Button
                variant="contained"
                color="warning"
                onClick={fullFormReset}
              >
                Clear Lottery
              </Button>
              <Button variant="contained" color="info" onClick={submit}>
                Update Lottery
              </Button>
            </Stack>

            <hr />

            <Stack
              spacing={2}
              sx={{
                mt: 3,
              }}
            >
              <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                <Controller
                  name="ticketID"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="TicketID"
                      {...field}
                      fullWidth
                      value={field.value ?? -1}
                      slotProps={{ input: { readOnly: true } }}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />

                <Controller
                  name="packetID"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Packet ID"
                      {...field}
                      value={field.value ?? 0}
                      fullWidth
                      slotProps={{ input: { readOnly: true } }}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                <Controller
                  name="sold_by"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Sold By"
                      {...field}
                      fullWidth
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                    />
                  )}
                />

                {/* here goes controller for the male  */}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                <Controller
                  name="purchased_by"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Purchased By"
                      {...field}
                      fullWidth
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                    />
                  )}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              ></Stack>

              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              ></Stack>
            </Stack>
          </Box>
          <Box sx={{ padding: 2 }}>{/* Table goes here */}</Box>
        </Box>
        <Box sx={{ padding: 2, width: "40%" }}>
          <LotteryTable
            onSelectedRow={grabSelectedLottery}
            onDeleteRow={onDeleted}
          />

          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: 2 }}
            onClick={clearingLottery}
          >
            Clear All Lottery
          </Button>
        </Box>
      </Stack>

      <Dialog open={onOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3, justifyContent: "center" }}>
          <Typography variant="h6">
            Are you sure you want to delete all the lottery data?
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "center" }}
          >
            <Button variant="contained" color="error" onClick={onClose}>
              NO
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={deleteLotteryData}
            >
              YES
            </Button>
          </Stack>
        </Box>
      </Dialog>

      <Dialog
        open={onDeleteOpen}
        onClose={onDeleteClose}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">
            Enter "Delete" to delete all. This cannot be undone!
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "center" }}
          >
            <TextField
              label="Enter Delete"
              onChange={(e) => (confirmDeleteRef.current = e.target.value)}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                confirmDeleteRef.current = "";
                setOnDeleteOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={finalDelete}>
              Confirm
            </Button>
          </Stack>
        </Box>
      </Dialog>
      {toast && (
        <Toast
          open={toast.open}
          msg={toast.msg}
          sev={toast.sev}
          onClose={() => setToast(null)}
        />
      )}
    </Box>
  );
}
