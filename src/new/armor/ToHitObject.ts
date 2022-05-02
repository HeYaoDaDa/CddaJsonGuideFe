export interface ToHitInterface {
  grip: string;
  length: string;
  surface: string;
  balance: string;
}

export enum ToHitGrip {
  bad = 0,
  none = 1,
  solid = 2,
  weapon = 3,
  last = 4,
}

function stringToGrip(value: string) {
  switch (value) {
    case 'bad':
      return 0;
    case 'none':
      return 1;
    case 'solid':
      return 2;
    case 'weapon':
      return 3;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

export enum ToHitLength {
  hand = 0,
  short = 1,
  long = 2,
  last = 3,
}

function stringToLength(value: string) {
  switch (value) {
    case 'hand':
      return 0;
    case 'short':
      return 1;
    case 'long':
      return 2;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

export enum ToHitSurface {
  point = 0,
  line = 1,
  any = 2,
  every = 3,
  last = 4,
}

function stringToSurface(value: string) {
  switch (value) {
    case 'point':
      return 0;
    case 'line':
      return 1;
    case 'any':
      return 2;
    case 'every':
      return 3;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

export enum ToHitBalance {
  clumsy = 0,
  uneven = 1,
  neutral = 2,
  good = 3,
  last = 4,
}

function stringToBalance(value: string) {
  switch (value) {
    case 'clumsy':
      return 0;
    case 'uneven':
      return 1;
    case 'neutral':
      return 2;
    case 'good':
      return 3;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

export function numToHitObject(value: ToHitInterface) {
  return (
    stringToBalance(value.balance) +
    stringToGrip(value.grip) +
    stringToLength(value.length) +
    stringToSurface(value.surface) -
    7
  );
}
