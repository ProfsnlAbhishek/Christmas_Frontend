import * as React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Donor } from "../../../types/Donor";
import { DonorSchema, type DonorFormValues } from "./DonorSchema";
import { toErrorMessage } from "../../../utlis/errors";
import { useCreateDonor } from "../hooks/useCreateDonor";
import { formatZip, toUpperStr } from "../../../utlis/formatting";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (donor: Donor) => void;
};

export default function NewDonorFormDialog({ open, onClose, onSaved }: Props) {
  const emptyForm = React.useCallback(
    (): DonorFormValues => ({
      donorID: 0,
      donor_name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      pick_date: "",
      pick_assigned_to: "",
      pick_det: "",
      kids_tag: 0,
      age0_11: 0,
      age12abv: 0,
      gift_tag: 0,
      inf_boy: 0,
      inf_girl: 0,
      tod_boy: 0,
      tod_girl: 0,
      age6_10b: 0,
      age6_10g: 0,
      age11_14b: 0,
      age11_14g: 0,
      age15_18b: 0,
      age15_18g: 0,
      toy_dr: false,
      instruction: "",
      active: true,
    }),
    [],
  );

  const {
    control,

    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorFormValues>({
    resolver: zodResolver(DonorSchema),
    defaultValues: emptyForm(),
  });

  const fullFormReset = () => {
    reset(emptyForm());
  };

  const createDonorMutation = useCreateDonor();

  const submit = handleSubmit(async (vals) => {
    try {
      const payload: Donor = {
        donorID: vals.donorID,
        donor_name: vals.donor_name,
        address1: vals.address1 ?? "",
        address2: vals.address2 ?? "",
        city: vals.city ?? "",
        state: vals.state ?? "",
        zip: vals.zip ?? "",
        pick_date: vals.pick_date,
        pick_assigned_to: vals.pick_assigned_to || "",
        pick_det: vals.pick_det || "",
        kids_tag: vals.kids_tag,
        age0_11: vals.age0_11 || 0,
        age12abv: vals.age12abv || 0,
        gift_tag: vals.gift_tag,
        inf_boy: vals.inf_boy,
        inf_girl: vals.inf_girl,
        tod_boy: vals.tod_boy,
        tod_girl: vals.tod_girl,
        age6_10b: vals.age6_10b,
        age6_10g: vals.age6_10g,
        age11_14b: vals.age11_14b,
        age11_14g: vals.age11_14g,
        age15_18b: vals.age15_18b,
        age15_18g: vals.age15_18g,
        toy_dr: vals.toy_dr || false,
        instruction: vals.instruction || "",
        active: vals.active || true,
      };

      if (vals.donorID === 0) {
        const created = await createDonorMutation.mutateAsync(payload);
        onSaved(created);
        fullFormReset();
        onClose();
      }
    } catch (e: unknown) {
      console.error("Donor Addition Failed", toErrorMessage(e));
    }
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
    >
      <DialogTitle>Add New Donor</DialogTitle>

      <DialogContent>
        <Controller
          name="donor_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Donor Name"
              fullWidth
              onChange={(e) => {
                field.onChange(toUpperStr(e.target.value));
              }}
              sx={{ marginTop: 1 }}
              error={!!errors.donor_name}
              helperText={errors.donor_name?.message}
            />
          )}
        />
        <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
          <Controller
            name="address1"
            control={control}
            render={({ field }) => (
              <TextField
                label="Address1"
                {...field}
                fullWidth
                onChange={(e) => field.onChange(toUpperStr(e.target.value))}
                error={!!errors.address1}
                helperText={errors.address1?.message}
              />
            )}
          />
          <Controller
            name="address2"
            control={control}
            render={({ field }) => (
              <TextField
                label="Address2"
                {...field}
                fullWidth
                onChange={(e) => field.onChange(toUpperStr(e.target.value))}
                error={!!errors.address2}
                helperText={errors.address2?.message}
              />
            )}
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                label="City"
                {...field}
                fullWidth
                onChange={(e) => field.onChange(toUpperStr(e.target.value))}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                label="State"
                {...field}
                fullWidth
                onChange={(e) =>
                  field.onChange(toUpperStr(e.target.value).slice(0, 2))
                }
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            )}
          />
          <Controller
            name="zip"
            control={control}
            render={({ field }) => (
              <TextField
                label="Zip"
                {...field}
                fullWidth
                onChange={(e) => field.onChange(formatZip(e.target.value))}
                error={!!errors.zip}
                helperText={errors.zip?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={fullFormReset} color="warning" variant="contained">
          Clear Donor
        </Button>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
        <Button onClick={submit} color="success" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
