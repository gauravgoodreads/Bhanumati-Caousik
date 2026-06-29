import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { imageUrl } from "@/lib/sanity";
import { useCms } from "@/hooks/useCms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogPage() {
  const { data } = useCms();
  const blogs = data?.blogPosts ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/20">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Latest <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Insights</span>
            </h1>
            <p className="text-lg text-gray-600">Expert perspectives on career development and professional growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <Card key={post._id} className="flex flex-col h-full overflow-hidden shadow-lg">
                {post.image && (
                  <img
                    src={imageUrl(post.image, 700)}
                    alt={post.image.alt || post.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                )}
                <CardHeader>
                  {post.featured && <span className="text-xs font-semibold text-purple-600 mb-2">FEATURED</span>}
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-gray-600 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t pt-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(post.publishedAt), "MMM dd, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
