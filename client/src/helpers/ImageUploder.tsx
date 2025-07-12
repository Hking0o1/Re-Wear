import React, { useState } from 'react';

const CLOUD_NAME = 'dho1shzf4'; 

const ImageUploader: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedUrls: string[] = [];

    setUploading(true);
    for (const file of Array.from(files).slice(0, 5 - images.length)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          console.error('Upload failed:', data);
        }
      } catch (err) {
        console.error('Image upload error:', err);
      }
    }
    setUploading(false);
    setImages(prev => [...prev, ...uploadedUrls].slice(0, 5));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Photos</h2>
      <p className="text-gray-600 mb-4">
        Add up to 5 photos. The first photo will be your main image.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {images.length > 0 ? (
          <>
            {/* Main image preview (large) */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2 relative aspect-w-4 aspect-h-3">
              <img
                src={images[0]}
                alt="Main upload"
                className="w-full h-full object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(0)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium">
                Main
              </div>
            </div>

            {/* Remaining images */}
            {images.slice(1).map((image, index) => (
              <div key={index} className="relative aspect-w-1 aspect-h-1">
                <img
                  src={image}
                  alt={`Upload ${index + 2}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index + 1)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-500 col-span-5 text-center">No images uploaded yet.</p>
        )}

        {/* Upload Button */}
        {images.length < 5 && (
          <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer aspect-w-1 aspect-h-1 hover:border-emerald-400 transition-all">
            <input
              type="file"
              aria-label="Image Upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <span className="text-sm text-gray-500 text-center px-2">
              {uploading ? 'Uploading...' : '+ Add Image'}
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
