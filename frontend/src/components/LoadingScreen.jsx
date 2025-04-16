import { CircularProgress } from "@mui/material";

export default function LoadingScreen() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <CircularProgress color="success" size={50} />
    </div>
  );
}
