import Agenda from 'agenda';

import AddPointsToChatter from '../jobs/addJobToChatter';
import AddPointsToAllViewers from '../jobs/addPointsToAllViewers';

export default async ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'add-points',
    { priority: 'low' },
    new AddPointsToAllViewers().handler,
  );

  agenda.define(
    'add point to chatter',
    { priority: 'high' },
    new AddPointsToChatter().handler,
  );

  await agenda.start();
};
