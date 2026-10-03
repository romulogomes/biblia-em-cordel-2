import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 12 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 80;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        <Text style={[styles.title, { color: colors.foreground }]}>Sobre o Projeto</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroBlock}>
          <View
            style={[
              styles.iconBubble,
              { backgroundColor: colors.primary, borderRadius: 20 },
            ]}
          >
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text
            style={[styles.appName, { color: colors.primary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            Bíblia em Cordel
          </Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            A Palavra em forma de poesia popular nordestina
          </Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            O que é o Cordel?
          </Text>
          <Text style={[styles.paragraph, { color: colors.foreground }]}>
            A literatura de cordel é uma forma de poesia popular originária do Nordeste do Brasil,
            tradicionalmente impressa em folhetos e pendurada em barbantes — daí o nome &quot;cordel&quot;.
            É uma expressão cultural rica que mistura música, narrativa e métrica em versos
            cantados, contando histórias do povo para o povo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Sobre este projeto
          </Text>
          <Text style={[styles.paragraph, { color: colors.foreground }]}>
            Este aplicativo <Text style={styles.bold}>não substitui a leitura da Bíblia</Text> e
            não pretende modificar as Escrituras Sagradas. Trata-se apenas de uma{" "}
            <Text style={styles.bold}>expressão cultural</Text>: uma releitura artística que
            apresenta as histórias bíblicas em forma de cordel, valorizando a tradição literária
            nordestina como ponte para aproximar o leitor da Palavra.
          </Text>
          <Text style={[styles.paragraph, { color: colors.foreground }]}>
            Os versos aqui reunidos são uma homenagem poética — uma maneira de celebrar a fé
            através da cultura popular. Para o estudo e meditação das Escrituras, recomendamos
            sempre o uso de uma Bíblia em sua tradução oficial.
          </Text>
          <Text style={[styles.paragraph, { color: colors.foreground }]}>
            Atualmente, o aplicativo conta com os 40 livros do Antigo Testamento, organizados em
            ordem canônica, com 880 textos em cordel no total — incluindo todos os Salmos e
            uma introdução especial em versos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recursos</Text>
          <Feature icon="book-open" title="Leitura confortável" desc="Ajuste o tamanho da fonte e use o modo noturno" colors={colors} />
          <Feature icon="bookmark" title="Marcadores" desc="Salve seus capítulos favoritos para acessar depois" colors={colors} />
          <Feature icon="wifi-off" title="Funciona offline" desc="Todo o conteúdo está disponível sem internet" colors={colors} />
          <Feature icon="share-2" title="Compartilhe" desc="Envie versos e capítulos para amigos e familiares" colors={colors} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Site oficial</Text>
          <Pressable
            style={({ pressed }) => [
              styles.linkBtn,
              {
                backgroundColor: pressed ? colors.secondary : colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
            onPress={() => Linking.openURL("https://biblia-em-cordel.vercel.app")}
          >
            <Feather name="globe" size={18} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.foreground }]}>
              biblia-em-cordel.vercel.app
            </Text>
            <Feather name="external-link" size={14} color={colors.mutedForeground} />
          </Pressable>
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          Feito com fé e poesia 🌾
        </Text>
      </ScrollView>
    </View>
  );
}

function Feature({
  icon,
  title,
  desc,
  colors,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  desc: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.featureRow}>
      <View
        style={[
          styles.featureIcon,
          { backgroundColor: colors.primary + "18", borderRadius: 10 },
        ]}
      >
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.featureTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.featureDesc, { color: colors.mutedForeground }]}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 26,
    fontFamily: "Lora_700Bold",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  heroBlock: {
    alignItems: "center",
    marginBottom: 32,
    gap: 10,
  },
  iconBubble: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  icon: {
    width: 84,
    height: 84,
  },
  appName: {
    fontSize: 24,
    fontFamily: "Lora_700Bold",
    marginTop: 6,
    letterSpacing: -0.5,
    textAlign: "center",
    alignSelf: "stretch",
    paddingHorizontal: 12,
  },
  bold: {
    fontFamily: "Lora_700Bold",
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Lora_700Bold",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    fontFamily: "Lora_400Regular",
    lineHeight: 24,
    marginBottom: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  featureIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  featureDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    marginTop: 12,
  },
});
