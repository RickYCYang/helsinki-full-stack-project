enum RATING {
  LOW = 1,
  NORMAL = 2,
  GOOD = 3,
}

enum RATING_DESC {
  LOW = 'bad',
  NORMAL = 'not too bad but could be better',
  GOOD = 'nice',
}

interface ExerciseInputParams {
  trainingSet: Array<number>;
  target: number;
}

interface Result {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: RATING;
  ratingDescription: string;
}

/** check the type of argument */
const checkArgument = (args: Array<string>): ExerciseInputParams => {
  if (args.length < 4) throw new Error('Not enough arguments');

  // args[2] is target
  if (isNaN(Number(args[2]))) throw new Error('argument not correct');

  // args after position 2 are daily exercise hours
  const trainingSet: Array<number> = [];
  for (let i = 3; i < args.length; i++) {
    if (isNaN(Number(args[i]))) throw new Error('argument not correct');
    trainingSet.push(Number(args[i]));
  }

  return { target: Number(args[2]), trainingSet };
};

export const calculateExercises = (
  trainingSet: Array<number>,
  target: number
): Result => {
  const periodLength = trainingSet.length;
  const trainingDays = trainingSet.filter((day) => day > 0).length;
  const average =
    trainingSet.reduce((prev, curr) => prev + curr, 0) / periodLength;
  const success = average >= target;
  const { rating, ratingDescription } =
    average >= target
      ? { rating: RATING.GOOD, ratingDescription: RATING_DESC.GOOD }
      : average >= 1
      ? { rating: RATING.NORMAL, ratingDescription: RATING_DESC.NORMAL }
      : { rating: RATING.LOW, ratingDescription: RATING_DESC.LOW };

  return {
    periodLength,
    trainingDays,
    target,
    average,
    success,
    rating,
    ratingDescription,
  };
};

try {
  const { trainingSet, target } = checkArgument(process.argv);
  const result = calculateExercises(trainingSet, target);
  console.log(result);
} catch (error) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }

  console.error(errorMessage);
}
