import React, { useCallback, useState } from 'react';
import { ArrayOfObjectsInputProps, set, unset } from 'sanity';
import { useClient } from 'sanity';
import imageUrlBuilder from '@sanity/image-url';

interface MediaItem {
  _type: 'image' | 'file';
  _key: string;
  asset?: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: any;
  crop?: any;
}

export function MultipleMediaUpload(props: ArrayOfObjectsInputProps) {
  const { onChange, value = [], readOnly } = props;
  const client = useClient({ apiVersion: '2025-05-01' });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const builder = imageUrlBuilder(client);

  const handleFiles = useCallback(async (files: FileList) => {
    if (!files.length || readOnly) {
      console.log('No files or read-only mode');
      return;
    }

    console.log(`Starting upload of ${files} files`);
    setIsUploading(true);
    
    const uploadPromises = Array.from(files).map(async (file, index) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        console.log(`File ${index} is not an image or video:`, file);
        return null;
      }

      console.log(`Uploading file ${index}:`, file.name, file.type);
      
      try {
        const asset = await client.assets.upload(isImage ? 'image' : 'file', file, {
          filename: file.name,
        });

        console.log(`Upload successful for file ${index}:`, asset._id);

        const baseItem = {
          _key: `${isImage ? 'image' : 'video'}-${Date.now()}-${Math.random()}-${index}`,
          asset: {
            _type: 'reference' as const,
            _ref: asset._id,
          },
        };

        if (isImage) {
          return {
            ...baseItem,
            _type: 'image' as const,
            hotspot: {
              x: 0.5,
              y: 0.5,
              height: 1,
              width: 1,
            },
            crop: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          };
        } else {
          return {
            ...baseItem,
            _type: 'file' as const,
          };
        }
      } catch (error) {
        console.error(`Upload failed for file ${index}:`, error);
        return null;
      }
    });

    try {
      const uploadedItems = (await Promise.all(uploadPromises)).filter(Boolean) as MediaItem[];
      console.log(`Successfully uploaded ${uploadedItems.length} items`);
      
      if (uploadedItems.length > 0) {
        const newValue = [...value, ...uploadedItems];
        console.log('Updating value with new items:', newValue);
        onChange(set(newValue));
      }
    } catch (error) {
      console.error('Failed to process uploads:', error);
    } finally {
      setIsUploading(false);
    }
  }, [client, onChange, value, readOnly]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue.length > 0 ? set(newValue) : unset());
  }, [onChange, value]);

  const getImageUrl = (item: any) => {
    if (!item.asset?._ref) return null;
    try {
      return builder.image(item).width(200).height(200).fit('crop').url();
    } catch (error) {
      console.error('Failed to generate image URL:', error);
      return null;
    }
  };

  const dropZoneStyle: React.CSSProperties = {
    border: dragActive ? '2px dashed #0066cc' : '2px dashed #ccc',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    cursor: readOnly ? 'default' : 'pointer',
    opacity: readOnly ? 0.6 : 1,
    backgroundColor: dragActive ? '#f0f8ff' : '#fafafa',
    transition: 'all 0.2s ease',
  };

  const imageGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  };

  const imageItemStyle: React.CSSProperties = {
    position: 'relative',
    width: '120px',
    height: '120px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const removeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '4px',
    right: '4px',
    background: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div>
      <div
        style={dropZoneStyle}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📁</div>
        <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
          {isUploading 
            ? 'Uploading files...' 
            : 'Drag and drop images and videos here, or click to select files'
          }
        </p>
        {!readOnly && (
          <button
            type="button"
            disabled={isUploading}
            style={{
              background: '#0066cc',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.6 : 1,
            }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = 'image/*,video/*';
              input.onchange = (e) => handleFileInput(e as any);
              input.click();
            }}
          >
Select Files
          </button>
        )}
      </div>

      {value.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Gallery Items ({value.length})</h4>
          <div style={imageGridStyle}>
            {value.map((item: any, index: number) => (
              <div key={item._key || index} style={imageItemStyle}>
                {item._type === 'image' && getImageUrl(item) ? (
                  <img
                    src={getImageUrl(item)!}
                    alt={`Gallery image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : item._type === 'file' ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#2a2a2a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      fontSize: '24px',
                      color: 'white',
                    }}
                  >
                    🎥
                    <div style={{ fontSize: '10px', marginTop: '4px' }}>Video</div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#666',
                    }}
                  >
                    Loading...
                  </div>
                )}
                {!readOnly && (
                  <button
                    type="button"
                    style={removeButtonStyle}
                    onClick={() => removeImage(index)}
                    title={`Remove ${item._type === 'file' ? 'video' : 'image'}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
