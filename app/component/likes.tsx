"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type Tweet = Database["public"]["Tables"]["tweets"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"];

type TweetWithAuthor = Tweet & {
  author: Profile;
  likes: number;
  user_has_liked_tweet: boolean;
};

export default function Likes({ tweet }: { tweet: TweetWithAuthor }) {
  const router = useRouter();
  const handleLikes = async () => {
    const supabase = createClientComponentClient<Database>();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      if (tweet.user_has_liked_tweet) {
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet: tweet.id });
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet: tweet.id });
      }
      router.refresh();
    }
  };
  return <button onClick={handleLikes}>{tweet.likes}Likes</button>;
}
