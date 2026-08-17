import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import { Button, Paper } from "@mui/material";

import type { Child } from "../../../types/Child";
import { useChild } from "../hooks/useChild";
import { useAllActiveEmployees } from "../../employees/hooks/useAllActiveEmployees";

type Props = {
  onSelectedRow: (rows: Child[]) => void;
  onDeleteRow: (id: number) => void;
};

export default function ChildTable({ onSelectedRow, onDeleteRow }: Props) {
  const { data: allChildren } = useChild();
  const {data: allActiveEmployees} = useAllActiveEmployees();

  const childCols: GridColDef<Child>[] = [
    { field: "childID", headerName: "ID", width: 90 },
    { field: "f_name", headerName: "First Name", width: 150 },
    { field: "l_name", headerName: "Last Name", width: 150 },
    { field: "age", headerName: "Age", width: 70 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "workerID", headerName: "Worker", width: 100, valueFormatter: (params)=> {const employee = allActiveEmployees?.find((e) => e.Employee_Index === params); return employee? `${employee.First_Name} ${employee.Last_Name}` : ""},  },
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
        child.childID !== undefined &&
        selectionModel.ids.has(child.childID),
    );
  } else {
    // Everything is selected except the excluded IDs
    selectedChildren = allChildren.filter(
      (child) =>
        child.childID !== undefined &&
        !selectionModel.ids.has(child.childID),
    );
  }

  onSelectedRow(selectedChildren);
};




  return (
    <Paper sx={{ height: 650 }}>
      <DataGrid
        rows={Array.isArray(allChildren) ? allChildren : []}
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
          loadingOverlay: {
            variant: "linear-progress",
          },
        }}
      />
    </Paper>
  );
}