import {
  Box,
  Grid,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../../features/navbar/pages/NavBar";
import light from "../../images/lights.png";
import light_side from "../../images/lights_side.png";
import christmas_small from "../../images/christmas_small.jpg";
import project from "../../images/project.jpg";
import kare from "../../images/kare.jpg"



import { useLocation } from "react-router-dom";
export default function AppShell() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Grid>
      <Grid>
        <Navbar />
        <Outlet />
        {isHomePage && (
          <Box
            sx={{
              margin: 0,
              padding: 0,
              height: "92.5vh",
              width: "100vw",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "15%",
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
            <Box
              sx={{
                width: "100%",
                height: "70%",
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: "8%",
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

              <Box
                sx={{
                  backgroundImage: `url(${christmas_small})`,
                  height: "100%",
                  width: "48%",
                  backgroundSize: "600px",
                  backgroundRepeat: "no-repeat",
                }}
              />

              <Box
                sx={{ width: "48%", display: "flex", flexDirection: "column" }}
              >
                <Box sx={{
                  height:"35%",
                   backgroundImage: `url(${project})`,
                
            
                  backgroundSize: "530px",
                  backgroundRepeat: "no-repeat",
                  
                  }}></Box>
                <Box sx={{
                  height:"25%",
                  minHeight:"200px",
                  marginLeft:"100px",
                   backgroundImage: `url(${kare})`,
                
                
                  backgroundSize: "350px",
                  backgroundRepeat: "no-repeat",
                  
                  }}/>

                  

                
                
                
              </Box>
              

              <Box
                sx={{
                  width: "8%",

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
            </Box>

            <Box
              sx={{
                width: "100%",
                height: "15%",

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
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
