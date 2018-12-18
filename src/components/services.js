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

  static get classes() {
    return new Fetcher('classes');
  }

  static get subclasses() {
    return new Fetcher('subclasses');
  }

  static get equipment() {
    return new Fetcher('equipment');
  }

  static get features() {
    return new Fetcher('features');
  }

  static get levels() {
    return new Fetcher('levels');
  }

  static get proficiencies() {
    return new Fetcher('proficiencies');
  }

  static get races() {
    return new Fetcher('races');
  }

  static get skills() {
    return new Fetcher('skills');
  }

  static get traits() {
    return new Fetcher('traits');
  }
}
