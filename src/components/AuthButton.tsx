"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LogIn, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Icons } from "@/components/ui/icons"; // Assuming this is where your Icons object is exported from
import { useRouter } from "next/navigation";

function AuthButton() {
  const { user, loading } = useAuth();
  const router = useRouter();
  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  if (user) {
    return (
      <Button variant="outline" onClick={() => auth.signOut()}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    );
  }

  return (
    <Link href="/login" passHref>
      <Button variant="outline">
        <LogIn className="mr-2 h-4 w-4" onClick={()=> router.push('/login') } />
        Login
      </Button>
    </Link>
  );
}

export { AuthButton };