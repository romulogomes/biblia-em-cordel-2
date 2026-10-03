import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface Bookmark {
  id: string;
  bookSlug: string;
  bookName: string;
  chapterSlug: string;
  savedAt: number;
}

export interface ReadingProgress {
  bookSlug: string;
  chapterSlug: string;
  bookName: string;
  readAt: number;
}

interface BibleContextType {
  bookmarks: Bookmark[];
  recentlyRead: ReadingProgress[];
  fontSize: number;
  darkReaderMode: boolean;
  addBookmark: (bookmark: Omit<Bookmark, "id" | "savedAt">) => void;
  removeBookmark: (id: string) => void;
  removeBookmarkByRef: (bookSlug: string, chapterSlug: string) => void;
  isBookmarked: (bookSlug: string, chapterSlug: string) => boolean;
  recordReading: (item: Omit<ReadingProgress, "readAt">) => void;
  setFontSize: (size: number) => void;
  toggleDarkReaderMode: () => void;
}

const BibleContext = createContext<BibleContextType | null>(null);

const STORAGE_KEYS = {
  bookmarks: "@bible_bookmarks",
  recentlyRead: "@bible_recently_read",
  fontSize: "@bible_font_size",
  darkReaderMode: "@bible_dark_reader",
};

export function BibleProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [recentlyRead, setRecentlyRead] = useState<ReadingProgress[]>([]);
  const [fontSize, setFontSizeState] = useState(18);
  const [darkReaderMode, setDarkReaderMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [bRaw, rRaw, fRaw, dRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.bookmarks),
          AsyncStorage.getItem(STORAGE_KEYS.recentlyRead),
          AsyncStorage.getItem(STORAGE_KEYS.fontSize),
          AsyncStorage.getItem(STORAGE_KEYS.darkReaderMode),
        ]);
        if (bRaw) setBookmarks(JSON.parse(bRaw) as Bookmark[]);
        if (rRaw) setRecentlyRead(JSON.parse(rRaw) as ReadingProgress[]);
        if (fRaw) setFontSizeState(Number(fRaw));
        if (dRaw) setDarkReaderMode(dRaw === "true");
      } catch {
        // ignore
      }
    })();
  }, []);

  const addBookmark = useCallback((item: Omit<Bookmark, "id" | "savedAt">) => {
    const newBookmark: Bookmark = {
      ...item,
      id: `${item.bookSlug}-${item.chapterSlug}-${Date.now()}`,
      savedAt: Date.now(),
    };
    setBookmarks((prev) => {
      const filtered = prev.filter(
        (b) => !(b.bookSlug === item.bookSlug && b.chapterSlug === item.chapterSlug)
      );
      const next = [newBookmark, ...filtered];
      AsyncStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      AsyncStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeBookmarkByRef = useCallback((bookSlug: string, chapterSlug: string) => {
    setBookmarks((prev) => {
      const next = prev.filter(
        (b) => !(b.bookSlug === bookSlug && b.chapterSlug === chapterSlug)
      );
      AsyncStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (bookSlug: string, chapterSlug: string) =>
      bookmarks.some((b) => b.bookSlug === bookSlug && b.chapterSlug === chapterSlug),
    [bookmarks]
  );

  const recordReading = useCallback((item: Omit<ReadingProgress, "readAt">) => {
    setRecentlyRead((prev) => {
      const filtered = prev.filter(
        (r) => !(r.bookSlug === item.bookSlug && r.chapterSlug === item.chapterSlug)
      );
      const next = [{ ...item, readAt: Date.now() }, ...filtered].slice(0, 20);
      AsyncStorage.setItem(STORAGE_KEYS.recentlyRead, JSON.stringify(next));
      return next;
    });
  }, []);

  const setFontSize = useCallback((size: number) => {
    setFontSizeState(size);
    AsyncStorage.setItem(STORAGE_KEYS.fontSize, String(size));
  }, []);

  const toggleDarkReaderMode = useCallback(() => {
    setDarkReaderMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEYS.darkReaderMode, String(next));
      return next;
    });
  }, []);

  return (
    <BibleContext.Provider
      value={{
        bookmarks,
        recentlyRead,
        fontSize,
        darkReaderMode,
        addBookmark,
        removeBookmark,
        removeBookmarkByRef,
        isBookmarked,
        recordReading,
        setFontSize,
        toggleDarkReaderMode,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  const ctx = useContext(BibleContext);
  if (!ctx) throw new Error("useBible must be used within BibleProvider");
  return ctx;
}
