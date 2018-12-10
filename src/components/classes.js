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
