import { Fetcher } from './services-fetcher';

export class Services {
  /** ---- STATIC MEMBERS - RETURN INSTANCE OF FETCHER ---- */

  static get creatures() {
    return new Fetcher('creatures');
  }

  static get spells() {
    return new Fetcher('spells');
  }

  static get weapons() {
    return new Fetcher('weapons');
  }

  static get players() {
    return new Fetcher('players');
  }

  static get encounters() {
    return new Fetcher('encounters');
  }
}
