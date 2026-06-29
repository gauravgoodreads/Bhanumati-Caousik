import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortableText } from "@portabletext/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { imageUrl } from "@/lib/sanity";
import { useCms } from "@/hooks/useCms";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const { data } = useCms();
  const blog = data?.blogPosts.find((post) => post.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <Link href="/blog"><Button>Back to Blog</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
        <Card className="overflow-hidden shadow-xl">
          {blog.image && (
            <img
              src={imageUrl(blog.image, 1200)}
              alt={blog.image.alt || blog.title}
              className="w-full max-h-[460px] object-cover"
              loading="lazy"
            />
          )}
          <CardContent className="p-7 md:p-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>
            <div className="flex flex-wrap gap-6 text-gray-500 mb-8 pb-6 border-b">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {format(new Date(blog.publishedAt), "MMMM dd, yyyy")}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {blog.author}
              </span>
            </div>
            <div className="prose prose-lg max-w-none">
              {blog.body ? <PortableText value={blog.body as never} /> : <p className="text-gray-700">{blog.excerpt}</p>}
            </div>
          </CardContent>
        </Card>
      </article>
      <Footer />
    </div>
  );
}
