import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Button, Paper } from "@mui/material";

import type { Lottery } from "../../../types/Lottery";
import { useLottery } from "../hooks/useLottery";

type Props = {
  onSelectedRow: (row: Lottery) => void;
  onDeleteRow : (row: Lottery) => void;
};


export default function LotteryTable({ onSelectedRow, onDeleteRow }: Props) {
  const {
    data: allLottery,
  } = useLottery();
  const lotteryCols: GridColDef<Lottery>[] = [
  { field: "ticketID", headerName: "Ticket ID", width: 100, 
 valueFormatter: (params) => {
      const value = (params as number) ?? 0;
      return value.toString().padStart(3, "0");
    },
  },
  { field: "packetID", headerName: "Packet ID", width: 100 },
  { field: "sold_by", headerName: "Sold By", width: 150 },
  { field: "purchased_by", headerName: "Purchased By", width: 150 },
  {
    field: "Action",
    headerName:"Action",
    width: 110,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => params.row && onDeleteRow(params.row)}
        >
          Delete
      </Button>
    )
  }
];


  return (
    <Paper
      sx={{
        height: 675,
        padding: 2,
        background: "rgba(255, 255, 255, 0.4)", // translucent white
        backdropFilter: "blur(10px)", // blurred glass
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
      }}
    >
      <DataGrid
        rows={Array.isArray(allLottery) ? allLottery : []}
        columns={lotteryCols}
        getRowId={(row: Lottery) => row.ticketID!}
        onRowClick={({ row }) => onSelectedRow(row)}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 20]}
        slotProps={{ loadingOverlay: { variant: "linear-progress" } }}
      />
    </Paper>
  );
}
