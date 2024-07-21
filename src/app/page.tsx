"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Share2, Download, Eye, BarChart, LogIn } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const features = [
    { title: "Upload Images", description: "Securely store your images in the cloud", icon: Upload },
    { title: "Share with Others", description: "Easily share your images with friends and family", icon: Share2 },
    { title: "Download Shared Images", description: "Download images shared with you", icon: Download },
    { title: "Track Views", description: "See how many times your images have been viewed", icon: Eye },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to ImageShare</h1>
        <p className="text-xl text-gray-600 mb-8">Your secure and easy-to-use image sharing platform</p>
        
        {user ? (
          <Button size="lg" onClick={() => router.push('/dashboard') }>
            Get Started</Button>
        ):(
          <Button size="lg" onClick={()=> router.push('/login') }>
            Get Started</Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <feature.icon className="mr-2 h-6 w-6" />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Upload className="mr-2 h-12 w-12" />
                1. Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Easily upload your images to our secure cloud storage.</CardDescription>
            </CardContent>
          </Card>
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Share2 className="mr-2 h-12 w-12" />
                2. Share
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Share your images with anyone you choose.</CardDescription>
            </CardContent>
          </Card>
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <BarChart className="mr-2 h-12 w-12" />
                3. Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Keep track of views and manage your shared images.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}