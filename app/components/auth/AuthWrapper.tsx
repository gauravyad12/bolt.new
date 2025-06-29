import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/remix';
import { useLoaderData } from '@remix-run/react';
import type { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { ENV } = useLoaderData<{ ENV: { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string } }>();

  return (
    <ClerkProvider publishableKey={ENV.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}