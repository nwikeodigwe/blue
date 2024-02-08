import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./component/auth-button-server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabse = createServerComponentClient<Database>({ cookies });
  const { data: tweets } = await supabse.from("tweets").select();
  const {
    data: { session },
  } = await supabse.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <AuthButtonServer />
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
