"use client";

import { useEffect } from "react";
import Loading from "./loading";
import BreweryList from "@/components/BreweryList";
import DeleteSelectedButton from "@/components/DeleteSelectedButton";
import { useBreweriesStore } from "@/store/breweriesStore";

export default function Home() {
  const visible = useBreweriesStore((state) => state.visible);
  const selectedIds = useBreweriesStore((state) => state.selectedIds);
  const loadInitial = useBreweriesStore((state) => state.loadInitial);
  const deleteSelected = useBreweriesStore((state) => state.deleteSelected);
  const isLoading = useBreweriesStore((state) => state.isLoading);
  const toggleSelect = useBreweriesStore((state) => state.toggleSelect);
  const hasMore = useBreweriesStore((state) => state.hasMore);
  const moveWondowDown = useBreweriesStore((state) => state.moveWondowDown);
  const moveWindowUp = useBreweriesStore((state) => state.moveWindowUp);

  useEffect(() => {
    loadInitial();
  }, [])

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Breweries</h1>
          <DeleteSelectedButton
            count={selectedIds.length}
            onDelete={deleteSelected}
          />
        </header>

        {!visible.length ?
          <Loading /> :
          <BreweryList
            breweries={visible}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            isLoading={isLoading}
            hasMore={hasMore}
            onScrollDown={moveWondowDown}
            onScrollUp={moveWindowUp}
          />
        }
      </div>
    </main>
  );
}
