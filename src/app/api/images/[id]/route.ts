import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const docRef = doc(db, 'images', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const imageData = docSnap.data();
      
      // Increment view count
      await updateDoc(docRef, {
        views: increment(1)
      });

      return NextResponse.json({
        id: docSnap.id,
        ...imageData,
      });
    } else {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}