"use client";

import Script from "next/script";
import { createClient } from "@/utils/supabase/client";
import type { accounts, CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import { useRef } from "react";

declare const google: { accounts: accounts };

const generateNonce = async (): Promise<[string, string]> => {
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
  );
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(nonce),
  );
  const hashedNonce = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return [nonce, hashedNonce];
};

const OneTapComponent = () => {
  const supabase = createClient();
  const router = useRouter();
  const initialized = useRef(false);

  const initOneTap = async () => {
    if (initialized.current) return;
    initialized.current = true;

    const { data } = await supabase.auth.getSession();
    if (data.session) return;

    const [nonce, hashedNonce] = await generateNonce();

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      nonce: hashedNonce,
      use_fedcm_for_prompt: true,
      callback: async (response: CredentialResponse) => {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
          nonce,
        });

        if (!error) window.location.reload();
      },
    });

    google.accounts.id.prompt();
  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={initOneTap}
    />
  );
};

export default OneTapComponent;
