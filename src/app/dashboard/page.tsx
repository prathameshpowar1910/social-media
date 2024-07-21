"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Upload } from 'lucide-react'; // Added Upload icon

interface Image {
  id: string;
  name: string;
  url: string;
  views: number;
}

const IMAGE_LIMIT = 50;

export default function Dashboard() {
  const [images, setImages] = useState<Image[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchImages();
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchImages = async () => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'images'), where('userId', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const fetchedImages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Image));
    setImages(fetchedImages);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;

    if (images.length >= IMAGE_LIMIT) {
      toast({
        title: "Upload limit reached",
        description: `You've reached the maximum limit of ${IMAGE_LIMIT} images.`,
        variant: "destructive",
      });
      return;
    }

    const storageRef = ref(storage, `images/${auth.currentUser.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, 'images'), {
      userId: auth.currentUser.uid,
      url: downloadURL,
      name: file.name,
      views: 0,
      uploadDate: new Date().toISOString(),
    });

    setFile(null);
    fetchImages();
    toast({
      title: "Image uploaded",
      description: "Your image has been successfully uploaded.",
    })
  };

  const handleDelete = async (id: string, url: string) => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, 'images', id));
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
      setImages(images.filter(image => image.id !== id));

      toast({
        title: "Image deleted",
        description: "Your image has been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/image/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link copied",
        description: "The image link has been copied to your clipboard.",
      });
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    });
  };

  const openImageInNewTab = (id: string) => {
    const link = `${window.location.origin}/image/${id}`;
    window.open(link, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Input type="file" onChange={handleFileChange} />
                <Button onClick={handleUpload} disabled={images.length >= IMAGE_LIMIT}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {images.length} / {IMAGE_LIMIT} images uploaded ({IMAGE_LIMIT - images.length} remaining)
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Your Images:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map(image => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <div
                    className="relative w-full h-48 mb-2"
                    onClick={() => openImageInNewTab(image.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Image
                      src={image.url}
                      alt={image.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <p>{image.name}</p>
                  <p>Views: {image.views}</p>
                  <div className="flex justify-between mt-2">
                    <Button onClick={() => copyLink(image.id)} variant="outline">
                      Copy Link
                    </Button>
                    <Button onClick={() => handleDelete(image.id, image.url)} variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}