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

import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Contact } from "../../../types/DonorContact";
import { useQueryClient } from "@tanstack/react-query";
import {
  DonorContactSchema,
  type DonorContactFormValues,
} from "./DonorContactSchema";
import { useCreateDonorContact } from "../hooks/useCreateDonorContact";
import { toErrorMessage } from "../../../utlis/errors";
import { formatPhone, toUpperStr } from "../../../utlis/formatting";

type Props = {
  open: boolean;
  onClose: () => void;
  donorID: number;
  onUpdate: (contact: Contact) => void; 
};

export default function DonorContactFormDialog({
  open,
  onClose,
  donorID,
  onUpdate,
}: Props) {


 const emptyForm = React.useCallback(
  (): DonorContactFormValues => ({
    contactID: 0,
    contact_name: "",
    contact_phone: "",
    email: "",
    alternate_phone: "",
    fax: "",
  }),
  []
);


  const {
    control,

    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorContactFormValues>({
    resolver: zodResolver(DonorContactSchema) as Resolver<DonorContactFormValues>,
    defaultValues: emptyForm(),
  });

  const fullFormReset = () => {
    reset(emptyForm());
  };

const queryClient = useQueryClient();
  const createMutation = useCreateDonorContact();


  const submit = handleSubmit(async (vals) => {
    try {
      const payload: Contact = {
        contactID: vals.contactID,
        donorID: donorID,
        contact_name: vals.contact_name,
        contact_phone: vals.contact_phone || "",
        email: vals.email || "",
        alternate_phone: vals.alternate_phone || "",
        fax: vals.fax || "",
      };

      if (vals.contactID === 0) {
        const updated = await createMutation.mutateAsync(payload);
        fullFormReset();
        onClose();
        onUpdate(updated);

         await queryClient.invalidateQueries({
       queryKey: ["kare", "donors", 'contact', updated.donorID] // replace with your actual query key
      });
         
      }
    } catch (e: unknown) {
      console.error("Donor Contact Addition Failed", toErrorMessage(e));
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Contact</DialogTitle>

      <DialogContent>
        <Controller
          name="contact_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Contact Name"
              fullWidth
              onChange={(e) => {
                field.onChange(toUpperStr(e.target.value));
              }}
              sx={{ marginTop: 1 }}
              error={!!errors.contact_name}
              helperText={errors.contact_name?.message}
            />
          )}
        />
        <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
          <Controller
            name="contact_phone"
            control={control}
            render={({ field }) => (
              <TextField
                label="Contact Phone"
                {...field}
                fullWidth
                onChange={(e) => field.onChange(formatPhone( toUpperStr(e.target.value)))}
                error={!!errors.contact_phone}
                helperText={errors.contact_phone?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                label="Email"
                type="email"
                {...field}
                fullWidth
                onChange={(e) => field.onChange(toUpperStr(e.target.value))}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
          <Controller
            name="alternate_phone"
            control={control}
            render={({ field }) => (
              <TextField
                label="City"
                {...field}
                fullWidth
                onChange={(e) => field.onChange(toUpperStr(e.target.value))}
                error={!!errors.alternate_phone}
                helperText={errors.alternate_phone?.message}
              />
            )}
          />
          <Controller
            name="fax"
            control={control}
            render={({ field }) => (
              <TextField
                label="Fax"
                {...field}
                fullWidth
                onChange={(e) => field.onChange(toUpperStr(e.target.value))}
                error={!!errors.fax}
                helperText={errors.fax?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={fullFormReset} color="warning" variant="contained">
          Clear Form
        </Button>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
        <Button color="success" variant="contained" onClick={submit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
