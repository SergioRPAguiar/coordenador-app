import axios from "axios";
import * as FileSystem from "expo-file-system";
import { API_URL } from "../app/context/AuthContext";

const uploadLogo = async () => {
  try {
    const fileUri = FileSystem.cacheDirectory + "logoif.png";

    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: "logoif.png",
      type: "image/png",
    } as any);

    const response = await axios.post(`${API_URL}/upload/logo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload successful:", response.data.url);
    const config = await axios.get(`${API_URL}/config`);
    console.log("Nova URL:", config.data.logoUrl);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Upload failed:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Upload failed:", error.message);
    } else {
      console.error("Unknown error occurred");
    }
  }
};

uploadLogo();
