import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./component/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./component/new-tweet";
import Likes from "./component/likes";

interface Tweet {
  id: string;
  author: {
    name: string;
    username: string;
  };
  title: string;
  likes: number;
  // Add any other properties here if needed
}

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }
  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)");

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: !!tweet.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      {tweets?.map((tweet) => (
        <div key={tweet.id}>
          <p>
            {tweet.author.name} {tweet.author.username}
          </p>
          <p>{tweet.title}</p>
          <Likes tweet={tweet} />
        </div>
      ))}
    </>
  );
}
