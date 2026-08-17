import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";

import { Paper } from "@mui/material";

import { useDonorContactByID } from "../hooks/useDonorContactByID";

import { zodResolver } from "@hookform/resolvers/zod";
import { DonorSchema, type DonorFormValues } from "../components/DonorSchema";

import light from "../../../images/lights.png";
import light_side from "../../../images/lights_side.png";
import stocking_icon from "../../../images/christmas-stocking-icon.png";
import tag from "../../../images/tag.png";
import type { Donor } from "../../../types/Donor";
import { useDonor } from "../hooks/useDonor";
import type { Contact } from "../../../types/DonorContact";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import NewDonorFormDialog from "../components/NewDonorFormDialog";
import { useUpdateDonor } from "../hooks/useUpdateDonor";
import { toErrorMessage } from "../../../utlis/errors";
import DonorContactFormDialog from "../components/DonorContactFormDialog";
import { useDeleteDonorContact } from "../hooks/useDeleteDonorContact";
import { useArchiveDonors } from "../../archive/hooks/useArchiveDonors";
import { useAllChildByDonor } from "../../child/hooks/useAllChildByDonor";
import { useAllUnAssociated } from "../../child/hooks/useAllUnAssociated";
import type { ChildSmall } from "../../../types/Child";
import { useAssociateChildToDonor } from "../../child/hooks/useAssociateChildToDonor";
import { useDissociateChildFromDonor } from "../../child/hooks/useDissociateChildFromDonor";
import { formatZip, toUpperStr } from "../../../utlis/formatting";
import Toast from "../../../utlis/Toast";


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{ p: 3, border: 1, borderRadius: 3, mt: 4, borderColor: "gray" }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function indexProp(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function Donor() {
  const [selectedDonor, setSelectedDonor] = React.useState<Donor | null>(null);

  const [toast, setToast] = React.useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error" | "info" | "warning";
  } | null>(null);

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

  const formatDateTime = (value?: string) => {
    if (!value) return "";
    return value.replace(" ", "T").slice(0, 16);
  };

  const mapDonorToFormValues = (donor: Donor): DonorFormValues => ({
    donorID: donor.donorID ?? 0,
    donor_name: donor.donor_name ?? "",
    address1: donor.address1 ?? "",
    address2: donor.address2 ?? "",
    city: donor.city ?? "",
    state: donor.state ?? "",
    zip: donor.zip ?? "",
    pick_date: formatDateTime(donor.pick_date) ?? "",
    pick_assigned_to: donor.pick_assigned_to ?? "",
    pick_det: donor.pick_det ?? "",
    kids_tag: donor.kids_tag ?? 0,
    age0_11: donor.age0_11 ?? 0,
    age12abv: donor.age12abv ?? 0,
    gift_tag: donor.gift_tag ?? 0,
    inf_boy: donor.inf_boy ?? 0,
    inf_girl: donor.inf_girl ?? 0,
    tod_boy: donor.tod_boy ?? 0,
    tod_girl: donor.tod_girl ?? 0,
    age6_10b: donor.age6_10b ?? 0,
    age6_10g: donor.age6_10g ?? 0,
    age11_14b: donor.age11_14b ?? 0,
    age11_14g: donor.age11_14g ?? 0,
    age15_18b: donor.age15_18b ?? 0,
    age15_18g: donor.age15_18g ?? 0,
    toy_dr: donor.toy_dr ?? false,
    instruction: donor.instruction ?? "",
    active: donor.active ?? true,
  });

  const {
    control,
    register,
    watch,
    setValue,

    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DonorFormValues>({
    resolver: zodResolver(DonorSchema),
    defaultValues: selectedDonor
      ? mapDonorToFormValues(selectedDonor)
      : emptyForm(),
  });

  const donorID = useWatch({
    control,
    name: "donorID",
  });

  const fullFormReset = () => {
    setSelectedDonor(null);
    reset(emptyForm());
    setToast({open: true, msg:"Form Cleared", sev: "warning"})
  };

  const { data: allDonors, isLoading: allDonorsLoading } = useDonor();


  const [inputValue, setInputValue] = React.useState<string>("");
  const [tabValue, setTabValue] = React.useState<number>(0);

  const handleTab = (event: React.SyntheticEvent, newVal: number) => {
    event.preventDefault();
    setTabValue(newVal);
  };

  const deleteMutation = useDeleteDonorContact();
  const onDelete = async (contactID: number) => {
    try {
      await deleteMutation.mutateAsync({
        contactID,
        donorID: selectedDonor!.donorID!,
      });
      setToast({
      open: true, 
      msg: "Donor contact deleted!",
      sev: "success"
    });
    } catch (e) {
      console.error("Delete Donor Contact Failed", toErrorMessage(e));
      setToast({
      open: true, 
      msg: "Donor contact delete failed!",
      sev: "error"
    });
    }
  };

  const contactCols: GridColDef<Contact>[] = [
    { field: "contactID", headerName: "ID", width: 60 },
    { field: "contact_name", headerName: "Contact Name", width: 180 },
    { field: "contact_phone", headerName: "Phone", width: 110 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "Actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => params.row.contactID && onDelete(params.row.contactID)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const unAssignedCols: GridColDef<ChildSmall>[] = [
    { field: "childID", headerName: "Child ID", width: 80 },
    { field: "f_name", headerName: "First Name", width: 80 },
    { field: "l_name", headerName: "Last Name", width: 80 },
  ];
  const assignedDonorCols: GridColDef<ChildSmall>[] = [
    { field: "childID", headerName: "Child ID", width: 80 },
    { field: "f_name", headerName: "First Name", width: 80 },
    { field: "l_name", headerName: "Last Name", width: 80 },
  ];

  const { data: allDonorContacts } = useDonorContactByID(donorID);

  const [newDonorFormDialogOpen, setNewDonorFormDialogOpen] = React.useState<boolean>(false);

  const closeNewDonorFormDialog = () => setNewDonorFormDialogOpen(false);

  const onDonorSaved = () => {
    setToast({
      open: true, 
      msg: "Donor added successfully!",
      sev: "success"
    })
  };

  const onUpdateContact = () =>{
    setToast({
      open: true, 
      msg: "Donor contact added successfully!",
      sev: "success"
    })
  }

  const updateMutation = useUpdateDonor(donorID);

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
        pick_assigned_to: vals.pick_assigned_to ?? "",
        pick_det: vals.pick_det ?? "",
        kids_tag: vals.kids_tag,
        age0_11: vals.age0_11 ?? 0,
        age12abv: vals.age12abv ?? 0,
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
        toy_dr: vals.toy_dr ?? false,
        instruction: vals.instruction ?? "",
        active: vals.active ?? true,
      };

      if (vals.donorID !== 0) {

        const updated = await updateMutation.mutateAsync(payload);
        setToast({open: true, msg:"Donor is updated!", sev: "success"})
        setSelectedDonor(updated);
        
      }
    } catch (e: unknown) {
      console.error("Donor Addition Failed", toErrorMessage(e));
      setToast({open: true, msg:"Donor update failed!", sev: "error"})
    }
  });


  const [donorContactFormOpen, setDonorContactFormOpen] =
    React.useState<boolean>(false);

  const closeDonorContactForm = () => setDonorContactFormOpen(false);

  const archiveDonors = useArchiveDonors();
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
      archiveDonors.mutate();
      fullFormReset();
    }
  };

  const { data: allChildByDonor } = useAllChildByDonor(
    selectedDonor?.donorID || 0,
  );


  const { data: allUnAssociatedChild } = useAllUnAssociated();


  const [selectedUnassignedChild, setSelectedUnassignedChild] =
    React.useState<ChildSmall | null>(null);
  const [selectedAssignedChild, setSelectedAssignedChild] =
    React.useState<ChildSmall | null>(null);

  const assignMutation = useAssociateChildToDonor(
    selectedUnassignedChild?.childID ?? 0,
    selectedDonor?.donorID ?? 0,
  );

  const dissociateMutation = useDissociateChildFromDonor(
    selectedAssignedChild?.childID ?? 0,
    selectedDonor?.donorID ?? 0,
  );

  const handleAssignChild = () => {
    if (!selectedDonor) {
      console.warn("No donor selected");
      setToast({open: true, msg:"Donor is not selected!", sev: "error"})
      return;
    }

    if (selectedDonor.active === false) {
      console.warn("Donor is inactive");
      setToast({open: true, msg:"Donor is not active!", sev: "error"})
      return;
    }
    if (!selectedUnassignedChild) {
      console.warn("No child selected");
      setToast({open: true, msg:"Child is not selected!", sev: "error"})
      return;
    }

    assignMutation.mutate({ donorID: selectedDonor.donorID ?? 0 });
    setToast({open: true, msg:"Child is assigned!", sev: "success"})
    setSelectedUnassignedChild(null);
  };

  const handledissociateChild = () => {
    if (!selectedDonor) {
      console.warn("No donor selected");
      setToast({open: true, msg:"Donor is not selected!", sev: "error"})
      return;
    }

    if (selectedDonor.active === false) {
      console.warn("Donor is inactive");
      setToast({open: true, msg:"Donor is not active!", sev: "error"})
      return;
    }

    if (!selectedAssignedChild) {
      console.warn("No child selected");
      setToast({open: true, msg:"Child is not selected!", sev: "error"})

      return;
    }

    dissociateMutation.mutate({ childID: selectedAssignedChild.childID ?? 0 });
    setToast({open: true, msg:"Child is dissociated!", sev: "success"})
    setSelectedAssignedChild(null);
  };



  const age0_11 = watch("age0_11");
  const age12abv = watch("age12abv");
  React.useEffect(()=>{
    const total = (age0_11 || 0) + (age12abv || 0);
    setValue("kids_tag", Number(total ));


  },[age0_11,age12abv,setValue]);


