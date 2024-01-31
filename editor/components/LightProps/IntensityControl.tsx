import type { ReactNode } from "react";
import { Grid, Slider, Input, Typography } from "@mui/material";
import { Flare } from "@mui/icons-material";

import { useReactiveVar } from "@apollo/client";
import { reactiveState } from "@/core/state";
import { startEditing } from "@/core/actions";

export interface IntensityControlProps {
  intensity: number | null;
  setIntensity: (intensity: number) => void;
  disabled: boolean;
}

function IntensityControl({
  intensity,
  setIntensity,
  disabled,
}: IntensityControlProps) {
  const editorState = useReactiveVar(reactiveState.editorState);
  const handleSliderChange = async (
    event: Event,
    newValue: number | number[]
  ) => {
    if (editorState === "IDLE") await startEditing();
    setIntensity(newValue as number);
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (editorState === "IDLE") await startEditing();
    const intensity = Number(event.target.value);
    if (intensity < 0) setIntensity(0);
    else if (intensity === 11 || intensity >= 15) setIntensity(15);
    else if (intensity >= 12 && intensity <= 14) setIntensity(10);
    else setIntensity(intensity);
  };

  const valueLabelFormat = (value: number) => {
    return value === 15 ? "flash" : value;
  };

  const sliderMarks: Array<{
    value: number;
    label: ReactNode;
  }> = Array.from({ length: 11 }, (_, i) => i).map((i) => ({
    value: i,
    label: i === 1 || i === 10 ? String(i) : null,
  }));
  sliderMarks.push({
    value: 15,
    label: <Flare sx={{ fontSize: "1.25em" }} />,
  });

  return (
    <>
      <Grid item>
        <Slider
          disabled={disabled}
          value={intensity ?? 0}
          onChange={handleSliderChange}
          min={1}
          max={15}
          step={null}
          valueLabelDisplay="auto"
          valueLabelFormat={valueLabelFormat}
          marks={sliderMarks}
          sx={{
            width: "10em",
            position: "relative",
            top: "0.5em",
          }}
          componentsProps={{
            thumb: {
              // @ts-expect-error thumb can take sx
              sx: {
                width: "1.25em",
                height: "1.25em",
              },
            },
          }}
        />
      </Grid>
      <Grid item sx={{ display: "flex" }}>
        <Input
          value={intensity ?? ""}
          size="small"
          onChange={handleInputChange}
          inputProps={{
            step: 1,
            min: 0,
            max: 15,
            type: "number",
          }}
          sx={{ width: "3em" }}
          error={intensity === 0}
        />
        {intensity === 0 && (
          <Typography fontSize={12} mt={1} ml={1}>
            invalid
          </Typography>
        )}
      </Grid>
    </>
  );
}

export default IntensityControl;
