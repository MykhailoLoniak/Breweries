"use client";

import React, { forwardRef } from 'react'
import type { Brewery } from '@/lib/types'
import BreweryActionLink from './BreweryActionLink';
import Link from 'next/link';

const formatAddress = (b: Brewery) => [
  b.city,
  b.street,
  b.postal_code,
]
  .filter(Boolean)
  .join(", ");

const formatLocation = (b: Brewery) => [
  b.city,
  b.state_province ||
  b.state,
  b.country,
]
  .filter(Boolean)
  .join(", ");

interface BreweryCardProps {
  brewery: Brewery;
  isSelected: boolean;
  onRightClick: () => void;
}

const BreweryCard = forwardRef<HTMLDivElement, BreweryCardProps>(({
  brewery, isSelected, onRightClick,
}, ref) => {
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onRightClick();
  }

  const address = formatAddress(brewery)
  const location = formatLocation(brewery)

  return (
    <div
      onContextMenu={handleContextMenu}
      className={`border p-5 block rounded-lg ${isSelected && 'bg-gray-100 opacity-65'}`}
      ref={ref}
    >
      <Link href={`/brewery/${brewery.id}`}>
        <div className='flex justify-between'>
          <h2 className='font-semibold w-full'>{brewery.name}</h2>
          <span className={`px-4 py-1 text-white rounded-sm ${brewery.brewery_type === 'micro' ? 'bg-green-200' : 'bg-red-200'}`}>{brewery.brewery_type}</span>
        </div>

        <div className='flex gap-5'>
          <div>
            <span className='inline-block w-full text-gray-500'>Location</span>
            <span>{location}</span>
          </div>
          <div>
            <span className='inline-block w-full text-gray-500'>Address</span>
            <span>{address}</span>
          </div>
        </div>
      </Link>

      <div className='flex gap-5'>
        <BreweryActionLink type='call' value={brewery.phone} />
        <BreweryActionLink type='website' value={brewery.website_url} />
        <BreweryActionLink type='map' latitude={brewery.latitude} longitude={brewery.longitude} />
      </div>
    </div>
  );
})

BreweryCard.displayName = "BreweryCard";

export default BreweryCard;