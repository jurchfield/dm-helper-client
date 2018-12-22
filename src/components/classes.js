/* eslint-disable no-bitwise */

function _guidGenerator() {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (`${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
}

/**
 * @name roll
 * @param {Number} die - die type
 * @param {Number} amt - amount to roll
 * @param {Number} mod - modifier
 */
export function roll(die, amt, mod) {
  let result = 0;

  for (let i = 0; i < amt; i++) {
    result += Math.round(Math.random() * (die - 1) + 1);
  }
  return (result + mod);
}

export class Player {
  constructor({
    traits,
    actions,
    reactions,
    legendary_actions,
    dexterity,
    constitution,
    strength,
    charisma,
    intelligence,
    wisdom,
    race,
    player_class,
    customRace,
    customClass,
    ...props
  }) {
    Object.assign(this,
      {
        race: race || customRace,
        class: player_class || customClass,
        type: `${race || customRace} ${player_class || customClass}`,
        special_abilities: this._createNameDescArray(traits),
        actions: this._createNameDescArray(actions),
        reactions: this._createNameDescArray(reactions),
        legendary_actions: this._createNameDescArray(legendary_actions),
        dexterity,
        constitution,
        strength,
        charisma,
        intelligence,
        wisdom,
        dexterity_modifier: Math.floor((dexterity - 10) / 2),
        constitution_modifier: Math.floor((constitution - 10) / 2),
        strength_modifier: Math.floor((strength - 10) / 2),
        charisma_modifier: Math.floor((charisma - 10) / 2),
        intelligence_modifier: Math.floor((intelligence - 10) / 2),
        wisdom_modifier: Math.floor((wisdom - 10) / 2),
        ...props,
      });
  }

  _createNameDescArray(arr = []) {
    const chunks = arr.reduce((all, one, i) => {
      const ch = Math.floor(i / 3);
      all[ch] = [].concat((all[ch] || []), one);
      return all;
    }, []);

    return chunks.reduce((pV, [name, other, desc]) => {
      pV.push({
        name: other !== '' ? other : name,
        desc,
      });
      return pV;
    }, []);
  }
}

export class Participant {
  constructor(p) {
    Object.assign(this, { ...p, id: _guidGenerator(), hit_points_max: p.hit_points });
  }

  damage(amt) {
    this.hit_points -= amt;
  }

  heal(amt) {
    if (this.hit_points + amt > this.hit_points_max) {
      this.hit_points = this.hit_points + (amt - ((this.hit_points + amt) - this.hit_points_max));
      return;
    }

    this.hit_points += amt;
  }
}

export class Encounter {
  constructor({ participants }) {
    Object.assign(this, { id: _guidGenerator(), _participants: participants });
  }

  get participants() {
    return this._participants.map(p => new Participant(p));
  }

  set participants(p) {
    this._participants = p;
  }

  rollInitiative() {
    this._participants = this.participants.map(p => ({
      ...p,
      initiative_roll: roll(20, 1, p.dexterity_modifier),
    }));
  }
}

export class User {
  static isLoggedIn() {
    return firebase.auth().currentUser;
  }

  static getAuthToken(success) {
    const user = firebase.auth().currentUser;

    if (!user) return success();

    return user
      .getIdToken(true)
      .then(token => success(token))
      .catch((err) => {
        console.error(err);
        return success();
      });
  }

  static signOut() {
    return firebase
      .auth()
      .signOut();
  }

  static addAuthListener(callback) {
    return firebase.auth().onAuthStateChanged(callback);
  }
}
