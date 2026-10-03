// AUTO-GENERATED. Do not edit by hand.
import intro from './chapters/intro.json';
import genesis from './chapters/genesis.json';
import exodo from './chapters/exodo.json';
import levitico from './chapters/levitico.json';
import numeros from './chapters/numeros.json';
import deuteronomio from './chapters/deuteronomio.json';
import josue from './chapters/josue.json';
import juizes from './chapters/juizes.json';
import rute from './chapters/rute.json';
import i_samuel from './chapters/i-samuel.json';
import ii_samuel from './chapters/ii-samuel.json';
import i_reis from './chapters/i-reis.json';
import ii_reis from './chapters/ii-reis.json';
import i_cronicas from './chapters/i-cronicas.json';
import ii_cronicas from './chapters/ii-cronicas.json';
import esdras from './chapters/esdras.json';
import neemias from './chapters/neemias.json';
import ester from './chapters/ester.json';
import jo from './chapters/jo.json';
import salmos from './chapters/salmos.json';
import proverbios from './chapters/proverbios.json';
import eclesiastes from './chapters/eclesiastes.json';
import canticos from './chapters/canticos.json';
import isaias from './chapters/isaias.json';
import jeremias from './chapters/jeremias.json';
import lamentacoes from './chapters/lamentacoes.json';
import ezequiel from './chapters/ezequiel.json';
import daniel from './chapters/daniel.json';
import oseias from './chapters/oseias.json';
import joel from './chapters/joel.json';
import amos from './chapters/amos.json';
import obadias from './chapters/obadias.json';
import jonas from './chapters/jonas.json';
import miqueias from './chapters/miqueias.json';
import naum from './chapters/naum.json';
import habacuque from './chapters/habacuque.json';
import sofonias from './chapters/sofonias.json';
import ageu from './chapters/ageu.json';
import zacarias from './chapters/zacarias.json';
import malaquias from './chapters/malaquias.json';

export interface ChapterData {
  title: string;
  content: string;
}

export type ChapterMap = Record<string, ChapterData>;

const ALL_CHAPTERS: Record<string, ChapterMap> = {
  'intro': intro as ChapterMap,
  'genesis': genesis as ChapterMap,
  'exodo': exodo as ChapterMap,
  'levitico': levitico as ChapterMap,
  'numeros': numeros as ChapterMap,
  'deuteronomio': deuteronomio as ChapterMap,
  'josue': josue as ChapterMap,
  'juizes': juizes as ChapterMap,
  'rute': rute as ChapterMap,
  'i-samuel': i_samuel as ChapterMap,
  'ii-samuel': ii_samuel as ChapterMap,
  'i-reis': i_reis as ChapterMap,
  'ii-reis': ii_reis as ChapterMap,
  'i-cronicas': i_cronicas as ChapterMap,
  'ii-cronicas': ii_cronicas as ChapterMap,
  'esdras': esdras as ChapterMap,
  'neemias': neemias as ChapterMap,
  'ester': ester as ChapterMap,
  'jo': jo as ChapterMap,
  'salmos': salmos as ChapterMap,
  'proverbios': proverbios as ChapterMap,
  'eclesiastes': eclesiastes as ChapterMap,
  'canticos': canticos as ChapterMap,
  'isaias': isaias as ChapterMap,
  'jeremias': jeremias as ChapterMap,
  'lamentacoes': lamentacoes as ChapterMap,
  'ezequiel': ezequiel as ChapterMap,
  'daniel': daniel as ChapterMap,
  'oseias': oseias as ChapterMap,
  'joel': joel as ChapterMap,
  'amos': amos as ChapterMap,
  'obadias': obadias as ChapterMap,
  'jonas': jonas as ChapterMap,
  'miqueias': miqueias as ChapterMap,
  'naum': naum as ChapterMap,
  'habacuque': habacuque as ChapterMap,
  'sofonias': sofonias as ChapterMap,
  'ageu': ageu as ChapterMap,
  'zacarias': zacarias as ChapterMap,
  'malaquias': malaquias as ChapterMap,
};

function naturalCompare(a: string, b: string): number {
  const re = /^(\d+)(.*)$/;
  const ma = a.match(re);
  const mb = b.match(re);
  if (ma && mb) {
    const na = parseInt(ma[1], 10);
    const nb = parseInt(mb[1], 10);
    if (na !== nb) return na - nb;
    return ma[2].localeCompare(mb[2]);
  }
  return a.localeCompare(b);
}

export function getChapter(bookSlug: string, chapterKey: string): ChapterData | undefined {
  const map = ALL_CHAPTERS[bookSlug];
  if (!map) return undefined;
  return map[chapterKey];
}

export function formatChapterLabel(key: string): string {
  if (key === "introducao") return "Introdução";
  return key.replace(/_to_/g, "-");
}

export function listChapters(bookSlug: string): { key: string; label: string; title: string }[] {
  const map = ALL_CHAPTERS[bookSlug];
  if (!map) return [];
  return Object.keys(map)
    .sort(naturalCompare)
    .map((k) => ({ key: k, label: formatChapterLabel(k), title: map[k].title }));
}