const giftValues = useWatch({
  control,
  name: [
    "inf_boy",
    "inf_girl",
    "tod_boy",
    "tod_girl",
    "age6_10b",
    "age6_10g",
    "age11_14b",
    "age11_14g",
    "age15_18b",
    "age15_18g",
  ],
});

React.useEffect(() => {
  const total = giftValues.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  setValue("gift_tag", total);
}, [giftValues, setValue]);
  
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

          <Box sx={{ p: 5, width: "70%", flexDirection: "row" }}>
            <Stack direction="row" spacing={2}>
              <Typography variant="h4" component="h2" sx={{ flex: 1 }}>
                Donor
              </Typography>

              <Button
                variant="contained"
                color="warning"
                onClick={fullFormReset}
              >
                Clear Form
              </Button>
              <Button variant="contained" color="info" onClick={submit}>
                Update Donor
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => setNewDonorFormDialogOpen(true)}
              >
                Add New Donors
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
              ></Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                <TextField
                  label="Donor ID"
                  {...register("donorID")}
                  type="number"
                  slotProps={{
                    input: { readOnly: true },
                    inputLabel: { shrink: true },
                  }}
                  sx={{ width: "400px" }}
                />

                <Controller
                  name="donor_name"
                  control={control}
                  render={({ field }) => {
                    const selectedDonor =
                      allDonors?.find((d) => d.donor_name === field.value) ??
                      null;

                    return (
                      <Autocomplete<Donor>
                        fullWidth
                        options={allDonors || []}
                        loading={allDonorsLoading}
                        value={selectedDonor}
                        inputValue={inputValue}
                        onChange={(_, newValue) => {
                          if (!newValue) {
                            return;
                          }
                          setSelectedDonor(newValue);
                          reset(mapDonorToFormValues(newValue));
                         
                        }}
                        onInputChange={(_, newInputValue) => {
                          setInputValue(newInputValue);
                          if (newInputValue === "") {
                            fullFormReset();
                          }
                        }}
                        getOptionLabel={(donor) => donor?.donor_name || ""}
                        isOptionEqualToValue={(opt, val) =>
                          opt.donorID === val?.donorID
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option.donorID}>
                            {option.donor_name}
                          </li>
                        )}
                        noOptionsText={
                          <Box>
                            <div>No Results Found</div>
                            {/* <Button variant="contained" size="small">
                              Add "{inputValue}"
                            </Button> */}
                          </Box>
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Donor Name"
                            error={!!errors.donor_name}
                            helperText={errors.donor_name?.message}
                          />
                        )}
                      />
                    );
                  }}
                />

                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: "gray",
                    borderRadius: 1,
                    p: 0.5,
                    pl: 2,
                    height: 55,

                    minWidth: 120,
                    flexDirection: "column",
                    width: 120,
                    overflow: "hidden",
                  }}
                >
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={!!field.value}
                            onChange={(e) => {
                              // if (
                              //   field.value === true &&
                              //   !!allUnAssociatedChild &&
                              //   !!selectedDonor
                              // ) {
                              //   console.log("Remove the associated child");
                                
                              // } else {
                              //   console.log("this value should also change")
                              // }
                              if(allChildByDonor?.length !== 0 && e.target.checked === false){
                                console.log(allChildByDonor, e.target.checked,!!allChildByDonor);
                                  setToast({open: true, msg: "Operation failed! Child is associated with the donor!", sev:"error"});
                                    return;
                              }else{
                                field.onChange(e.target.checked);
                              }
                            }}
                          />
                        }
                        label="Active"
                      />
                    )}
                  />
                </Box>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                <Controller
                  name="address1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address1"
                      type="string"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="address2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address2"
                      type="string"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                      fullWidth
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
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="City"
                      type="string"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="State"
                      type="string"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value).slice(0, 2))
                      }
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="zip"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Zip"
                      type="string"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(formatZip(e.target.value))
                      }
                      fullWidth
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
                  name="pick_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      {...field}
                      label="Pick Up Date"
                      type="datetime-local"
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />

                <Controller
                  name="pick_assigned_to"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Pickup Assigned To"
                      type="string"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="pick_det"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Pickup Details"
                      type="string"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                      fullWidth
                    />
                  )}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    width: "100%",
                  }}
                >
                  <Tabs value={tabValue} onChange={handleTab} aria-label="tabs">
                    <Tab label="Adopt a Child " {...indexProp(0)} />
                    <Tab label="Stocking Stuffer" {...indexProp(1)} />
                    <Tab label="Child Assign" {...indexProp(2)} />
                  </Tabs>

                  <CustomTabPanel value={tabValue} index={0}>
                    <Stack direction="row">
                      <Box
                        sx={{
                          height: 350,
                          paddingBottom: 1,
                          marginBottom: 1,
                          width: "50%",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ marginTop: 2, backgroundColor: "white" }}
                        >
                          <Controller
                            name="kids_tag"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Kids Tag"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                sx={{ width: "50%" }}
                              />
                            )}
                          />

                          <Box
                            sx={{
                              border: "1px solid",
                              borderColor: "gray",
                              borderRadius: 1,
                              p: 0.5,
                              pl: 2,

                              maxWidth: 250,
                              flexDirection: "column",
                              width: "50%",
                              overflow: "hidden",
                            }}
                          >
                            <Controller
                              name="toy_dr"
                              control={control}
                              render={({ field }) => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      {...field}
                                      checked={!!field.value}
                                      onChange={(e) =>
                                        field.onChange(e.target.checked)
                                      }
                                    />
                                  }
                                  label="Toy Drive"
                                />
                              )}
                            />
                          </Box>
                        </Stack>

                        <Controller
                          name="age0_11"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Number of Tags for Children 0-11"
                              type="number"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              fullWidth
                              sx={{ mt: 2 }}
                            />
                          )}
                        />
                        <Controller
                          name="age12abv"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Number of Tags for Children 12+"
                              type="number"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              fullWidth
                              sx={{ mt: 2 }}
                            />
                          )}
                        />
                      </Box>

                      <Box
                        sx={{
                          width: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundImage: `url(${tag})`,
                          paddingLeft: "2px",
                          backgroundSize: "70%",
                          backgroundRepeat: "no-repeat",
                          bottom: 0,
                          left: 0,
                        }}
                      ></Box>
                    </Stack>
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={1}>
                    <Stack direction="row" spacing={2}>
                      <Box
                        style={{
                          height: 350,
                          paddingBottom: 1,
                          marginBottom: 1,
                          width: "50%",
                        }}
                      >
                        <Controller
                          name="gift_tag"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Number of Stockings Requested"
                              type="number"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              fullWidth
                            />
                          )}
                        />

                        <Box
                          sx={{
                            width: "100%",
                            height: 300, // FIXED HEIGHT (recommended)
                            backgroundImage: `url(${stocking_icon})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain", // scale correctly
                            backgroundPosition: "center",
                          }}
                        />
                      </Box>

                      <Stack
                        direction="column"
                        spacing={2}
                        sx={{ width: "50%" }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Controller
                            name="inf_boy"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Infant Boy"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                fullWidth
                              />
                            )}
                          />
                          <Controller
                            name="inf_girl"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Infant Girl"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                fullWidth
                              />
                            )}
                          />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                          <Controller
                            name="tod_boy"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Toddler Boy"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                fullWidth
                              />
                            )}
                          />
                          <Controller
                            name="tod_girl"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Toddler Girl"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                fullWidth
                              />
                            )}
                          />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                          <Controller
                            name="age6_10b"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Boy 6-10"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                fullWidth
                                sx={{ mt: 2 }}
                              />
                            )}
                          />
                          <Controller
                            name="age6_10g"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Girl 6-10"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                fullWidth
                                sx={{ mt: 2 }}
                              />
                            )}
                          />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                          <Controller
                            name="age11_14b"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Boy 11-14"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>{
                  
                                  field.onChange(Number(e.target.value))}
                                }
                                fullWidth
                                sx={{ mt: 2 }}
                              />
                            )}
                          />
                          <Controller
                            name="age11_14g"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Girl 11-14"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                fullWidth
                                sx={{ mt: 2 }}
                              />
                            )}
                          />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                          <Controller
                            name="age15_18b"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Boy 15-18"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                fullWidth
                                sx={{ mt: 2 }}
                              />
                            )}
                          />
                          <Controller
                            name="age15_18g"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Girl 15-18"
                                type="number"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                fullWidth
                                sx={{ mt: 2 }}
                              />
                            )}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={2}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Box>
                        <Stack direction="row">
                          <Typography variant="h6" sx={{ flex: 1 }}>
                            Unassigned Child
                          </Typography>
                        </Stack>

                        <hr />

                        <Paper sx={{ height: 400 }}>
                          <DataGrid
                            sx={{ width: 300 }}
                            rows={
                              Array.isArray(allUnAssociatedChild)
                                ? allUnAssociatedChild
                                : []
                            }
                            columns={unAssignedCols}
                            getRowId={(row: ChildSmall) => row.childID!}
                            onRowClick={({ row }) =>
                              setSelectedUnassignedChild(row)
                            }
                            initialState={{
                              pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pageSizeOptions={[10, 20]}
                            slotProps={{
                              loadingOverlay: {
                                variant: "linear-progress",
                              },
                            }}
                          />
                        </Paper>
                      </Box>
                      <Stack
                        direction="column"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 10,
                        }}
                      >
                        <ArrowCircleRightIcon
                          color="primary"
                          onClick={handleAssignChild}
                          sx={{
                            fontSize: 80,
                            color: "primary.main",
                            cursor: "pointer",
                            transition: "transform 0.15s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                            "&:active": {
                              transform: "scale(0.85)",
                            },
                          }}
                        />
                        <ArrowCircleLeftIcon
                          color="primary"
                          onClick={handledissociateChild}
                          sx={{
                            fontSize: 80,
                            color: "primary.main",
                            cursor: "pointer",
                            transition: "transform 0.15s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                            "&:active": {
                              transform: "scale(0.85)",
                            },
                          }}
                        />
                      </Stack>

                      <Box>
                        <Stack direction="row">
                          <Typography variant="h6" sx={{ flex: 1 }}>
                            Assigned Child
                          </Typography>
                        </Stack>

                        <hr />

                        <Paper sx={{ height: 400 }}>
                          <DataGrid
                            sx={{ width: 300 }}
                            rows={
                              Array.isArray(allChildByDonor)
                                ? allChildByDonor
                                : []
                            }
                            columns={assignedDonorCols}
                            getRowId={(row: ChildSmall) => row.childID!}
                            onRowClick={({ row }) =>
                              setSelectedAssignedChild(row)
                            }
                            initialState={{
                              pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pageSizeOptions={[10, 20]}
                            slotProps={{
                              loadingOverlay: {
                                variant: "linear-progress",
                              },
                            }}
                          />
                        </Paper>
                      </Box>
                    </Stack>
                  </CustomTabPanel>
                </Box>
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 2, backgroundColor: "white" }}
              >
                <Controller
                  name="instruction"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Special Instruction"
                      onChange={(e) =>
                        field.onChange(toUpperStr(e.target.value))
                      }
                      multiline
                      rows={2}
                      fullWidth
                    />
                  )}
                />
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ padding: 2 }}>
            {/* add the table here */}
            <Stack direction="row" spacing={2} sx={{ marginTop: 3 }}>
              <Typography variant="h4" component="h2" sx={{ flex: 1 }}>
                Contact
              </Typography>

              <Button
                variant="contained"
                color="success"
                disabled={!selectedDonor}
                onClick={() => setDonorContactFormOpen(true)}
              >
                Add Contact
              </Button>
            </Stack>

            <hr />

            <Paper sx={{ height: 600, width: 750 }}>
              <DataGrid
                rows={Array.isArray(allDonorContacts) ? allDonorContacts : []}
                columns={contactCols}
                getRowId={(row: Contact) => row.contactID!}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 20]}
                slotProps={{
                  loadingOverlay: {
                    variant: "linear-progress",
                  },
                }}
              />
            </Paper>

            <Button
              variant="contained"
              color="secondary"
              sx={{ marginTop: 2 }}
              onClick={openAuth}
            >
              Archive All Donors
            </Button>
          </Box>
        </Stack>
      </Stack>

      <Dialog
        open={onOpen}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{ zIndex: 100 }}
      >
        <Box sx={{ p: 3, justifyContent: "center" }}>
          <Typography variant="h6">
            Are you sure you want to delete all the donor data?
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

      <NewDonorFormDialog
        open={newDonorFormDialogOpen}
        onClose={closeNewDonorFormDialog}
        onSaved={onDonorSaved}
      />
      {selectedDonor && (
        <DonorContactFormDialog
          open={donorContactFormOpen}
          onClose={closeDonorContactForm}
          donorID={selectedDonor.donorID!}
          onUpdate={onUpdateContact}
        />
      )}

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
