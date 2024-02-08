import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "./component/auth-button";

export default async function Home() {
  const supabse = createServerComponentClient({ cookies });
  const { data: tweets } = await supabse.from("tweets").select();

  const handleSignIn = () => {
    console.log("Clicked");
  };
  return (
    <>
      <AuthButton />
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
