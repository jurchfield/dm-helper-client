/* eslint-disable no-bitwise */

function _guidGenerator() {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (`${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
}

function _roll(die, mod) {
  return Math.round(Math.random() * (die - 1) + 1 + mod);
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
  constructor(config) {
    Object.assign(this, { ...config, id: _guidGenerator() });
  }

  rollInitiative() {
    this.participants = this.participants.map(p => ({
      ...p,
      initiative_roll: _roll(20, p.dexterity_modifier),
    }));
  }
}
