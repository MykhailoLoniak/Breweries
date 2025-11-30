"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Loading from "@/app/loading";
import type { Brewery } from "@/lib/types";
import { fetchBreweryById } from "@/lib/api";
import { useBreweriesStore } from "@/store/breweriesStore";

const formatAddress = (b: Brewery) => [
  b.state,
  b.address_1,
  b.address_2,
  b.address_3,
  b.city,
  b.state_province,
  b.state,
  b.country
]
  .filter(Boolean)
  .join(', ');

interface DetailRowProps {
  label: string;
  children?: ReactNode;
}

const DetailRow = ({ label, children }: DetailRowProps) => {
  if (!children) return null;

  return (
    <p className="flex gap-2 items-center text-xl">
      <span className="font-semibold">{label}</span>
      {children}
    </p>
  )
}

interface BreweryPageProps {
  params: Promise<{ id: string }>;
}

export default function BreweryPage({ params }: BreweryPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [brewery, setBrewery] = useState<Brewery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const breweries = useBreweriesStore((state) => state.breweries);

  useEffect(() => {
    const existing = breweries.find((b) => b.id === id);

    if (existing) {
      setBrewery(existing);
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const data = await fetchBreweryById(id);
        console.log("data", data);

        setBrewery(data);
      } catch (e) {
        setError("Failed to load brewery");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, breweries]);

  if (isLoading) return <Loading />

  if (error || !brewery) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100 transition"
          >
            Back
          </button>
          <p>Error: {error ?? "Brewery not found"}</p>
        </div>
      </main>
    );
  }

  const address = formatAddress(brewery);

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-3xl mx-auto border rounded-lg bg-white p-5 shadow-sm space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100 transition"
        >
          Back
        </button>

        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl font-bold">{brewery.name}</h1>
          <span className={`px-4 py-1 text-white rounded-sm ${brewery.brewery_type === 'micro' ? 'bg-green-200' : 'bg-red-200'}`}>{brewery.brewery_type}</span>
        </div>

        <div className="space-y-1 text-sm">
          {address && <p className="text-base text-gray-700">{address} </p>}

          <DetailRow label="Postal code">
            {brewery.postal_code}
          </DetailRow>

          <DetailRow label="Location">
            {brewery.latitude && brewery.longitude && (
              <Link
                target="_blank"
                className="text-blue-800 hover:underline"
                href={`https://www.google.com/maps/search/?api=1&query=${brewery.latitude},${brewery.longitude}`}
              >
                {brewery.latitude}, {brewery.longitude}
              </Link>
            )}
          </DetailRow>

          <DetailRow label="Phone">
            {brewery.phone && (
              <Link
                className="text-blue-800 hover:underline"
                href={`tel:${brewery.phone}`}
                target="_blank"
              >
                {brewery.phone}
              </Link>
            )}
          </DetailRow>

          <DetailRow label="Website">
            {brewery.website_url && (
              <Link
                className="text-blue-800 hover:underline"
                href={brewery.website_url}
                target="_blank"
              >
                {brewery.website_url}
              </Link>
            )}
          </DetailRow>
          <DetailRow label='Id' >id: {brewery.id}</DetailRow>
        </div>
      </div>
    </main>
  );
}
