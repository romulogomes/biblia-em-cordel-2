import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getBookBySlug } from "@/constants/bibleData";
import { listChapters } from "@/data/bibleContent";
import { useColors } from "@/hooks/useColors";

interface ChapterItem {
  key: string;
  label: string;
}

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const book = getBookBySlug(id ?? "");
  const chapters: ChapterItem[] = useMemo(() => {
    if (!id) return [];
    return listChapters(id).map((c) => ({ key: c.key, label: c.label }));
  }, [id]);

  const topPad = Platform.OS === "web" ? 12 : insets.top;

  // Special case: single-chapter books (intro, obadias) — go straight to reader
  const isSingleChapter = chapters.length === 1;

  const renderChapter = ({ item }: { item: ChapterItem }) => (
    <Pressable
      style={({ pressed }) => [
        styles.chapterBtn,
        {
          backgroundColor: pressed ? colors.primary : colors.card,
          borderColor: pressed ? colors.primary : colors.border,
          borderRadius: colors.radius,
        },
      ]}
      onPress={() => router.push(`/reader/${id}/${item.key}`)}
      accessibilityLabel={`Capítulo ${item.label}`}
    >
      <Text
        style={[styles.chapterLabel, { color: colors.foreground }]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.muted, borderRadius: 20 }]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={[styles.bookTitle, { color: colors.foreground }]}>
            {book?.name ?? id}
          </Text>
          <Text style={[styles.bookTestament, { color: colors.mutedForeground }]}>
            {chapters.length} {chapters.length === 1 ? "texto" : "textos"}
          </Text>
        </View>
      </View>

      {chapters.length === 0 ? (
        <View style={styles.center}>
          <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
          <Text style={[styles.errorTitle, { color: colors.foreground }]}>
            Conteúdo não disponível
          </Text>
        </View>
      ) : isSingleChapter ? (
        <View style={styles.singleWrap}>
          <Pressable
            style={({ pressed }) => [
              styles.singleBtn,
              {
                backgroundColor: pressed ? colors.secondary : colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
            onPress={() => router.push(`/reader/${id}/${chapters[0].key}`)}
          >
            <Feather name="book-open" size={20} color={colors.primary} />
            <Text style={[styles.singleLabel, { color: colors.foreground }]}>
              Começar a ler
            </Text>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.key}
          renderItem={renderChapter}
          numColumns={4}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.selectLabel, { color: colors.mutedForeground }]}>
              Selecione um texto para ler
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  bookTitle: {
    fontSize: 24,
    fontFamily: "Lora_700Bold",
  },
  bookTestament: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: "Lora_700Bold",
    textAlign: "center",
  },
  grid: {
    padding: 16,
    gap: 10,
  },
  row: {
    gap: 10,
  },
  chapterBtn: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: "24%",
  },
  chapterLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  selectLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
    fontStyle: "italic",
  },
  singleWrap: {
    padding: 20,
  },
  singleBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  singleLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
