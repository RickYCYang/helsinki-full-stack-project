import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi/', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!height || !weight) {
    res.json({ error: 'malformatted parameters' });
    return;
  }

  res.json({
    height,
    weight,
    bmi: calculateBmi(height, weight),
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.json({ error: 'parameters missing' });
    return;
  }

  if (isNaN(Number(target))) {
    res.json({ error: 'malformatted parameters' });
    return;
  }

  const trainingSet: Array<number> = [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  for (let i = 0; i < daily_exercises.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (isNaN(Number(daily_exercises[i]))) {
      res.json({ error: 'malformatted parameters' });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    trainingSet.push(Number(daily_exercises[i]));
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
  const result = calculateExercises(daily_exercises, target);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
