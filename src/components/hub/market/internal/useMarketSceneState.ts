// src/components/hub/market/internal/useMarketSceneState.ts - Orquesta estado/acciones de Market sobre store local Zustand y selectores derivados.
"use client";

import { SetStateAction, useMemo } from "react";
import { buildMarketListingView } from "@/components/hub/market/market-listing-view";
import { useSyncSelectedListing } from "@/components/hub/market/internal/useSyncSelectedListing";
import { useHubModuleSfx } from "@/components/hub/internal/use-hub-module-sfx";
import { buildMarketVaultCollectionView } from "@/components/hub/market/vault/build-market-vault-collection-view";
import { ICollectionCard } from "@/core/entities/home/ICollectionCard";
import { IMarketTransaction } from "@/core/entities/market/IMarketTransaction";
import { IMarketCatalog } from "@/core/use-cases/market/GetMarketCatalogUseCase";
import { useMarketPurchaseActions } from "@/components/hub/market/internal/useMarketPurchaseActions";
import { useLocalMarketSceneStore, useMarketStoreSelector } from "@/components/hub/market/internal/market-scene-store";
import { countRender } from "@/services/performance/dev-performance-telemetry";

interface UseMarketSceneStateInput {
  playerId: string;
  initialCatalog: IMarketCatalog;
  initialTransactions: IMarketTransaction[];
  initialCollection: ICollectionCard[];
}

export function useMarketSceneState(input: UseMarketSceneStateInput) {
  countRender("useMarketSceneState");
  const { play } = useHubModuleSfx();
  const store = useLocalMarketSceneStore(input.initialCatalog, input.initialTransactions, input.initialCollection);
  const catalog = useMarketStoreSelector(store, (state) => state.catalog);
  const transactions = useMarketStoreSelector(store, (state) => state.transactions);
  const collection = useMarketStoreSelector(store, (state) => state.collection);
  const selectedPackId = useMarketStoreSelector(store, (state) => state.selectedPackId);
  const selectedListing = useMarketStoreSelector(store, (state) => state.selectedListing);
  const selectedCard = useMarketStoreSelector(store, (state) => state.selectedCard);
  const nameQuery = useMarketStoreSelector(store, (state) => state.nameQuery);
  const typeFilter = useMarketStoreSelector(store, (state) => state.typeFilter);
  const orderField = useMarketStoreSelector(store, (state) => state.orderField);
  const orderDirection = useMarketStoreSelector(store, (state) => state.orderDirection);
  const errorMessage = useMarketStoreSelector(store, (state) => state.errorMessage);
  const revealedPackCards = useMarketStoreSelector(store, (state) => state.revealedPackCards);
  const isPackRevealOpen = useMarketStoreSelector(store, (state) => state.isPackRevealOpen);
  const isBuyingPack = useMarketStoreSelector(store, (state) => state.isBuyingPack);
  const setSelectedListing = (value: SetStateAction<typeof selectedListing>) =>
    store.setState((state) => ({ selectedListing: typeof value === "function" ? value(state.selectedListing) : value }));
  const setSelectedCard = (value: SetStateAction<typeof selectedCard>) =>
    store.setState((state) => ({ selectedCard: typeof value === "function" ? value(state.selectedCard) : value }));
  const setSelectedPackId = (value: string | null) => store.setState({ selectedPackId: value });
  const setNameQuery = (value: string) => store.setState({ nameQuery: value });
  const setTypeFilter = (value: typeof typeFilter) => store.setState({ typeFilter: value });
  const setOrderField = (value: typeof orderField) => store.setState({ orderField: value });
  const setOrderDirection = (value: typeof orderDirection | ((previous: typeof orderDirection) => typeof orderDirection)) =>
    store.setState((state) => ({ orderDirection: typeof value === "function" ? value(state.orderDirection) : value }));
  const setErrorMessage = (value: string | null) => store.setState({ errorMessage: value });
  const setIsPackRevealOpen = (value: boolean) => store.setState({ isPackRevealOpen: value });
  const scopedListings = useMemo(() => {
    if (!selectedPackId) return catalog.listings.filter((listing) => listing.isAvailable);
    const selectedPack = catalog.packs.find((pack) => pack.id === selectedPackId);
    if (!selectedPack) return catalog.listings.filter((listing) => listing.isAvailable);
    const previewSet = new Set(selectedPack.previewCardIds);
    return catalog.listings.filter((listing) => previewSet.has(listing.card.id));
  }, [catalog.listings, catalog.packs, selectedPackId]);
  const visibleListings = useMemo(
    () => buildMarketListingView({ listings: scopedListings, nameQuery, typeFilter, orderField, orderDirection }),
    [nameQuery, orderDirection, orderField, scopedListings, typeFilter],
  );
  const mobileVisibleListings = useMemo(
    () => buildMarketListingView({ listings: catalog.listings.filter((listing) => listing.isAvailable), nameQuery, typeFilter, orderField, orderDirection }),
    [catalog.listings, nameQuery, orderDirection, orderField, typeFilter],
  );
  const visibleCollection = useMemo(
    () => buildMarketVaultCollectionView({ collection, nameQuery, typeFilter, orderField, orderDirection }),
    [collection, nameQuery, orderDirection, orderField, typeFilter],
  );
  useSyncSelectedListing({ selectedListing, visibleListings, setSelectedListing, setSelectedCard });
  const { handleBuyCard, handleBuyPack } = useMarketPurchaseActions({ store, playerId: input.playerId, play });

  return {
    catalog,
    transactions,
    collection,
    selectedPackId,
    selectedListing,
    selectedCard,
    nameQuery,
    typeFilter,
    orderField,
    orderDirection,
    errorMessage,
    revealedPackCards,
    isPackRevealOpen,
    isBuyingPack,
    visibleListings,
    mobileVisibleListings,
    visibleCollection,
    setSelectedPackId,
    setSelectedListing,
    setSelectedCard,
    setNameQuery,
    setTypeFilter,
    setOrderField,
    setOrderDirection,
    setErrorMessage,
    setIsPackRevealOpen,
    handleBuyCard,
    handleBuyPack,
  };
}
