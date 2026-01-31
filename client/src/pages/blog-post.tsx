import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  filename: string;
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const id = params?.id;

  const { data: posts } = useQuery<BlogPost[]>({
    queryKey: ["/blog/posts.json"],
    queryFn: async () => {
      const res = await fetch("/blog/posts.json");
      return res.json();
    },
  });

  const postInfo = posts?.find((p) => p.id === id);

  const { data: content, isLoading } = useQuery({
    queryKey: ["/blog/post", postInfo?.filename],
    enabled: !!postInfo,
    queryFn: async () => {
      const res = await fetch(`/blog/${postInfo?.filename}`);
      if (!res.ok) throw new Error("Failed to fetch post content");
      const text = await res.text();
      
      // Simple frontmatter parser
      const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      let data: any = {};
      let content = text;
      
      if (match) {
        const frontmatter = match[1];
        content = match[2];
        frontmatter.split("\n").forEach(line => {
          const [key, ...val] = line.split(":");
          if (key && val.length) {
            data[key.trim()] = val.join(":").trim();
          }
        });
      }
      
      return { data, content };
    },
  });

  if (!postInfo && !isLoading) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-dav-maroon">Post not found</h1>
        <Link href="/blog" className="text-dav-saffron hover:underline mt-4 inline-block">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="flex items-center text-dav-saffron hover:text-dav-orange mb-8 transition-colors group">
          <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-64 w-full mt-8" />
          </div>
        ) : (
          <article>
            <header className="mb-12">
              <h1 className="text-4xl font-bold text-dav-maroon mb-4">
                {content?.data.title || postInfo?.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-500 border-b border-gray-100 pb-8">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(postInfo?.date || "").toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {content?.data.author || postInfo?.author}
                </span>
              </div>
            </header>

            <div className="prose prose-lg max-w-none prose-headings:text-dav-maroon prose-a:text-dav-saffron hover:prose-a:text-dav-orange">
              <ReactMarkdown>{content?.content || ""}</ReactMarkdown>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
