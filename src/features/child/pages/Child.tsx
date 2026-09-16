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
import jsPDF from "jspdf";

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
import { useArchiveChild } from "../../archive/hooks/useArchiveChild";

import useDymo from "../../../hooks/useDymo";
import Toast from "../../../utlis/Toast";
import { useActiveDonors } from "../../donor/hooks/useActiveDonors";

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
      sacwisID: "",
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
      sacwisID: child.sacwisID ?? "",
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

  const { data: allDonors, isLoading: allDonorsLoading } = useActiveDonors();

  const submit = handleSubmit(async (vals) => {
    try {
      const payload: Child = {
        childID: vals.childID,
        f_name: vals.f_name,
        l_name: vals.l_name,
        age: vals.age,
        sacwisID: vals.sacwisID ?? "",
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

  const formatGiftSuggestion = (value: string) => {
    const words = toUpperStr(value).split(/\s+/);
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      if (word.length > 42) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = "";
        }
        lines.push(word.slice(0, 42));
        continue;
      }

      const candidate = currentLine ? `${currentLine} ${word}` : word;

      if (candidate.length <= 42) {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }

      if (lines.length === 6) break;
    }

    if (lines.length < 6 && currentLine) {
      lines.push(currentLine);
    }

    return lines.slice(0, 6).join("\n");
  };

  const handlePrintPdf = async () => {
    if (multipleSelectedChildren.length === 0) {
      alert("Select at least one child");
      return;
    }

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      // ==================================================
      // LOAD IMAGES
      // ==================================================

      const lightImage = await loadImage(light);
      const sideLightImage = await loadImage(light_side);
      const christmasImage = await loadImage(christmas_small);

      // ==================================================
      // PDF
      // ==================================================

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
      });

      const pageWidth = 215.9;
      const pageHeight = 279.4;

      // ==================================================
      // LABEL SIZE
      // 6 x 4 INCH
      // ==================================================

      const labelWidth = 152.4;
      const labelHeight = 101.6;

      // ==================================================
      // TWO LABELS PER LETTER PAGE
      // ==================================================

      const gapY = 20;

      const totalHeight = labelHeight * 2 + gapY;

      const startX = (pageWidth - labelWidth) / 2;

      const startY = (pageHeight - totalHeight) / 2;

      // ==================================================
      // CHRISTMAS LIGHT SETTINGS
      // ==================================================

      const topBottomLightHeight = 11;
      const topBottomLightWidth = 23;

      const sideLightWidth = 11;
      const sideLightHeight = 23;

      // ==================================================
      // DRAW CHRISTMAS LIGHTS
      // ==================================================

      const drawLights = (labelX: number, labelY: number) => {
        // ==================================================
        // TOP
        // ==================================================

        for (
          let x = labelX;
          x < labelX + labelWidth;
          x += topBottomLightWidth
        ) {
          const remainingWidth = labelX + labelWidth - x;

          const drawWidth = Math.min(topBottomLightWidth, remainingWidth);

          pdf.addImage(
            lightImage,
            "PNG",
            x,
            labelY - 6,
            drawWidth,
            topBottomLightHeight,
          );
        }

        // ==================================================
        // BOTTOM
        // ==================================================

        for (
          let x = labelX;
          x < labelX + labelWidth;
          x += topBottomLightWidth
        ) {
          const remainingWidth = labelX + labelWidth - x;

          const drawWidth = Math.min(topBottomLightWidth, remainingWidth);

          pdf.addImage(
            lightImage,
            "PNG",
            x,
            labelY + labelHeight - 5,
            drawWidth,
            topBottomLightHeight,
          );
        }

        // ==================================================
        // LEFT
        // ==================================================

        for (let y = labelY; y < labelY + labelHeight; y += sideLightHeight) {
          const remainingHeight = labelY + labelHeight - y;

          const drawHeight = Math.min(sideLightHeight, remainingHeight);

          pdf.addImage(
            sideLightImage,
            "PNG",
            labelX - 6,
            y,
            sideLightWidth,
            drawHeight,
          );
        }

        // ==================================================
        // RIGHT
        // ==================================================

        for (let y = labelY; y < labelY + labelHeight; y += sideLightHeight) {
          const remainingHeight = labelY + labelHeight - y;

          const drawHeight = Math.min(sideLightHeight, remainingHeight);

          pdf.addImage(
            sideLightImage,
            "PNG",
            labelX + labelWidth - 5,
            y,
            sideLightWidth,
            drawHeight,
          );
        }
      };

      // ==================================================
      // EACH CHILD
      // ==================================================

      multipleSelectedChildren.forEach((child, index) => {
        // ==================================================
        // NEW PAGE AFTER EVERY 2 LABELS
        // ==================================================

        if (index > 0 && index % 2 === 0) {
          pdf.addPage();
        }

        const position = index % 2;

        const labelX = startX;

        const labelY = startY + position * (labelHeight + gapY);

        // ==================================================
        // WHITE LABEL
        // ==================================================

        pdf.setFillColor(255, 255, 255);

        pdf.rect(labelX, labelY, labelWidth, labelHeight, "F");

        // ==================================================
        // CHRISTMAS LIGHTS
        // ==================================================

        drawLights(labelX, labelY);

        // ==================================================
        // DATA
        // ==================================================

        const name = `${child.f_name ?? ""}`.trim();

        const gender =
          child.gender === "MALE"
            ? "BOY"
            : child.gender === "FEMALE"
              ? "GIRL"
              : "";

        const worker = allEmployees?.find(
          (e) => e.Employee_Index === child.workerID,
        );

        const workerName = worker
          ? `${worker.First_Name} ${worker.Last_Name}`
          : "";

        // ==================================================
        // GIFT CARD
        // USE child.gift_card
        // ==================================================

        const giftCard =
          child.gift_card == null ? "" : String(child.gift_card).trim();

        const hasGiftCard = giftCard.length > 0;

        console.log(
          "CHILD:",
          child.childID,
          "gift_card:",
          child.gift_card,
          "hasGiftCard:",
          hasGiftCard,
        );

        // ==================================================
        // TEXT SETTINGS
        // ==================================================

        const leftX = labelX + 9;

        const rightX = labelX + 78;

        const rowSpacing = 8;

        let y = labelY + 18;

        pdf.setTextColor(25, 25, 25);

        pdf.setFontSize(8.5);

        // ==================================================
        // ROW 1
        // NAME / AGE
        // ==================================================

        pdf.setFont("helvetica", "bold");

        pdf.text("NAME:", leftX, y);

        pdf.setFont("helvetica", "normal");

        pdf.text(name.toUpperCase(), leftX + 12, y);

        pdf.setFont("helvetica", "bold");

        pdf.text("AGE:", rightX, y);

        pdf.setFont("helvetica", "normal");

        pdf.text(String(child.age ?? ""), rightX + 10, y);

        // ==================================================
        // ROW 2
        // GENDER / RACE
        // ==================================================

        y += rowSpacing;

        pdf.setFont("helvetica", "bold");

        pdf.text("GENDER:", leftX, y);

        pdf.setFont("helvetica", "normal");

        pdf.text(gender, leftX + 17, y);

        pdf.setFont("helvetica", "bold");

        pdf.text("RACE:", rightX, y);

        pdf.setFont("helvetica", "normal");

        pdf.text(String(child.race ?? "").toUpperCase(), rightX + 12, y);

        // ==================================================
        // GIFT CARD LABEL
        // ==================================================

        if (hasGiftCard) {
          // ==================================================
          // ROW 3
          // GIFT CERTIFICATE / STORE
          // ==================================================

          y += rowSpacing;

          pdf.setFont("helvetica", "bold");

          pdf.text("GIFT CERTIFICATE:", leftX, y);

          pdf.setFont("helvetica", "normal");

          pdf.text("X", leftX + 32, y);

          pdf.setFont("helvetica", "bold");

          pdf.text("STORE:", rightX, y);

          pdf.setFont("helvetica", "normal");

          pdf.text(giftCard.toUpperCase(), rightX + 16, y);

          // ==================================================
          // ROW 4
          // WORKER
          // ==================================================

          y += rowSpacing;

          pdf.setFont("helvetica", "bold");

          pdf.text("WORKER:", leftX, y);

          pdf.setFont("helvetica", "normal");

          pdf.text(workerName.toUpperCase(), leftX + 26, y);

          // ==================================================
          // ROW 5
          // ID BELOW WORKER
          // ==================================================

          y += rowSpacing;

          pdf.setFont("helvetica", "bold");

          pdf.text("ID:", leftX, y);

          pdf.setFont("helvetica", "normal");

          pdf.text(String(child.childID ?? ""), leftX + 9, y);

          // ==================================================
          // CHRISTMAS SMALL IMAGE
          // ==================================================

          const christmasWidth = 24;
          const christmasHeight = 24;

          const christmasX = labelX + 4;

          const christmasY = y + 3;

          pdf.addImage(
            christmasImage,
            "JPEG",
            christmasX,
            christmasY,
            christmasWidth,
            christmasHeight,
          );
        } else {
          // ==================================================
          // NORMAL CHILD LABEL
          // ==================================================

          const clothingFor =
            clothing_type?.find((e) => e.typeID === Number(child.clothing_type))
              ?.clothing_type ?? "";

          // ==================================================
          // ROW 3
          // CLOTHING / SIZE
          // ==================================================

          y += rowSpacing;

          pdf.setFont("helvetica", "bold");

          pdf.text("CLOTHING FOR:", leftX, y);

          pdf.setFont("helvetica", "normal");

          pdf.text(clothingFor.toUpperCase(), leftX + 26, y);

          pdf.setFont("helvetica", "bold");

          pdf.text("SIZE:", rightX, y);

          pdf.setFont("helvetica", "normal");

          pdf.text(String(child.size ?? "").toUpperCase(), rightX + 12, y);

          // ==================================================
          // ROW 4
          // SHOES / ID
          // ==================================================

          y += rowSpacing;

          pdf.setFont("helvetica", "bold");

          pdf.text("SHOES:", leftX, y);

          pdf.setFont("helvetica", "normal");

          pdf.text(String(child.shoe_size ?? ""), leftX + 16, y);

          pdf.setFont("helvetica", "bold");

          pdf.text("ID:", rightX, y);

          pdf.setFont("helvetica", "normal");

          pdf.text(String(child.childID ?? ""), rightX + 9, y);

          // ==================================================
          // ROW 5
          // WORKER ONLY
          // ==================================================

          y += rowSpacing;

          pdf.setFont("helvetica", "bold");

          pdf.text("WORKER:", leftX, y);

          pdf.setFont("helvetica", "normal");

          pdf.text(workerName.toUpperCase(), leftX + 16, y);

          // ==================================================
          // SUGGESTIONS
          // ==================================================

          y += 6;

          pdf.setFont("helvetica", "bold");

          pdf.setFontSize(8.5);

          const suggestionLabelX = leftX;

          const suggestionY = y;

          pdf.text("SUGGESTIONS:", suggestionLabelX, suggestionY);

          // ==================================================
          // CHRISTMAS IMAGE
          // ==================================================

          const christmasWidth = 24;
          const christmasHeight = 24;

          const christmasX = labelX + 4;

          const suggestionFontSize = 8.5;

          const suggestionLineHeight = suggestionFontSize * 0.45 * 1.35;

          const christmasY = suggestionY + suggestionLineHeight - 2;

          // ==================================================
          // SUGGESTION TEXT
          // ==================================================

          const suggestion = String(child.suggestion ?? "")
            .toUpperCase()
            .trim();

          if (suggestion !== "") {
            pdf.setFont("helvetica", "normal");

            pdf.setFontSize(suggestionFontSize);

            const suggestionTextX = labelX + 40;

            const imageTextX = christmasX + christmasWidth + 5;

            const rightPadding = 8;

            const textRight = labelX + labelWidth - rightPadding;

            const firstLineWidth = textRight - suggestionTextX;

            const imageLineWidth = textRight - imageTextX;

            const originalLines = suggestion.split(/\r?\n/);

            const finalLines: {
              text: string;
              x: number;
              y: number;
            }[] = [];

            // ==================================================
            // FIRST LINE
            // ==================================================

            const firstOriginalLine = originalLines[0] ?? "";

            const firstWrapped = pdf.splitTextToSize(
              firstOriginalLine,
              firstLineWidth,
            );

            let currentY = suggestionY;

            for (const line of firstWrapped) {
              finalLines.push({
                text: line,
                x: suggestionTextX,
                y: currentY,
              });

              currentY += suggestionLineHeight;
            }

            // ==================================================
            // REMAINING LINES
            // ==================================================

            for (let i = 1; i < originalLines.length; i++) {
              const wrapped = pdf.splitTextToSize(
                originalLines[i],
                imageLineWidth,
              );

              for (const line of wrapped) {
                finalLines.push({
                  text: line,
                  x: imageTextX,
                  y: currentY,
                });

                currentY += suggestionLineHeight;
              }
            }

            // ==================================================
            // SHRINK IF NEEDED
            // ==================================================

            const maxTextBottom = labelY + labelHeight - 6;

            const lastLine = finalLines[finalLines.length - 1];

            if (lastLine && lastLine.y > maxTextBottom) {
              pdf.setFontSize(7);

              const smallerLineHeight = 7 * 0.45 * 1.35;

              finalLines.length = 0;

              let smallY = suggestionY;

              const firstSmall = pdf.splitTextToSize(
                firstOriginalLine,
                firstLineWidth,
              );

              for (const line of firstSmall) {
                finalLines.push({
                  text: line,
                  x: suggestionTextX,
                  y: smallY,
                });

                smallY += smallerLineHeight;
              }

              for (let i = 1; i < originalLines.length; i++) {
                const wrapped = pdf.splitTextToSize(
                  originalLines[i],
                  imageLineWidth,
                );

                for (const line of wrapped) {
                  finalLines.push({
                    text: line,
                    x: imageTextX,
                    y: smallY,
                  });

                  smallY += smallerLineHeight;
                }
              }
            }

            // ==================================================
            // PRINT SUGGESTION
            // ==================================================

            for (const line of finalLines) {
              pdf.text(line.text, line.x, line.y);
            }
          }

          // ==================================================
          // CHRISTMAS IMAGE
          // ==================================================

          pdf.addImage(
            christmasImage,
            "JPEG",
            christmasX,
            christmasY,
            christmasWidth,
            christmasHeight,
          );
        }
      });

      // ==================================================
      // DOWNLOAD
      // ==================================================

      const fileName =
        multipleSelectedChildren.length === 1
          ? `child-label-${multipleSelectedChildren[0].childID}.pdf`
          : `child-labels-${Date.now()}.pdf`;

      pdf.save(fileName);

      // ==================================================
      // SUCCESS TOAST
      // ==================================================

      setToast({
        open: true,
        msg: `${multipleSelectedChildren.length} PDF Label${
          multipleSelectedChildren.length > 1 ? "s" : ""
        } Downloaded`,
        sev: "success",
      });
    } catch (e: unknown) {
      console.error("PDF generation failed", e);

      setToast({
        open: true,
        msg: e instanceof Error ? e.message : "Failed to generate PDF",
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
              <Button
                variant="contained"
                color={selectedChild ? "info" : "success"}
                onClick={submit}
              >
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
                      type="text"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : val);
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
                      rows={6}
                      onChange={(e) =>
                        field.onChange(formatGiftSuggestion(e.target.value))
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
            <Button
              variant="contained"
              color="error"
              sx={{ marginTop: 2, marginLeft: 2 }}
              disabled={multipleSelectedChildren.length === 0}
              onClick={handlePrintPdf}
            >
              Print Label PDF
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
