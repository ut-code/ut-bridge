import { useTranslations } from "next-intl";
import { type Dispatch, type SetStateAction, useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useUserFormContext } from "@/features/settings/UserFormController.tsx";

function getCroppedImg(imageSrc: string, croppedAreaPixels: Area): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas is null"));
        return;
      }

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
        });
        resolve(file);
      }, "image/jpeg");
    };
    image.onerror = (error) => reject(error);
  });
}

type PhotoCropModalProps = {
  imageUrl: string;
  isPhotoCropModalOpen: boolean;
  setIsPhotoCropModalOpen: Dispatch<SetStateAction<boolean>>;
};

const PhotoCropModal = ({ imageUrl, isPhotoCropModalOpen, setIsPhotoCropModalOpen }: PhotoCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const ctx = useUserFormContext();
  const t = useTranslations("settings.basic");

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const setCroppedImage = useCallback(async () => {
    try {
      if (croppedAreaPixels == null) {
        throw new Error("croppedAreaPixels is null");
      }
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      ctx.handleImageFileChange(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [imageUrl, croppedAreaPixels, ctx.handleImageFileChange]);

  return (
    <div className={`modal ${isPhotoCropModalOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="mb-3 font-bold text-lg">{t("cropImage")}</h3>
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
          onClick={() => setIsPhotoCropModalOpen(false)}
        >
          ✕
        </button>
        <div
          style={{
            position: "relative",
            width: "90%",
            height: 400,
            maxWidth: "90vw",
            margin: "auto",
          }}
        >
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <input
          className="range range-primary my-3 w-full"
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e) => setZoom(Number.parseFloat(e.target.value))}
        />
        <div className="text-right">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setCroppedImage();
              setIsPhotoCropModalOpen(false);
            }}
          >
            {t("finishCropImage")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCropModal;
