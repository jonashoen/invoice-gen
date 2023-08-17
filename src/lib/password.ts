import bcrypt from "bcrypt";

const calculateSaltRounds = (minimumHashTime: number) => {
  let rounds = bcrypt.getRounds(bcrypt.genSaltSync()) - 1;
  let timeDiff = -Infinity;

  while (timeDiff < minimumHashTime) {
    const startTime = new Date().valueOf();

    bcrypt.hashSync("", rounds++);

    const endTime = new Date().valueOf();

    timeDiff = endTime - startTime;
  }

  return rounds;
};

const saltRounds = calculateSaltRounds(250);

const compare = (plain: string, hash: string) => {
  return bcrypt.compareSync(plain, hash);
};

const hash = (plain: string) => {
  return bcrypt.hashSync(plain, saltRounds);
};

export default { compare, hash };
