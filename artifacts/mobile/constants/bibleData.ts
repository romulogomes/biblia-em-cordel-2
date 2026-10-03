export interface Book {
  id: string;
  slug: string;
  name: string;
  abbreviation: string;
}

export const BOOKS: Book[] = [
  { id: "intro", slug: "intro", name: "Introdução", abbreviation: "Intro" },
  { id: "genesis", slug: "genesis", name: "Gênesis", abbreviation: "Gn" },
  { id: "exodo", slug: "exodo", name: "Êxodo", abbreviation: "Êx" },
  { id: "levitico", slug: "levitico", name: "Levítico", abbreviation: "Lv" },
  { id: "numeros", slug: "numeros", name: "Números", abbreviation: "Nm" },
  { id: "deuteronomio", slug: "deuteronomio", name: "Deuteronômio", abbreviation: "Dt" },
  { id: "josue", slug: "josue", name: "Josué", abbreviation: "Js" },
  { id: "juizes", slug: "juizes", name: "Juízes", abbreviation: "Jz" },
  { id: "rute", slug: "rute", name: "Rute", abbreviation: "Rt" },
  { id: "i-samuel", slug: "i-samuel", name: "I Samuel", abbreviation: "1Sm" },
  { id: "ii-samuel", slug: "ii-samuel", name: "II Samuel", abbreviation: "2Sm" },
  { id: "i-reis", slug: "i-reis", name: "I Reis", abbreviation: "1Rs" },
  { id: "ii-reis", slug: "ii-reis", name: "II Reis", abbreviation: "2Rs" },
  { id: "i-cronicas", slug: "i-cronicas", name: "I Crônicas", abbreviation: "1Cr" },
  { id: "ii-cronicas", slug: "ii-cronicas", name: "II Crônicas", abbreviation: "2Cr" },
  { id: "esdras", slug: "esdras", name: "Esdras", abbreviation: "Ed" },
  { id: "neemias", slug: "neemias", name: "Neemias", abbreviation: "Ne" },
  { id: "ester", slug: "ester", name: "Ester", abbreviation: "Et" },
  { id: "jo", slug: "jo", name: "Jó", abbreviation: "Jó" },
  { id: "salmos", slug: "salmos", name: "Salmos", abbreviation: "Sl" },
  { id: "proverbios", slug: "proverbios", name: "Provérbios", abbreviation: "Pv" },
  { id: "eclesiastes", slug: "eclesiastes", name: "Eclesiastes", abbreviation: "Ec" },
  { id: "canticos", slug: "canticos", name: "Cânticos", abbreviation: "Ct" },
  { id: "isaias", slug: "isaias", name: "Isaías", abbreviation: "Is" },
  { id: "jeremias", slug: "jeremias", name: "Jeremias", abbreviation: "Jr" },
  { id: "lamentacoes", slug: "lamentacoes", name: "Lamentações", abbreviation: "Lm" },
  { id: "ezequiel", slug: "ezequiel", name: "Ezequiel", abbreviation: "Ez" },
  { id: "daniel", slug: "daniel", name: "Daniel", abbreviation: "Dn" },
  { id: "oseias", slug: "oseias", name: "Oséias", abbreviation: "Os" },
  { id: "joel", slug: "joel", name: "Joel", abbreviation: "Jl" },
  { id: "amos", slug: "amos", name: "Amós", abbreviation: "Am" },
  { id: "obadias", slug: "obadias", name: "Obadias", abbreviation: "Ob" },
  { id: "jonas", slug: "jonas", name: "Jonas", abbreviation: "Jn" },
  { id: "miqueias", slug: "miqueias", name: "Miquéias", abbreviation: "Mq" },
  { id: "naum", slug: "naum", name: "Naum", abbreviation: "Na" },
  { id: "habacuque", slug: "habacuque", name: "Habacuque", abbreviation: "Hc" },
  { id: "sofonias", slug: "sofonias", name: "Sofonias", abbreviation: "Sf" },
  { id: "ageu", slug: "ageu", name: "Ageu", abbreviation: "Ag" },
  { id: "zacarias", slug: "zacarias", name: "Zacarias", abbreviation: "Zc" },
  { id: "malaquias", slug: "malaquias", name: "Malaquias", abbreviation: "Ml" },
];

export function getBookBySlug(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
