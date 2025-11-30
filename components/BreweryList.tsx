"use client"

import React, { useEffect, useRef, useState } from 'react';
import BreweryCard from './BreweryCard';
import type { Brewery } from '@/lib/types';
import Loading from '@/app/loading';


interface BreweryListProps {
  breweries: Brewery[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  isLoading: boolean;
  hasMore: boolean;
  onScrollDown: () => Promise<void> | void;
  onScrollUp: () => void;
}

const BreweryList: React.FC<BreweryListProps> = ({
  breweries, selectedIds, onToggleSelect, isLoading, hasMore, onScrollDown, onScrollUp
}) => {
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const [fiveCardsHeight, setFiveCardHeight] = useState<null | number>(null)

  useEffect(() => {
    if (!firstCardRef.current) return

    const h = firstCardRef.current.offsetHeight;

    if (h > 0) setFiveCardHeight(h * 5)
  }, [breweries])

  if (!breweries.length && !isLoading) <p>No breweries.</p>

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, clientHeight, scrollHeight } = target
    const threshold = fiveCardsHeight ?? 200;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    const oneCardHeight = (fiveCardsHeight ?? 200) / 5
    const nearTop = scrollTop <= oneCardHeight

    if (nearBottom && !isLoading && hasMore) void onScrollDown();
    if (nearTop && !isLoading) onScrollUp();
  }

  return (
    <div className='space-y-2 max-h-[calc(100vh-100px)] overflow-y-auto' onScroll={handleScroll}>
      {breweries.map((brewery, index) => (
        <BreweryCard
          key={brewery.id}
          ref={index === 0 ? firstCardRef : undefined}
          brewery={brewery}
          isSelected={selectedIds.includes(brewery.id)}
          onRightClick={() => onToggleSelect(brewery.id)}
        />
      ))}

      {isLoading && <Loading />}
    </div>
  )
}

export default BreweryList;