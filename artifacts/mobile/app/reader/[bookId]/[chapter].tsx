import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getBookBySlug } from "@/constants/bibleData";
import { useBible } from "@/context/BibleContext";
import { formatChapterLabel, getChapter, listChapters } from "@/data/bibleContent";
import { useColors } from "@/hooks/useColors";

const FONT_SIZES = [14, 16, 18, 20, 23];
const MIN_SIZE = 0;
const MAX_SIZE = FONT_SIZES.length - 1;

export default function ReaderScreen() {
  const { bookId, chapter } = useLocalSearchParams<{ bookId: string; chapter: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addBookmark, removeBookmarkByRef, isBookmarked, recordReading, fontSize, setFontSize, darkReaderMode, toggleDarkReaderMode } = useBible();

  const book = getBookBySlug(bookId ?? "");
  const [content, setContent] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const bookmarked = isBookmarked(bookId ?? "", chapter ?? "");

  const topPad = Platform.OS === "web" ? 12 : insets.top;
  const bottomPad = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 12);

  // Reader uses its own palette, independent from the OS color scheme.
  const readerBg = darkReaderMode ? "#1A1410" : "#FFFDF5";
  const readerText = darkReaderMode ? "#E8D9BE" : "#1A0F0A";
  const readerMuted = darkReaderMode ? "#2A2218" : "#EDE3CC";
  const readerBorder = darkReaderMode ? "#2A2218" : "#D9CDB8";
  const readerSubtle = darkReaderMode ? "#8A7E6A" : "#7A6E5F";
  const readerAccent = darkReaderMode ? "#C17D3C" : "#8B3A2A";

  const currentFontIndex = FONT_SIZES.indexOf(fontSize) !== -1 ? FONT_SIZES.indexOf(fontSize) : 2;

  const allChapters = bookId ? listChapters(bookId) : [];
  const currentChapterIdx = allChapters.findIndex((c) => c.key === chapter);
  const prevChapter = currentChapterIdx > 0 ? allChapters[currentChapterIdx - 1] : null;
  const nextChapter =
    currentChapterIdx >= 0 && currentChapterIdx < allChapters.length - 1
      ? allChapters[currentChapterIdx + 1]
      : null;

  const goToChapter = (key: string) => {
    Haptics.selectionAsync();
    router.replace(`/reader/${bookId}/${key}`);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const loadContent = useCallback(() => {
    if (!bookId || !chapter) return;
    setLoading(true);
    setError(false);
    try {
      const data = getChapter(bookId, chapter);
      if (!data) {
        setError(true);
      } else {
        setContent(data.content);
        setChapterTitle(data.title);
        recordReading({
          bookSlug: bookId,
          chapterSlug: chapter,
          bookName: book?.name ?? bookId,
        });
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [bookId, chapter, book, recordReading]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (bookmarked) {
      removeBookmarkByRef(bookId ?? "", chapter ?? "");
    } else {
      addBookmark({
        bookSlug: bookId ?? "",
        bookName: book?.name ?? bookId ?? "",
        chapterSlug: chapter ?? "",
      });
    }
  };

  const handleShare = async () => {
    try {
      const header = `${book?.name ?? bookId}${chapterTitle ? ` — ${chapterTitle}` : ""}`;
      await Share.share({
        message: `${header}\n\n${content}\n\n— Bíblia em Cordel`,
      });
    } catch {
      // ignore
    }
  };

  const decreaseFontSize = () => {
    if (currentFontIndex > MIN_SIZE) {
      setFontSize(FONT_SIZES[currentFontIndex - 1]);
    }
  };

  const increaseFontSize = () => {
    if (currentFontIndex < MAX_SIZE) {
      setFontSize(FONT_SIZES[currentFontIndex + 1]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: readerBg }]}>
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: topPad + 8,
            backgroundColor: readerBg,
            borderBottomColor: readerBorder,
          },
        ]}
      >
        <Pressable
          style={[styles.iconBtn, { backgroundColor: readerMuted, borderRadius: 20 }]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={20} color={readerText} />
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={[styles.bookTitleSmall, { color: readerText }]} numberOfLines={1}>
            {book?.name ?? bookId}
          </Text>
          <Text style={[styles.chapterSmall, { color: readerSubtle }]}>
            {chapter === "introducao" ? "Introdução" : `Capítulo ${formatChapterLabel(chapter ?? "")}`}
          </Text>
        </View>

        <View style={styles.topActions}>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: readerMuted, borderRadius: 20 }]}
            onPress={toggleDarkReaderMode}
            hitSlop={8}
          >
            <Feather name={darkReaderMode ? "sun" : "moon"} size={18} color={readerText} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: readerMuted, borderRadius: 20 }]}
            onPress={handleBookmark}
            hitSlop={8}
          >
            <Feather
              name="bookmark"
              size={18}
              color={bookmarked ? readerAccent : readerText}
              style={bookmarked ? { opacity: 1 } : { opacity: 0.7 }}
            />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: readerMuted, borderRadius: 20 }]}
            onPress={handleShare}
            hitSlop={8}
          >
            <Feather name="share" size={18} color={readerText} />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={readerAccent} />
          <Text style={[styles.loadingText, { color: readerSubtle }]}>
            Carregando...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Feather name="wifi-off" size={40} color={readerSubtle} />
          <Text style={[styles.errorTitle, { color: readerText }]}>Erro ao carregar</Text>
          <Text style={[styles.errorText, { color: readerSubtle }]}>
            Verifique sua conexão e tente novamente.
          </Text>
          <Pressable
            style={[styles.retryBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
            onPress={loadContent}
          >
            <Text style={[styles.retryLabel, { color: colors.primaryForeground }]}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
          showsVerticalScrollIndicator={true}
        >
            <Text style={[styles.chapterTitle, { color: readerText }]}>
              {book?.name ?? bookId}
            </Text>
            <Text style={[styles.chapterSubtitle, { color: readerSubtle }]}>
              {chapter === "introducao" ? "Introdução" : `Capítulo ${formatChapterLabel(chapter ?? "")}`}
              {chapterTitle ? ` — ${chapterTitle}` : ""}
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: readerBorder },
              ]}
            />
            <Text
              style={[
                styles.bodyText,
                {
                  color: readerText,
                  fontSize,
                  lineHeight: fontSize * 1.75,
                  fontFamily: "Lora_400Regular",
                },
              ]}
            >
              {content}
            </Text>
        </ScrollView>
      )}

      {/* Bottom Controls */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: bottomPad,
            backgroundColor: readerBg,
            borderTopColor: readerBorder,
          },
        ]}
      >
        <View style={styles.controlsRow}>
          {/* Prev chapter */}
          <Pressable
            style={[
              styles.navBtn,
              {
                backgroundColor: readerMuted,
                borderRadius: colors.radius,
                opacity: prevChapter ? 1 : 0.35,
              },
            ]}
            onPress={() => prevChapter && goToChapter(prevChapter.key)}
            disabled={!prevChapter}
            hitSlop={6}
          >
            <Feather name="chevron-left" size={20} color={readerText} />
            <Text style={[styles.navBtnLabel, { color: readerText }]} numberOfLines={1}>
              {prevChapter ? prevChapter.label : "—"}
            </Text>
          </Pressable>

          {/* Font controls (centered) */}
          <View style={styles.fontControls}>
            <Pressable
              style={[
                styles.fontBtn,
                {
                  backgroundColor: readerMuted,
                  borderRadius: colors.radius,
                  opacity: currentFontIndex <= MIN_SIZE ? 0.4 : 1,
                },
              ]}
              onPress={decreaseFontSize}
              disabled={currentFontIndex <= MIN_SIZE}
            >
              <Text style={[styles.fontBtnLabel, { color: readerText, fontSize: 13 }]}>A−</Text>
            </Pressable>
            <Pressable
              style={[
                styles.fontBtn,
                {
                  backgroundColor: readerMuted,
                  borderRadius: colors.radius,
                  opacity: currentFontIndex >= MAX_SIZE ? 0.4 : 1,
                },
              ]}
              onPress={increaseFontSize}
              disabled={currentFontIndex >= MAX_SIZE}
            >
              <Text style={[styles.fontBtnLabel, { color: readerText, fontSize: 17 }]}>A+</Text>
            </Pressable>
          </View>

          {/* Next chapter */}
          <Pressable
            style={[
              styles.navBtn,
              {
                backgroundColor: readerMuted,
                borderRadius: colors.radius,
                opacity: nextChapter ? 1 : 0.35,
                justifyContent: "flex-end",
              },
            ]}
            onPress={() => nextChapter && goToChapter(nextChapter.key)}
            disabled={!nextChapter}
            hitSlop={6}
          >
            <Text style={[styles.navBtnLabel, { color: readerText, textAlign: "right" }]} numberOfLines={1}>
              {nextChapter ? nextChapter.label : "—"}
            </Text>
            <Feather name="chevron-right" size={20} color={readerText} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: { flex: 1 },
  bookTitleSmall: {
    fontSize: 16,
    fontFamily: "Lora_700Bold",
  },
  chapterSmall: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: "Lora_700Bold",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  chapterTitle: {
    fontSize: 28,
    fontFamily: "Lora_700Bold",
    letterSpacing: -0.5,
  },
  chapterSubtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    marginVertical: 20,
    opacity: 0.6,
  },
  bodyText: {
    letterSpacing: 0.2,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 2,
    maxWidth: "30%",
  },
  navBtnLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    flexShrink: 1,
  },
  fontControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fontBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: "center",
  },
  fontBtnLabel: {
    fontFamily: "Inter_700Bold",
  },
});
