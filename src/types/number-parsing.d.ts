declare module 'number-parsing' {
  export default function parse(input: string | number, affinities?: Record<string, number>): number;
}