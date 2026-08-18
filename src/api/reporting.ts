import api from "./axios";

export const getAllChildByDonor = async (id: number, onProgress?: (percent: number) => void) =>{
  try{
    if (onProgress) { try { onProgress(0); } catch {/* ignore */ } }
    const response = await api.get(`/reporting/childrenByDonorID/${id}`,{
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
    });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AllChildrenByDonorID${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
  } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) { try { onProgress(100); } catch {/* ignore */ } }
    return err;
  };


}

    export const getAllChildByID = async (id: number, onProgress?: (percent: number) => void) =>{
    try{
      if (onProgress) { try { onProgress(0); } catch {/* ignore */ } }
      console.log("this backend thing should print");
      const response = await api.get(`/reporting/childByChildID/${id}`,{
        responseType: "blob",
         onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
      });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ChildByChildID${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
  } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) { try { onProgress(100); } catch {/* ignore */ } }
    return err;
  }
}

export const getAllChildsByWorker = async (id: number, onProgress?: (percent: number) => void) =>{
  try{
    if (onProgress) { try { onProgress(0); } catch {/* ignore */ } }
    const response = await api.get(`/reporting/children/workerID/${id}`,{
      responseType: "blob",
       onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
    });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AllChildsByWorkerID${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
  } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) { try { onProgress(100); } catch {/* ignore */ } }
    return err;
  };


}



export const getGiftCardTypes = async (onProgress?: (percent: number) => void) =>{
  try{
    if (onProgress) { try { onProgress(0); } catch {/* ignore */ } }
    const response = await api.get(`/reporting/children/giftCard/`,{
      responseType: "blob",
       onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
    });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AllChildByGiftCard.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
  } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) { try { onProgress(100); } catch {/* ignore */ } }
    return err;
  };


}


export const getLotteryData = async (onProgress?: (percent: number) => void) =>{
  try{
    if (onProgress) { try { onProgress(0); } catch {/* ignore */ } }
    const response = await api.get(`/reporting/children/lottery/`,{
      responseType: "blob",
        onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
    });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AllLottery.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
  } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) { try { onProgress(100); } catch {/* ignore */ } }
    return err;
  };



}


export const getGiftPickUpReport = async (onProgress?: (percent: number) => void) =>{
  try{
    if (onProgress) { try { onProgress(0); } catch {/* ignore */ } }
    const response = await api.get(`/reporting/children/giftPickUp/`,{
      responseType: "blob",
       onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
    });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AllDonorsByPickUpReport.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
  } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) { try { onProgress(100); } catch {/* ignore */ } }
    return err;
  };


}
export const getToyDrDonors = async (onProgress?: (percent: number) => void) =>{
  try{
    if (onProgress) { try { onProgress(0); } catch {/* ignore */ } }
    const response = await api.get(`/reporting/toyDrive`,{
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
    });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AllDonorsByToyDriveReport.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
  } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) { try { onProgress(100); } catch {/* ignore */ } }
    return err;
  };


}
export const getStockingDonors = async (onProgress?: (percent: number) => void) =>{
  try{
    if (onProgress) { try { onProgress(0); } catch {/* ignore */ } }
    const response = await api.get(`/reporting/stockingsDonors`,{
      responseType: "blob",
       onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
    });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `StockingDonorReport.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
  } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) { try { onProgress(100); } catch {/* ignore */ } }
    return err;
  };


}



export const getDonorInformation = async (id: number, onProgress?: (percent: number) => void) =>{
  try{
    if (onProgress) {
      try { onProgress(0); } catch { /* ignore */ }
    }
    const response = await api.get(`/reporting/donors/${id}`,{
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
    });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    if(id != 0){
      link.setAttribute("download", `DonorInformationByID${id}.pdf`);
      
    }else{
      link.setAttribute("download", `AllDonorInformation.pdf`);

    }
    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
    } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) {
      try { onProgress(100); } catch { /* ignore */ }
    }
    return err;
  };


}
export const getActiveDonors = async (onProgress?: (percent: number) => void) =>{
  try{
    if (onProgress) { try { onProgress(0); } catch {/* ignore */ } }
    const response = await api.get(`/reporting/activeDonors`,{
      responseType: "blob",
        onDownloadProgress: (progressEvent) => {
        try{
          if (onProgress && progressEvent.lengthComputable) {
          
            const total = progressEvent.total ?? progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded / total) * 100);
            onProgress(percent);
          }
        } catch {/* ignore */ }
      }
    });
         const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    
      link.setAttribute("download", `AllActiveDonors.pdf`);

    document.body.appendChild(link);
    link.click();
    link.remove();
    return "Successful Download!";
  } catch (err) {
    console.error("Failed to download PDF:", err);
    if (onProgress) { try { onProgress(100); } catch {/* ignore */ } }
    return err;
  };


}
