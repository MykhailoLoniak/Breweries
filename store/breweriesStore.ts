import { fetchBreweries } from "@/lib/api";
import { Brewery } from "@/lib/types";
import { create } from "zustand";

const WINDOW_SIZE = 15;

interface BreweriesStore {
  breweries: Brewery[];
  visible: Brewery[];
  selectedIds: string[];
  page: number;
  isLoading: boolean;
  hasMore: boolean;
  startIndex: number;
  loadInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
  toggleSelect: (id: string) => void;
  deleteSelected: () => Promise<void>;
  moveWondowDown: () => Promise<void>;
  moveWindowUp: () => void;
}

export const useBreweriesStore = create<BreweriesStore>((set, get) => ({
  breweries: [],
  visible: [],
  selectedIds: [],
  page: 1,
  isLoading: false,
  hasMore: true,
  startIndex: 0,

  loadInitial: async () => {
    const { breweries, visible } = get();
    if (breweries.length > 0 && visible.length === 15) return;

    set({ isLoading: true });

    try {
      const data = await fetchBreweries(1, WINDOW_SIZE);

      const startIndex = 0;
      const visible = data.slice(startIndex, startIndex + WINDOW_SIZE);

      set({
        breweries: data,
        visible,
        page: 1,
        isLoading: false,
        hasMore: data.length > 0,
        startIndex,
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { page, breweries, hasMore, startIndex, isLoading } = get();
    if (!hasMore || isLoading) return;

    set({ isLoading: true });

    try {
      const nesxtPage = page + 1;

      const data = await fetchBreweries(nesxtPage, WINDOW_SIZE);

      if (data.length === 0) {
        set({
          hasMore: false,
          isLoading: false,
        });

        return;
      }

      const newBreweries = [...breweries, ...data];

      const maxStart = Math.max(0, newBreweries.length - WINDOW_SIZE);
      const clampedStart = Math.min(startIndex, maxStart);
      const visible = newBreweries.slice(
        clampedStart,
        clampedStart + WINDOW_SIZE
      );

      set({
        breweries: newBreweries,
        visible,
        page: nesxtPage,
        isLoading: false,
        hasMore: true,
        startIndex: clampedStart,
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  moveWondowDown: async () => {
    const { breweries, startIndex, hasMore } = get();

    const below = breweries.length - (startIndex + WINDOW_SIZE);

    if (below > 0) {
      const newStart = startIndex + 1;
      const visible = breweries.slice(newStart, newStart + WINDOW_SIZE);

      set({ startIndex: newStart, visible });
    } else if (hasMore) {
      await get().loadMore();
      const updated = get().breweries;

      if (updated.length > WINDOW_SIZE) {
        const newStart = Math.min(updated.length - WINDOW_SIZE, startIndex + 1);
        const visible = updated.slice(newStart, newStart + WINDOW_SIZE);

        set({ startIndex: newStart, visible });
      }
    }
  },

  moveWindowUp: () => {
    const { breweries, startIndex } = get();

    if (startIndex <= 0) return;

    const newStart = startIndex - 1;
    const visible = breweries.slice(newStart, newStart + WINDOW_SIZE);

    set({ startIndex: newStart, visible });
  },

  toggleSelect: (id) => {
    const { selectedIds } = get();

    if (!selectedIds.includes(id)) {
      set({ selectedIds: [...selectedIds, id] });

      return;
    }

    set({ selectedIds: selectedIds.filter((x) => x !== id) });
  },

  deleteSelected: async () => {
    const { breweries, selectedIds, hasMore, loadMore, startIndex } = get();

    if (!selectedIds.length) return;

    let filtered = breweries.filter((b) => !selectedIds.includes(b.id));

    while (filtered.length < WINDOW_SIZE && hasMore) {
      await loadMore();
      filtered = breweries.filter((b) => !selectedIds.includes(b.id));
    }

    const maxStart = Math.max(0, filtered.length - WINDOW_SIZE);
    const newStart = Math.min(startIndex, maxStart);

    const visible = filtered.slice(newStart, newStart + WINDOW_SIZE);

    set({
      breweries: filtered,
      visible,
      startIndex: newStart,
      selectedIds: [],
    });
  },
}));
