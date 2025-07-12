import { useState } from "react";

interface Props {
  onUpload: (urls: string[]) => void;
}

const ImageUploader: React.FC<Props> = ({ onUpload }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setPreviews(fileUrls);
    onUpload(fileUrls); // for now, send mock URLs
  };

  return (
    <div className="space-y-2">
      <label>
        <span className="sr-only">Upload images</span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          aria-label="Upload images"
        />
      </label>
      <div className="flex gap-4 mt-2 overflow-x-auto">
        {previews.map((url: string, i: number) => (
          <img key={i} src={url} alt={`Preview ${i + 1}`} className="h-24 w-24 object-cover rounded" />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
