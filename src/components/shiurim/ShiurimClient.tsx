"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import type { Shiur, SortOrder, BrowseState, PlayerState } from "@/lib/types";
import { getCategoryCounts, getSubLevel1Values, getSubLevel2Values, getCategoryDef } from "@/lib/categories";
import { PARSHIYOS_BY_SEFER } from "@/lib/categoryConfig";
import ShiurimHero from "./ShiurimHero";
import SearchBar from "./SearchBar";
import CategoryBrowser from "./CategoryBrowser";
import LatestShiurim from "./LatestShiurim";
import ShiurimList from "./ShiurimList";
import ShiurCard from "./ShiurCard";
import AudioPlayer from "./AudioPlayer";
import ThisWeeksParsha from "./ThisWeeksParsha";

export default function ShiurimClient({
  initialShiurim,
  currentParsha,
}: {
  initialShiurim: Shiur[];
  currentParsha: { name: string; hebrew: string } | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [browseState, setBrowseState] = useState<BrowseState>({
    categoryId: null,
    subLevel1: null,
    subLevel2: null,
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentShiur: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  // Category counts for the grid
  const categoryCounts = useMemo(
    () => getCategoryCounts(initialShiurim),
    [initialShiurim]
  );

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return initialShiurim.filter((s) =>
      s.title.toLowerCase().includes(q)
    );
  }, [searchQuery, initialShiurim]);

  // Browsing: get shiurim for current drill-down level
  const browsedShiurim = useMemo(() => {
    if (!browseState.categoryId) return null;

    let filtered = initialShiurim.filter(
      (s) => s.categoryId === browseState.categoryId
    );

    if (browseState.subLevel1) {
      filtered = filtered.filter((s) => s.subLevel1 === browseState.subLevel1);
    }
    if (browseState.subLevel2) {
      filtered = filtered.filter((s) => s.subLevel2 === browseState.subLevel2);
    }

    // Sort
    filtered.sort((a, b) => {
      const diff = new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });

    return filtered;
  }, [initialShiurim, browseState, sortOrder]);

  // Sub-level navigation data
  const subLevel1Values = useMemo(() => {
    if (!browseState.categoryId) return [];
    const catDef = getCategoryDef(browseState.categoryId);
    if (!catDef?.drillDown) return [];

    // For parsha, use the canonical order from config
    if (catDef.drillDown === "parsha") {
      return Object.keys(PARSHIYOS_BY_SEFER);
    }
    return getSubLevel1Values(initialShiurim, browseState.categoryId);
  }, [browseState.categoryId, initialShiurim]);

  const subLevel2Values = useMemo(() => {
    if (!browseState.categoryId || !browseState.subLevel1) return [];
    const catDef = getCategoryDef(browseState.categoryId);
    if (!catDef?.drillDown) return [];

    // For parsha, use canonical order
    if (catDef.drillDown === "parsha") {
      const parshiyos = PARSHIYOS_BY_SEFER[browseState.subLevel1] || [];
      // Only return parshiyos that actually have shiurim
      const available = new Set(
        initialShiurim
          .filter(
            (s) =>
              s.categoryId === browseState.categoryId &&
              s.subLevel1 === browseState.subLevel1
          )
          .map((s) => s.subLevel2)
          .filter(Boolean)
      );
      return parshiyos.filter((p) => available.has(p));
    }

    return getSubLevel2Values(
      initialShiurim,
      browseState.categoryId,
      browseState.subLevel1
    );
  }, [browseState.categoryId, browseState.subLevel1, initialShiurim]);

  // Breadcrumb labels
  const breadcrumbs = useMemo(() => {
    const crumbs: { label: string; onClick: () => void }[] = [
      {
        label: "All Categories",
        onClick: () =>
          setBrowseState({ categoryId: null, subLevel1: null, subLevel2: null }),
      },
    ];

    if (browseState.categoryId) {
      const catDef = getCategoryDef(browseState.categoryId);
      crumbs.push({
        label: catDef?.label || browseState.categoryId,
        onClick: () =>
          setBrowseState({ ...browseState, subLevel1: null, subLevel2: null }),
      });
    }

    if (browseState.subLevel1) {
      crumbs.push({
        label: browseState.subLevel1,
        onClick: () => setBrowseState({ ...browseState, subLevel2: null }),
      });
    }

    if (browseState.subLevel2) {
      crumbs.push({
        label: browseState.subLevel2,
        onClick: () => {},
      });
    }

    return crumbs;
  }, [browseState]);

  // Audio player controls
  const playShiur = useCallback((shiur: Shiur) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playerState.currentShiur?.id === shiur.id) {
      // Toggle play/pause for same shiur
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      // Play a new shiur
      audio.src = shiur.audioUrl;
      audio.play();
      setPlayerState((prev) => ({
        ...prev,
        currentShiur: shiur,
        isPlaying: true,
        currentTime: 0,
      }));
    }
  }, [playerState.currentShiur?.id]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlayerState((prev) => ({ ...prev, playbackRate: rate }));
  }, []);

  const closePlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setPlayerState({
      currentShiur: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
    });
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlayerState((p) => ({ ...p, isPlaying: true }));
    const onPause = () => setPlayerState((p) => ({ ...p, isPlaying: false }));
    const onTimeUpdate = () =>
      setPlayerState((p) => ({ ...p, currentTime: audio.currentTime }));
    const onDurationChange = () =>
      setPlayerState((p) => ({ ...p, duration: audio.duration || 0 }));
    const onEnded = () =>
      setPlayerState((p) => ({ ...p, isPlaying: false, currentTime: 0 }));

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Determine what to show
  const isSearching = searchQuery.trim().length > 0;
  const isBrowsingCategory = browseState.categoryId !== null;
  const showCategoryGrid = !isSearching && !isBrowsingCategory;
  const catDef = browseState.categoryId
    ? getCategoryDef(browseState.categoryId)
    : null;
  const showSubLevel1 =
    isBrowsingCategory && catDef?.drillDown && !browseState.subLevel1;
  const showSubLevel2 =
    isBrowsingCategory &&
    catDef?.drillDown === "parsha" &&
    browseState.subLevel1 &&
    !browseState.subLevel2;
  const showShiurimList =
    isSearching ||
    (isBrowsingCategory && !showSubLevel1 && !showSubLevel2);

  return (
    <main className="min-h-screen">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" />

      <ShiurimHero totalCount={initialShiurim.length} />

      {/* This Week's Parsha */}
      {currentParsha && showCategoryGrid && (
        <ThisWeeksParsha
          parshaName={currentParsha.name}
          parshaHebrew={currentParsha.hebrew}
          shiurim={initialShiurim}
          onPlay={playShiur}
          currentShiurId={playerState.currentShiur?.id}
          isPlaying={playerState.isPlaying}
          onViewAll={() => {
            // Navigate to Parsha category, find the sefer, then the specific parsha
            const parshaShiur = initialShiurim.find(
              (s) =>
                s.categoryId === "parsha" &&
                s.subLevel2?.toLowerCase() === currentParsha.name.toLowerCase()
            );
            if (parshaShiur?.subLevel1 && parshaShiur?.subLevel2) {
              setBrowseState({
                categoryId: "parsha",
                subLevel1: parshaShiur.subLevel1,
                subLevel2: parshaShiur.subLevel2,
              });
            } else {
              setBrowseState({
                categoryId: "parsha",
                subLevel1: null,
                subLevel2: null,
              });
            }
          }}
        />
      )}

      {/* Search Bar */}
      <section className="bg-bg-alt border-b border-primary/10 py-6 px-6 sticky top-[73px] z-40 backdrop-blur-sm bg-bg-alt/95">
        <div className="max-w-5xl mx-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 bg-bg-light">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs (when browsing) */}
          {isBrowsingCategory && (
            <nav className="flex items-center gap-2 text-sm text-navy/50 mb-8 flex-wrap">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-navy/30">/</span>}
                  {i < breadcrumbs.length - 1 ? (
                    <button
                      onClick={crumb.onClick}
                      className="hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-navy font-semibold">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Search Results */}
          {isSearching && (
            <div>
              <p className="text-navy/60 text-sm mb-6">
                {searchResults?.length || 0} result{searchResults?.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
              </p>
              {searchResults && searchResults.length > 0 && (
                <ShiurimList
                  shiurim={searchResults}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                  onPlay={playShiur}
                  currentShiurId={playerState.currentShiur?.id}
                  isPlaying={playerState.isPlaying}
                />
              )}
            </div>
          )}

          {/* Category Grid (landing view) */}
          {showCategoryGrid && (
            <>
              <CategoryBrowser
                categories={categoryCounts}
                onSelectCategory={(id) =>
                  setBrowseState({
                    categoryId: id,
                    subLevel1: null,
                    subLevel2: null,
                  })
                }
              />
              <LatestShiurim
                shiurim={initialShiurim.slice(0, 6)}
                onPlay={playShiur}
                currentShiurId={playerState.currentShiur?.id}
                isPlaying={playerState.isPlaying}
              />
            </>
          )}

          {/* Sub-level 1 navigation (sefer, topic) */}
          {showSubLevel1 && (
            <div>
              <h2 className="serif-heading text-navy text-3xl font-bold mb-8">
                {catDef?.label}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {subLevel1Values.map((val) => {
                  const count = initialShiurim.filter(
                    (s) =>
                      s.categoryId === browseState.categoryId &&
                      s.subLevel1 === val
                  ).length;
                  return (
                    <button
                      key={val}
                      onClick={() =>
                        setBrowseState({ ...browseState, subLevel1: val })
                      }
                      className="bg-white border border-primary/15 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left"
                    >
                      <h3 className="text-navy font-bold text-lg">{val}</h3>
                      <p className="text-navy/50 text-sm mt-1">
                        {count} shiur{count !== 1 ? "im" : ""}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-level 2 navigation (parsha, perek) */}
          {showSubLevel2 && (
            <div>
              <h2 className="serif-heading text-navy text-3xl font-bold mb-8">
                {browseState.subLevel1}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {subLevel2Values.map((val) => {
                  const count = initialShiurim.filter(
                    (s) =>
                      s.categoryId === browseState.categoryId &&
                      s.subLevel1 === browseState.subLevel1 &&
                      s.subLevel2 === val
                  ).length;
                  return (
                    <button
                      key={val}
                      onClick={() =>
                        setBrowseState({ ...browseState, subLevel2: val })
                      }
                      className="bg-white border border-primary/15 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left"
                    >
                      <h3 className="text-navy font-bold">{val}</h3>
                      <p className="text-navy/50 text-sm mt-1">
                        {count} shiur{count !== 1 ? "im" : ""}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shiurim List (at the deepest drill-down or for non-drillable categories) */}
          {showShiurimList && !isSearching && browsedShiurim && (
            <ShiurimList
              shiurim={browsedShiurim}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              onPlay={playShiur}
              currentShiurId={playerState.currentShiur?.id}
              isPlaying={playerState.isPlaying}
            />
          )}
        </div>
      </section>

      {/* Archive CTA */}
      {!isSearching && !isBrowsingCategory && (
        <section className="bg-navy py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="serif-heading text-primary text-3xl font-bold mb-4">
              Explore the Full Archive
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Browse all 2,000+ shiurim on JewishPodcasts.fm
            </p>
            <a
              href="https://listen.jewishpodcasts.fm/rabbisteinhauer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-navy font-bold px-8 py-3 rounded-xl hover:bg-primary-light transition-colors"
            >
              Browse Full Archive
            </a>
          </div>
        </section>
      )}

      {/* Audio Player */}
      {playerState.currentShiur && (
        <AudioPlayer
          shiur={playerState.currentShiur}
          isPlaying={playerState.isPlaying}
          currentTime={playerState.currentTime}
          duration={playerState.duration}
          playbackRate={playerState.playbackRate}
          onTogglePlay={togglePlayPause}
          onSeek={seek}
          onSetRate={setPlaybackRate}
          onClose={closePlayer}
        />
      )}
    </main>
  );
}
