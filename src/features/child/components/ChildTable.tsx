import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Button, Paper, TextField, Box } from "@mui/material";
import { useState, useMemo } from "react";

import type { Child } from "../../../types/Child";
import { useChild } from "../hooks/useChild";
import { useAllActiveEmployees } from "../../employees/hooks/useAllActiveEmployees";

type Props = {
  onSelectedRow: (rows: Child[]) => void;
  onDeleteRow: (id: number) => void;
};

export default function ChildTable({ onSelectedRow, onDeleteRow }: Props) {
  const { data: allChildren } = useChild();
  const { data: allActiveEmployees } = useAllActiveEmployees();

  const [search, setSearch] = useState("");

  // Filter
  const filteredChildren = useMemo(() => {
    if (!allChildren) return [];
    const s = search.toLowerCase();

    return allChildren.filter((child) => {
      const fullName = `${child.f_name} ${child.l_name}`.toLowerCase();
      const childIdText = child.childID?.toString() ?? "";

      // Lookup worker name
      const worker = allActiveEmployees?.find(
        (e) => e.Employee_Index === child.workerID,
      );
      const workerName = worker
        ? `${worker.First_Name} ${worker.Last_Name}`.toLowerCase()
        : "";

      return (
        childIdText.includes(s) ||
        child.f_name.toLowerCase().includes(s) ||
        child.l_name.toLowerCase().includes(s) ||
        fullName.includes(s) ||
        workerName.includes(s)
      );
    });
  }, [search, allChildren, allActiveEmployees]);

  const childCols: GridColDef<Child>[] = [
    { field: "childID", headerName: "ID", width: 90 },
    { field: "f_name", headerName: "First Name", width: 150 },
    { field: "l_name", headerName: "Last Name", width: 150 },
    { field: "age", headerName: "Age", width: 70 },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "workerID",
      headerName: "Worker",
      width: 150,
      valueFormatter: (workerId) => {
        if (!workerId) return "";

        const employee = allActiveEmployees?.find(
          (e) => e.Employee_Index === workerId,
        );

        return employee ? `${employee.First_Name} ${employee.Last_Name}` : "";
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => params.row.childID && onDeleteRow(params.row.childID)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
    if (!allChildren) return;

    let selectedChildren: Child[];

    if (selectionModel.type === "include") {
      selectedChildren = allChildren.filter(
        (child) =>
          child.childID !== undefined && selectionModel.ids.has(child.childID),
      );
    } else {
      selectedChildren = allChildren.filter(
        (child) =>
          child.childID !== undefined && !selectionModel.ids.has(child.childID),
      );
    }

    onSelectedRow(selectedChildren);
  };

  return (
    <Paper sx={{ p: 2 }}>
      {/* Search bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search Duplicates"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* Table */}
      <DataGrid
        rows={filteredChildren}
        columns={childCols}
        getRowId={(row: Child) => row.childID!}
        checkboxSelection
        onRowSelectionModelChange={handleSelectionChange}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20]}
        slotProps={{
          loadingOverlay: { variant: "linear-progress" },
        }}
      />
    </Paper>
  );
}
