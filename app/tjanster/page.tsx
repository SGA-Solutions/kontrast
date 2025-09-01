import { client, urlFor } from "../../sanity/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

interface ServiceCategory {
  _id: string;
  title: string;
  slug: { current: string };
  body: any[];
  coverImage: any;
}

async function getServiceCategories(): Promise<ServiceCategory[]> {
  const query = `*[_type == "serviceCategory"] | order(_createdAt asc) {
    _id,
    title,
    slug,
    body,
    coverImage
  }`;
  
  return await client.fetch(query);
}

export default async function TjansterPage() {
  const serviceCategories = await getServiceCategories();

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className="px-6 sm:px-12 py-8">
        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {serviceCategories.map((category) => (
            <div key={category._id} className="group">
              {/* Service Category Card */}
              <div className="relative bg-white">
                <h2 className="text-xl font-medium text-neutral-900 mb-4 uppercase tracking-wide">
                  {category.title}
                </h2>
                {/* Clickable Image */}
                <Link href={`/tjanster/${category.slug.current}`}>
                  <div className="relative h-64 w-full cursor-pointer">
                    {category.coverImage && (
                      <Image
                        src={urlFor(category.coverImage).width(600).height(400).url()}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                </Link>
                
                {/* Content */}
                <div className="p-6">
                  
                  
                  {/* Body text */}
                  <div className="text-sm text-neutral-600 leading-relaxed">
                    <PortableText 
                      value={category.body}
                      components={{
                        block: {
                          normal: ({ children }) => <p className="mb-3">{children}</p>,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Logos Carousel */}
        <div className="border-t border-neutral-200 pt-12">
          <div>
            <div className="flex animate-scroll-left space-x-12 items-center">
              {/* First set of logos */}
              <div className="flex space-x-12 items-center min-w-max">
                <div className="text-neutral-400 font-medium text-lg tracking-wider">WALLFAST</div>
                <div className="text-neutral-400 font-bold text-lg tracking-wider">PEAB</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">MAGNOLIA</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">Vectura</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">HUMLEGÅRDEN</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">GO PROPERTIES</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">M.A.R</div>
                <div className="text-neutral-400 font-bold text-lg tracking-wider">TITANIA</div>
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex space-x-12 items-center min-w-max">
                <div className="text-neutral-400 font-medium text-lg tracking-wider">WALLFAST</div>
                <div className="text-neutral-400 font-bold text-lg tracking-wider">PEAB</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">MAGNOLIA</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">Vectura</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">HUMLEGÅRDEN</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">GO PROPERTIES</div>
                <div className="text-neutral-400 font-medium text-lg tracking-wider">M.A.R</div>
                <div className="text-neutral-400 font-bold text-lg tracking-wider">TITANIA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
