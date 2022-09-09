/** input arguments */
interface InputParams {
  centimeters: number;
  kilograms: number;
}

/** make sure the type of arguments are all number */
const parseArguments = (args: Array<string>): InputParams => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      centimeters: Number(args[2]),
      kilograms: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (
  centimeters: number,
  kilograms: number
): string => {
  /** BMI = kilograms / pow(meter, 2) */
  const meter = centimeters / 100;
  const bmi = kilograms / Math.pow(meter, 2);

  if (bmi < 16) return 'Underweight (Severe thinness)';
  if (bmi >= 16 && bmi < 17) return 'Underweight (Moderate thinness)';
  if (bmi >= 17 && bmi < 18.5) return 'Underweight (Mild thinness)';
  if (bmi >= 18.5 && bmi < 25) return 'Normal (healthy weight)';
  if (bmi >= 25 && bmi < 30) return 'Overweight (Pre-obese)';
  if (bmi >= 30 && bmi < 35) return 'Obese (Class I)';
  if (bmi >= 35 && bmi < 40) return 'Obese (Class II)';
  if (bmi >= 40) return 'Obese (Class III)';

  return '';
};

try {
  const { centimeters, kilograms } = parseArguments(process.argv);
  const message = calculateBmi(centimeters, kilograms);

  console.log(message);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }

  console.error(errorMessage);
}

// interface Base {
//   a: string;
//   b: string;
// }

// interface BasePlusC extends Base {
//   c: string;
// }

// interface BasePlusD extends Base {
//   d: string;
// }

// type BasePlusCD = BasePlusC | BasePlusD;

// type BasePlusCDMinusA = Omit<BasePlusCD, 'a'>

// const base: Base = {
//   a: '123',
//   b: '456',
// };

// const baseCD: BasePlusCD = {
//   a: '123',
//   b: '456',
//   c: '789',
//   d: '102',
// };

// const baseCDminusA: BasePlusCDMinusA = {
//   b: '456',
//   c: '789', //error
//   d: '102', //error
// }

// console.log('base', base);
// console.log('baseCD', baseCD);
