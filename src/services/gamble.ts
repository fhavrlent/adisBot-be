import { Service, Inject } from 'typedi';

import { User } from '../models/user';

@Service()
export default class GambleService {
  public async GambleSlots(user: User, token: string) {
    const slot1 = Math.floor(Math.random() * (5 - 1 + 1));
    const slot2 = Math.floor(Math.random() * (5 - 1 + 1));
    const slot3 = Math.floor(Math.random() * (5 - 1 + 1));

    return {
      slots: [slots[slot1], slots[slot2], slots[slot3]],
      win: [slot1, slot2, slot3].filter((slot) => slot === slot1).length === 3,
    };
  }
}

const slots = ['Kappa', '4Head', 'PogChamp', 'DansGame', 'BibleThump'];
