import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { ChildSchema, type ChildFormValues } from "../components/ChildSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRace } from "../../race/hooks/useRace";
import { useClothingTypes } from "../../clothing/hooks/useClothingTypes";
import { useClothingSizes } from "../../clothing/hooks/useClothingSizes";
import { useGiftCard } from "../hooks/useGiftCard";
import { useAllActiveEmployees } from "../../employees/hooks/useAllActiveEmployees";
import type { Employee } from "../../../types/Employee";
import ChildTable from "../components/ChildTable";
import type { Child } from "../../../types/Child";
import light from "../../../images/lights.png";
import light_side from "../../../images/lights_side.png";
import christmas_small from "../../../images/christmas_small.jpg";
import { useCreateChild } from "../hooks/useCreateChild";
import { useUpdateChild } from "../hooks/useUpdateChild";
import { toErrorMessage } from "../../../utlis/errors";
import { useDeleteChild } from "../hooks/useDeleteChild";
import { toUpperStr } from "../../../utlis/formatting";
import { useDonor } from "../../donor/hooks/useDonor";
import { useArchiveChild } from "../../archive/hooks/useArchiveChild";

import useDymo from "../../../hooks/useDymo";
import Toast from "../../../utlis/Toast";

export default function Child() {
  const [selectedChild, setSelectedChild] = React.useState<Child | null>(null);
  const [multipleSelectedChildren, setMultipleSelectedChildren] =
    React.useState<Child[]>([]);

  const [toast, setToast] = React.useState<{
    open: boolean;
    msg: string;
    sev: "success" | "info" | "warning" | "error";
  } | null>(null);

  const emptyForm = React.useCallback(
    (): ChildFormValues => ({
      childID: 0,
      f_name: "",
      l_name: "",
      age: null,
      sacwisID: 0,
      gender: "",
      race: "",
      clothing_type: null,
      size: "",
      shoe_size: null,
      gift_card: "",
      workerID: 0,
      donorID: 0,
      suggestion: "",
    }),
    [],
  );

  const mapChildToFormValues = React.useCallback(
    (child: Child): ChildFormValues => ({
      childID: child.childID ?? 0,
      f_name: child.f_name ?? "",
      l_name: child.l_name ?? "",
      age: child.age ?? null,
      sacwisID: child.sacwisID ?? 0,
      gender: child.gender ?? "",
      race: child.race ?? "",
      clothing_type: child.clothing_type ? Number(child.clothing_type) : null,
      size: child.size ?? "",
      shoe_size: child.shoe_size ?? null,
      gift_card: child.gift_card ?? "",
      workerID: child.workerID ?? 0,
      donorID: child.donorID ?? 0,
      suggestion: child.suggestion ?? "",
    }),
    [],
  );
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ChildFormValues>({
    resolver: zodResolver(ChildSchema),
    defaultValues: selectedChild
      ? mapChildToFormValues(selectedChild)
      : emptyForm(),
  });

  const fullFormReset = () => {
    setSelectedChild(null);
    reset(emptyForm());
    setToast({ open: true, msg: "Form Cleared", sev: "info" });
  };

  const { data: race } = useRace();
  const { data: clothing_type } = useClothingTypes();

  const clothingTypeValue = watch("clothing_type");

  // Ensure a number is passed to useClothingSizes (hook expects a number)
  const { data: clothing_size } = useClothingSizes(clothingTypeValue ?? 0);

  const { data: gift_card_types } = useGiftCard();
  const { data: allEmployees, isLoading: employeesLoading } =
    useAllActiveEmployees();

  const grabSelectedProvider = React.useCallback(
    (rows: Child[]) => {
      setMultipleSelectedChildren(rows);

      const firstSelected = rows[0] ?? null;

      setSelectedChild(firstSelected);

      if (firstSelected) {
        reset(mapChildToFormValues(firstSelected));
      } else {
        reset(emptyForm());
      }
    },
    [reset, mapChildToFormValues, emptyForm],
  );

  const createMutation = useCreateChild();
  const updateMutation = useUpdateChild(selectedChild?.childID ?? NaN);

  const { data: allDonors, isLoading: allDonorsLoading } = useDonor();

  const submit = handleSubmit(async (vals) => {
    try {
      const payload: Child = {
        childID: vals.childID,
        f_name: vals.f_name,
        l_name: vals.l_name,
        age: vals.age,
        sacwisID: vals.sacwisID,
        gender: vals.gender,
        race: vals.race ?? "",
        clothing_type: vals.clothing_type,
        size: vals.size,
        shoe_size: vals.shoe_size,
        gift_card: vals.gift_card,
        workerID: vals.workerID,
        donorID: vals.donorID,
        suggestion: vals.suggestion,
      };

      if (!selectedChild) {
        const created = await createMutation.mutateAsync(payload);
        setSelectedChild(created);
        reset(created as ChildFormValues);

        setToast({
          open: true,
          msg: "Child Creation Successful",
          sev: "success",
        });
      } else {
        const updated = await updateMutation.mutateAsync(payload);

        setSelectedChild(updated);

        setMultipleSelectedChildren((prev) =>
          prev.length === 0
            ? [updated]
            : prev.map((child) =>
                child.childID === updated.childID ? updated : child,
              ),
        );

        reset(mapChildToFormValues(updated));

        setToast({
          open: true,
          msg: "Child Update Successful",
          sev: "success",
        });
      }
    } catch (e: unknown) {
      console.error("Child save failed", toErrorMessage(e));
      setToast({ open: true, msg: "Failed", sev: "error" });
    }
  });

  const deleteMutation = useDeleteChild();

  const onDelete = async (childID: number) => {
    try {
      await deleteMutation.mutateAsync(childID);
      reset(emptyForm());
      setSelectedChild(null);
      setToast({ open: true, msg: "Delete Successful", sev: "success" });
    } catch (e) {
      console.error("Delete failed", toErrorMessage(e));
    }
  };

  const archiveChildren = useArchiveChild();
  const [onOpen, setOnOpen] = React.useState<boolean>(false);
  const [onDeleteOpen, setOnDeleteOpen] = React.useState<boolean>(false);
  const confirmDeleteRef = React.useRef("");

  const onClose = () => setOnOpen(false);
  const onDeleteClose = () => setOnDeleteOpen(false);

  const opendeletephase2 = () => {
    setOnOpen(false);
    setOnDeleteOpen(true);
  };

  const openAuth = () => {
    setOnOpen(true);
  };

  const finalArchive = () => {
    if (confirmDeleteRef.current.toLowerCase() === "archive") {
      setOnDeleteOpen(false);
      archiveChildren.mutate();
      fullFormReset();
      setToast({ open: true, msg: "Archived All the data", sev: "success" });
    } else {
      setToast({ open: true, msg: "Archive Failed", sev: "error" });
    }
  };

  const { loaded, loadLabel, printLabelXml } = useDymo();

  const handlePrint = async () => {
    if (!loaded) {
      alert("DYMO not ready");
      return;
    }

    if (multipleSelectedChildren.length === 0) {
      alert("Select at least one child");
      return;
    }

    try {
      for (const child of multipleSelectedChildren) {
        if (child.gift_card !== "") {
          const xml = await loadLabel("/Christmas/child_gift.dymo");

          const label = window.dymo.label.framework.openLabelXml(xml);

          label.setObjectText("child_name", `${child.f_name}`);
          label.setObjectText("age", String(child.age ?? ""));

          label.setObjectText(
            "gender",
            child.gender === "MALE" ? "BOY" : "GIRL",
          );

          label.setObjectText("race", child.race ?? "");

          label.setObjectText("certificate", "X");
          label.setObjectText("store", child.gift_card ?? "");

          label.setObjectText(
            "worker",
            (() => {
              const employee = allEmployees?.find(
                (e) => e.Employee_Index === child.workerID,
              );

              return employee
                ? `${employee.First_Name} ${employee.Last_Name}`
                : "";
            })(),
          );

          label.setObjectText("id", String(child.childID ?? ""));

          await printLabelXml(label.toString());
        } else {
          const xml = await loadLabel("/Christmas/child_clothes.dymo");

          const label = window.dymo.label.framework.openLabelXml(xml);

          label.setObjectText("child_name", `${child.f_name}`);
          label.setObjectText("age", String(child.age ?? ""));

          label.setObjectText(
            "gender",
            child.gender === "MALE" ? "BOY" : "GIRL",
          );

          label.setObjectText("race", child.race ?? "");

          label.setObjectText("shoes", child.shoe_size ?? "");

          label.setObjectText(
            "clo_for",
            clothing_type?.find((e) => e.typeID === Number(child.clothing_type))
              ?.clothing_type ?? "",
          );

          label.setObjectText("clo_size", child.size ?? "");

          label.setObjectText(
            "worker",
            (() => {
              const employee = allEmployees?.find(
                (e) => e.Employee_Index === child.workerID,
              );

              return employee
                ? `${employee.First_Name} ${employee.Last_Name}`
                : "";
            })(),
          );

          label.setObjectText("id", String(child.childID ?? ""));
          label.setObjectText("suggestions", child.suggestion ?? "");

          await printLabelXml(label.toString());
        }
      }

      setToast({
        open: true,
        msg: `${multipleSelectedChildren.length} Labels Printed`,
        sev: "success",
      });
    } catch (e: unknown) {
      console.error("Print Label Failed", toErrorMessage(e));

      setToast({
        open: true,
        msg:
          (e instanceof Error ? e.message : String(e)) || "Label Print Failed",
        sev: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          backgroundImage: `url(${christmas_small})`,
          height: "250px",
          width: "150px",
          backgroundSize: "80%",
          backgroundRepeat: "no-repeat",
          bottom: -150,
          left: 0,
          zIndex: 100,
        }}
      />
      <Stack direction="column" spacing={2}>
        <Box
          sx={{
            width: "100%",
            height: "130px",

            backgroundImage: `url(${light})`,
            backgroundSize: "contain",
            animation: "colorCycle 2s linear infinite",
            "@keyframes colorCycle": {
              "0%": { filter: "hue-rotate(0deg)" },
              "25%": { filter: "hue-rotate(90deg)" },
              "50%": { filter: "hue-rotate(180deg)" },
              "75%": { filter: "hue-rotate(270deg)" },
              "100%": { filter: "hue-rotate(360deg)" },
            },
          }}
        />

        <Stack direction="row">
          <Box
            sx={{
              width: "8%",
              marginTop: "-75px",
              backgroundImage: `url(${light_side})`,
              backgroundSize: "contain",
              animation: "colorCycle 2s linear infinite",

              "@keyframes colorCycle": {
                "0%": { filter: "hue-rotate(0deg)" },
                "25%": { filter: "hue-rotate(90deg)" },
                "50%": { filter: "hue-rotate(180deg)" },
                "75%": { filter: "hue-rotate(270deg)" },
                "100%": { filter: "hue-rotate(360deg)" },
              },
            }}
          />

          <Box sx={{ p: 5, width: "75%", flexDirection: "row" }}>
            <Stack direction="row" spacing={2}>
              <Typography variant="h4" component="h2" sx={{ flex: 1 }}>
                ADOPT A CHILD
              </Typography>

              <Button
                variant="contained"
                color="warning"
                onClick={() => fullFormReset()}
              >
                Clear Form
              </Button>
              <Button variant="contained" color={selectedChild ? "info" : "success"} onClick={submit}>
               {selectedChild ? "Update Child" : "Add Child"}
              </Button>
            </Stack>

            <hr />

            <Stack
              spacing={2}
              sx={{
                mt: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                <TextField
                  {...register("childID")}
                  label="Child ID"
                  type="number"
                  slotProps={{ input: { readOnly: true } }}
                  fullWidth
                />

                <Controller
                  name="f_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                      slotProps={{
                        inputLabel: {
                          shrink: field.value !== "" && field.value !== null,
                        },
                      }}
                      error={!!errors.f_name}
                      helperText={errors.f_name?.message}
                    />
                  )}
                />

                <Controller
                  name="l_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                      slotProps={{
                        inputLabel: {
                          shrink: field.value !== "" && field.value !== null,
                        },
                      }}
                      error={!!errors.l_name}
                      helperText={errors.l_name?.message}
                    />
                  )}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                <Controller
                  name="sacwisID"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="SACWIS ID"
                      fullWidth
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : Number(val));
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink:
                            field.value !== null && field.value !== undefined,
                        },
                      }}
                      error={!!errors.sacwisID}
                      helperText={errors.sacwisID?.message}
                    />
                  )}
                />

                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Age"
                      fullWidth
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : Number(val));
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink:
                            field.value !== null && field.value !== undefined,
                        },
                      }}
                    />
                  )}
                />

                {/* here goes controller for the male  */}
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.gender}>
                      <InputLabel>Gender</InputLabel>
                      <Select {...field} label="Gender">
                        <MenuItem value=""></MenuItem>
                        <MenuItem value="MALE">MALE</MenuItem>
                        <MenuItem value="FEMALE">FEMALE</MenuItem>
                      </Select>
                      {errors.gender && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ marginLeft: 2 }}
                        >
                          {errors.gender.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  name="race"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.race}>
                      <InputLabel>Race</InputLabel>
                      <Select {...field} label="Race">
                        {race?.map((r, i) => (
                          <MenuItem key={i} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.race && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ marginLeft: 2 }}
                        >
                          {errors.race.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                <Controller
                  name="clothing_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.clothing_type}>
                      <InputLabel>Clothing Type</InputLabel>
                      <Select
                        {...field}
                        value={field.value ?? ""}
                        label="Clothing Type"
                        onChange={(e) => {
                          setValue("size", "");
                          field.onChange(Number(e.target.value));
                          setValue("gift_card", "");
                        }}
                        error={!!errors?.clothing_type}
                      >
                        {clothing_type?.map((r, i) => (
                          <MenuItem key={i} value={Number(r.typeID)}>
                            {r.clothing_type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.size}>
                      <InputLabel>Clothing Size</InputLabel>
                      <Select
                        {...field}
                        value={field.value ?? ""}
                        label="Clothing Size"
                        disabled={!clothing_size}
                      >
                        {clothing_size?.map((size, i) => (
                          <MenuItem key={i} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="shoe_size"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Shoe Size"
                      fullWidth
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = toUpperStr(e.target.value);
                        field.onChange(val === "" ? null : val);
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: field.value !== null && field.value !== "",
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="gift_card"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.gift_card}>
                      <InputLabel
                        id="gift-card-label"
                        shrink={!!watch("gift_card")}
                      >
                        Gift Card Types
                      </InputLabel>
                      <Select
                        labelId="gift-card-label"
                        {...field}
                        label="Gift Card Types"
                        onClick={() => {
                          setValue("clothing_type", null);
                          setValue("size", "");
                        }}
                      >
                        {gift_card_types?.map((r, i) => (
                          <MenuItem key={i} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.gift_card && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ marginLeft: 2 }}
                        />
                      )}
                    </FormControl>
                  )}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                {!employeesLoading && (
                  <Controller
                    name="workerID"
                    control={control}
                    render={({ field }) => {
                      const selectedSupervisor =
                        allEmployees?.find(
                          (e) => e.Employee_Index === field.value,
                        ) ?? null;

                      return (
                        <Autocomplete<Employee>
                          fullWidth
                          options={allEmployees || []}
                          value={selectedSupervisor}
                          loading={employeesLoading}
                          onChange={(_, newValue) => {
                            field.onChange(
                              newValue?.Employee_Index ?? undefined,
                            );
                          }}
                          getOptionLabel={(option) =>
                            `${option.First_Name} ${option.Last_Name}`
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.Employee_Index === value.Employee_Index
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Worker"
                              sx={{
                                "& input": {
                                  textTransform: "uppercase",
                                },
                              }}
                              error={!!errors.workerID}
                              helperText={errors.workerID?.message}
                            />
                          )}
                        />
                      );
                    }}
                  />
                )}
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                {!allDonorsLoading && (
                  <Controller
                    name="donorID"
                    control={control}
                    render={({ field }) => {
                      const selectedDonor =
                        allDonors?.find((d) => d.donorID === field.value) ??
                        null;

                      return (
                        <Autocomplete
                          fullWidth
                          options={allDonors || []}
                          loading={allDonorsLoading}
                          value={selectedDonor}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.donorID ?? null);
                          }}
                          getOptionLabel={(donor) => donor?.donor_name || ""}
                          isOptionEqualToValue={(opt, val) =>
                            opt.donorID === val?.donorID
                          }
                          renderInput={(params) => (
                            <TextField {...params} label="Donor Name" />
                          )}
                        />
                      );
                    }}
                  />
                )}
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                <Controller
                  name="suggestion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Gift Suggestion"
                      fullWidth
                      multiline
                      rows={4}
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                      slotProps={{
                        inputLabel: {
                          shrink: field.value !== "" && field.value !== null,
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ padding: 1 }}>
            <ChildTable
              onSelectedRow={grabSelectedProvider}
              onDeleteRow={onDelete}
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginTop: 2 }}
              onClick={openAuth}
            >
              Archive All Childs
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ marginTop: 2, marginLeft: 2 }}
              disabled={multipleSelectedChildren.length === 0}
              onClick={handlePrint}
            >
              Print Label
            </Button>
          </Box>
        </Stack>
      </Stack>

      <Dialog open={onOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3, justifyContent: "center" }}>
          <Typography variant="h6">
            Are you sure you want to delete all the children data?
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
              onClick={opendeletephase2}
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
            Enter "Archive" to delete all. This cannot be undone!
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "center" }}
          >
            <TextField
              label="Enter Archive"
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
            <Button variant="contained" color="success" onClick={finalArchive}>
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
