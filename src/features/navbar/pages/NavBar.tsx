import * as React from "react";
import {
  Menubar,
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuSubmenuTrigger,
  MenuSubmenuRoot,
  MenuGroup,
} from "../components/Menubar";

import { useNavigate } from "react-router-dom";
import { Button, Box, LinearProgress, Typography } from "@mui/material";
import logo from "../../../images/logo.jpg";
import GetAllChildByDonor from "../../reporting/components/GetAllChildByDonor";
import GetAllChildByID from "../../reporting/components/GetChildByID";
import GetAllChildByWorker from "../../reporting/components/GetAllChildByWorker";
import { getGiftCardTypes, getGiftPickUpReport, getLotteryData, getStockingDonors, getToyDrDonors, getActiveDonors } from "../../../api/reporting";
import GetAllDonors from "../../reporting/components/GetAllDonors";
import Toast from "../../../utlis/Toast";
import { toErrorMessage } from "../../../utlis/errors";

export default function IconItemsMenubar() {
  const navigate = useNavigate();

   const [toast, setToast] = React.useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error" | "info" | "warning";
  } | null>(null);
  const [globalDownloading, setGlobalDownloading] = React.useState(false);
  const [globalProgress, setGlobalProgress] = React.useState(0);

  const [onOpenChildByDonorReport, setOnOpenChildByDonorReport] =
    React.useState<boolean>(false);
  const closeChildByDonorReport = () => {
    setOnOpenChildByDonorReport(false);
  };

  const [onOpenChildByID, setOnOpenChildByID] = React.useState<boolean>(false);
  const [onOpenChildAssociatedWorker, setOnOpenChildAssociatedWorker] =
    React.useState<boolean>(false);

  const [onOpenDonorReport, setOnOpenDonorReport] = React.useState<boolean>(false);
  

  const closeOnOpenChildByID = () => {
    setOnOpenChildByID(false);
  };
  const closeChildAssociatedWorker = () => {
    setOnOpenChildAssociatedWorker(false);
  };

  const closeDonorReport = () =>{
    setOnOpenDonorReport(false);
  }

  const onGetAllChildByDonor = (accepted: boolean)=>{
    if (accepted){
      setToast({open: true, msg:"Printing Report", sev:"success"});
    }
  }
  const onGetAllChildByID = (accepted: boolean)=>{
    if (accepted){
      setToast({open: true, msg:"Printing Report", sev:"success"});
    }
  }
  const onGetAllChildByWorker = (accepted: boolean)=>{
    if (accepted){
      setToast({open: true, msg:"Printing Report", sev:"success"});
    }
  }
  const onGetAllDonors = (accepted: boolean)=>{
    if (accepted){
      setToast({open: true, msg:"Printing Report", sev:"success"});
    }
  }

const onOpenGiftCardTypesReport = async () => {
  try{
    setGlobalDownloading(true);
    setGlobalProgress(0);
    const data = await getGiftCardTypes((p:number)=> setGlobalProgress(p));
    setGlobalProgress(100);
    setGlobalDownloading(false);

    if (data === "Successful Download!") {
      setToast({ open: true, msg: "Printing Report", sev: "success" });
    } else {
      setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
    }
  } catch (e) {
    setGlobalDownloading(false);
    console.error("Failed:", toErrorMessage(e));
    setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
  }
};

const onOpenLotteryReport = async () => {
  try{
    setGlobalDownloading(true);
    setGlobalProgress(0);
    const data = await getLotteryData((p:number)=> setGlobalProgress(p));
    setGlobalProgress(100);
    setGlobalDownloading(false);
    if (data === "Successful Download!") {
      setToast({ open: true, msg: "Printing Report", sev: "success" });
    } else {
      setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
    }
  } catch (e) {
    console.error("Failed:", toErrorMessage(e));
    setGlobalDownloading(false);
    setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
  }
};

