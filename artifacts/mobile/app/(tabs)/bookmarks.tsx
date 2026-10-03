import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Bookmark, useBible } from "@/context/BibleContext";
import { formatChapterLabel } from "@/data/bibleContent";
import { useColors } from "@/hooks/useColors";

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function chapterLabel(slug: string): string {
  if (slug === "introducao") return "Introdução";
  return `Capítulo ${formatChapterLabel(slug)}`;
}

export default function BookmarksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { bookmarks, recentlyRead, removeBookmark } = useBible();

  const topPad = Platform.OS === "web" ? 12 : insets.top;
  const bottomPad = 0;

  const handleRemove = (id: string) => {
    Alert.alert("Remover marcador", "Deseja remover este marcador?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          removeBookmark(id);
        },
      },
    ]);
  };

  const renderBookmark = ({ item }: { item: Bookmark }) => (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: pressed ? colors.secondary : colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
      onPress={() => router.push(`/reader/${item.bookSlug}/${item.chapterSlug}`)}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.primary + "15", borderRadius: colors.radius - 2 }]}>
        <Feather name="bookmark" size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.bookName, { color: colors.foreground }]}>{item.bookName}</Text>
        <Text style={[styles.chapterLabel, { color: colors.mutedForeground }]}>
          {chapterLabel(item.chapterSlug)} · {formatDate(item.savedAt)}
        </Text>
      </View>
      <Pressable
        hitSlop={12}
        onPress={() => handleRemove(item.id)}
        style={styles.removeBtn}
      >
        <Feather name="trash-2" size={16} color={colors.mutedForeground} />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 16,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Marcadores</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {bookmarks.length} {bookmarks.length === 1 ? "capítulo salvo" : "capítulos salvos"}
        </Text>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={renderBookmark}
        contentContainerStyle={[styles.list, { paddingBottom: 100 + bottomPad }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          recentlyRead.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                LIDOS RECENTEMENTE
              </Text>
              {recentlyRead.slice(0, 5).map((item) => (
                <Pressable
                  key={`${item.bookSlug}-${item.chapterSlug}`}
                  style={({ pressed }) => [
                    styles.item,
                    {
                      backgroundColor: pressed ? colors.secondary : colors.card,
                      borderColor: colors.border,
                      borderRadius: colors.radius,
                    },
                  ]}
                  onPress={() => router.push(`/reader/${item.bookSlug}/${item.chapterSlug}`)}
                >
                  <View style={[styles.iconBox, { backgroundColor: colors.accent + "20", borderRadius: colors.radius - 2 }]}>
                    <Feather name="clock" size={18} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bookName, { color: colors.foreground }]}>{item.bookName}</Text>
                    <Text style={[styles.chapterLabel, { color: colors.mutedForeground }]}>
                      {chapterLabel(item.chapterSlug)} · {formatDate(item.readAt)}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              ))}
              {bookmarks.length > 0 && (
                <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 20 }]}>
                  MEUS MARCADORES
                </Text>
              )}
            </View>
          ) : null
        }
        ListEmptyComponent={
          bookmarks.length === 0 && recentlyRead.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="bookmark" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Nenhum marcador ainda
              </Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Ao ler um capítulo, toque no ícone de marcador para salvá-lo aqui.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 26,
    fontFamily: "Lora_700Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  section: {
    paddingTop: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bookName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  chapterLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  removeBtn: { padding: 4 },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Lora_700Bold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
