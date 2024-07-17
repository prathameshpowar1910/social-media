"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Share2, Download, Eye } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';

interface ImageData {
  id: string;
  name: string;
  url: string;
  views: number;
  uploadDate: string;
  userId: string;
}

export default function ImageView() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/images/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const data = await response.json();
        setImage(data);
      } catch (err) {
        setError("Failed to load image");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied",
        description: "The image link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    });
  };

  const handleDownload = async () => {
    if (image) {
      try {
        const response = await fetch(image.url, { mode: 'no-cors' });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = image.name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast({
          title: "Download started",
          description: "The image is being downloaded.",
        })
      } catch (error) {
        console.error('Download failed:', error);
        toast({
          title: "Download failed",
          description: "An error occurred while downloading the image.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!image) return null;

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen">
      <Card className="flex flex-col h-full overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <CardTitle>{image.name}</CardTitle>
          <CardDescription>
            Uploaded on {new Date(image.uploadDate).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow relative">
            <Image
              src={image.url}
              alt={image.name}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
          <div className="flex justify-between items-center mt-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>{image.views} views</span>
            </div>
            <div className="space-x-2">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}