const onOpenGiftPickUpReport = async () => {
  try{
    setGlobalDownloading(true);
    setGlobalProgress(0);
    const data = await getGiftPickUpReport((p:number)=> setGlobalProgress(p));
    setGlobalProgress(100);
    setGlobalDownloading(false);
    if (data === "Successful Download!") {
      setToast({ open: true, msg: "Printing Report", sev: "success" });
    } else {
      setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
    }
  } catch (e) {
    console.error("Failed:", toErrorMessage(e));
    setGlobalDownloading(false);
    setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
  }
};
const onOpenToyDrDonors = async () => {
  try{
    setGlobalDownloading(true);
    setGlobalProgress(0);
    const data = await getToyDrDonors((p:number)=> setGlobalProgress(p));
    setGlobalProgress(100);
    setGlobalDownloading(false);
    if (data === "Successful Download!") {
      setToast({ open: true, msg: "Printing Report", sev: "success" });
    } else {
      setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
    }
  } catch (e) {
    console.error("Failed:", toErrorMessage(e));
    setGlobalDownloading(false);
    setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
  }
};
const onOpenStockingDonors = async () => {
  try{
    setGlobalDownloading(true);
    setGlobalProgress(0);
    const data = await getStockingDonors((p:number)=> setGlobalProgress(p));
    setGlobalProgress(100);
    setGlobalDownloading(false);
    if (data === "Successful Download!") {
      setToast({ open: true, msg: "Printing Report", sev: "success" });
    } else {
      setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
    }
  } catch (e) {
    console.error("Failed:", toErrorMessage(e));
    setGlobalDownloading(false);
    setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
  }
};
const onOpenActiveDonors = async () => {
  try{
    setGlobalDownloading(true);
    setGlobalProgress(0);
    const data = await getActiveDonors((p:number)=> setGlobalProgress(p));
    setGlobalProgress(100);
    setGlobalDownloading(false);
    if (data === "Successful Download!") {
      setToast({ open: true, msg: "Printing Report", sev: "success" });
    } else {
      setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
    }
  } catch (e) {
    console.error("Failed:", toErrorMessage(e));
    setGlobalDownloading(false);
    setToast({ open: true, msg: "Printing Report Failed", sev: "error" });
  }
};





  return (
    <Menubar>
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => navigate("/")}
      >
        <img
          src={logo}
          alt="Project Kare Logo"
          style={{
            height: "60px",

            objectFit: "contain",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <MenuRoot>
          <Button
            variant="outlined"
            sx={{ color: "white", borderRadius: "50px", borderColor: "white" }}
            color="warning"
            onClick={() => navigate(`/child`)}
          >
            Adopt a Child
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "white", borderRadius: "50px", borderColor: "white" }}
            color="warning"
            onClick={() => navigate("/lottery")}
          >
            Christmas Lottery
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "white", borderRadius: "50px", borderColor: "white" }}
            color="warning"
            onClick={() => navigate("/donors")}
          >
            Donors
          </Button>
        </MenuRoot>
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        {globalDownloading && (
          <Box sx={{ position: 'fixed', right: 16, top: 72, width: 260, zIndex: 2000, bgcolor: 'rgba(0,0,0,0.6)', p:1, borderRadius:1 }}>
            <Typography variant="body2" color="white">Downloading report {globalProgress>0? `${globalProgress}%` : ''}</Typography>
            <LinearProgress variant={globalProgress>0? 'determinate' : 'indeterminate'} value={globalProgress} sx={{mt:1}} />
          </Box>
        )}
        <MenuRoot>
          <MenuTrigger>Report</MenuTrigger>
          <MenuPortal>
            <MenuPositioner sideOffset={4} alignOffset={-2}>
              <MenuPopup>
                <MenuSubmenuRoot>
                  <MenuSubmenuTrigger>Adopt A Child</MenuSubmenuTrigger>
                  <MenuPortal>
                    <MenuPositioner alignOffset={-4}>
                      <MenuPopup>
                        <MenuGroup>
                          <MenuItem onClick={() => setOnOpenChildByDonorReport(true)}>
                            By Donor
                          </MenuItem>
                          <MenuItem onClick={() => setOnOpenChildByID(true)}>
                            By ID #
                          </MenuItem>
                          <MenuItem
                            onClick={() => setOnOpenChildAssociatedWorker(true)}
                          >
                            Worker
                          </MenuItem>
                          <MenuItem onClick={() => onOpenGiftCardTypesReport()}>
                            Gift Certificates
                          </MenuItem>
                        </MenuGroup>

                        <MenuGroup></MenuGroup>
                      </MenuPopup>
                    </MenuPositioner>
                  </MenuPortal>
                </MenuSubmenuRoot>

              

                <MenuItem onClick={()=> onOpenLotteryReport()}>Lottery Report</MenuItem>
                <MenuItem onClick={()=> onOpenGiftPickUpReport()}>Gift Pickup Report</MenuItem>
                <MenuItem onClick={()=>setOnOpenDonorReport(true)}>Donor Information Printout</MenuItem>
                <MenuItem onClick={()=> onOpenToyDrDonors()}>Toy Drive Report</MenuItem>
                <MenuItem onClick={() => onOpenStockingDonors()}>Stockings Report</MenuItem>
                <MenuItem onClick={() => onOpenActiveDonors()}>All Active Donors</MenuItem>
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </MenuRoot>
      </div>

      {/* 
      <div style={{ color: "white", fontWeight: 500 }}/> */}
      <GetAllChildByDonor open={onOpenChildByDonorReport} onClose={closeChildByDonorReport} onSuccess={onGetAllChildByDonor} />
      <GetAllChildByID open={onOpenChildByID} onClose={closeOnOpenChildByID} onSuccess={onGetAllChildByID} />

      <GetAllChildByWorker
        open={onOpenChildAssociatedWorker}
        onClose={closeChildAssociatedWorker}
        onSuccess={onGetAllChildByWorker}
      />

      <GetAllDonors
        open={onOpenDonorReport}
        onClose={closeDonorReport}
        onSuccess={onGetAllDonors}
        />

      {toast && (
        <Toast
          open={toast.open}
          msg={toast.msg}
          sev={toast.sev}
          onClose={() => setToast(null)}
        />
      )}

    </Menubar>
  );
}
