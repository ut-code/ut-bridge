import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        You are already signed in.
        <a href="/community">go to community</a>
      </SignedIn>
    </>
  );
}
