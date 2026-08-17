import { useEffect, useState } from "react";

interface DymoPrinter {
  Name: string;
  ModelName: string;
  IsConnected: boolean;
  IsLocal: boolean;
  IsTwinTurbo: boolean;
}

export default function useDymo() {
  const [loaded, setLoaded] = useState(false);
  const [printers, setPrinters] = useState<DymoPrinter[]>([]);

  async function getPrinters() {
    try {
      const res = await fetch(
        "https://127.0.0.1:41951/DYMO/DLS/Printing/GetPrinters"
      );

      if (!res.ok) {
        throw new Error("Cannot connect to DYMO service");
      }

      const xml = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "application/xml");

      const printerNodes = doc.getElementsByTagName(
        "LabelWriterPrinter"
      );

      const printerList: DymoPrinter[] = Array.from(printerNodes).map(
        (node) => ({
          Name:
            node.getElementsByTagName("Name")[0]?.textContent ?? "",

          ModelName:
            node.getElementsByTagName("ModelName")[0]?.textContent ?? "",

          IsConnected:
            node.getElementsByTagName("IsConnected")[0]?.textContent ===
            "True",

          IsLocal:
            node.getElementsByTagName("IsLocal")[0]?.textContent ===
            "True",

          IsTwinTurbo:
            node.getElementsByTagName("IsTwinTurbo")[0]?.textContent ===
            "True",
        })
      );


      // console.log("DYMO printers:", printerList);

      setPrinters(printerList);

      return printerList;

    } catch (error) {
      console.error("DYMO connection error:", error);

      setPrinters([]);

      return [];
    }
  }


  useEffect(() => {
    async function init() {
      const result = await getPrinters();

      if (result.length > 0) {
        setLoaded(true);
      }
    }

    init();
  }, []);



async function loadLabel(path: string) {
  console.log("Loading label:", path);

  const res = await fetch(path);

  console.log("Status:", res.status);
  console.log("Content-Type:", res.headers.get("content-type"));

  const text = await res.text();

  console.log(text.substring(0, 300));

  return text;
}



  async function printLabelXml(labelXml: string) {

    // IMPORTANT:
    // Check the printer RIGHT BEFORE printing
    const currentPrinters = await getPrinters();


    if (currentPrinters.length === 0) {
      throw new Error(
        "No DYMO printer detected"
      );
    }


    const printer = currentPrinters[0];


    if (!printer.IsConnected) {
      throw new Error(
        "DYMO printer is disconnected"
      );
    }



    const body =
      `PrinterName=${encodeURIComponent(printer.Name)}` +
      `&LabelXml=${encodeURIComponent(labelXml)}` +
      `&LabelSetXml=`;



    const res = await fetch(
      "https://127.0.0.1:41951/DYMO/DLS/Printing/PrintLabel",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body,
      }
    );


    if (!res.ok) {
      throw new Error(
        `DYMO print failed (${res.status})`
      );
    }


    const response = await res.text();

    // console.log(
    //   "DYMO print response:",
    //   response
    // );


    return response;
  }



  return {
    loaded,
    printers,
    getPrinters,
    loadLabel,
    printLabelXml,
  };
}