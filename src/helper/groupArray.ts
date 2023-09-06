type ObjectIndexType = string | number | symbol;

type CallbackProps<T> = {
  cb: (item: T) => ObjectIndexType;
  key?: never;
};

type KeyProps<T> = {
  cb?: never;
  key: keyof T;
};

type Props<T> = CallbackProps<T> | KeyProps<T>;

const group = <T>(array: T[], props: Props<T>) => {
  const groups: { [key: ObjectIndexType]: T[] } = {};

  for (const item of array) {
    let group: ObjectIndexType | keyof T;

    if (props.cb) {
      group = props.cb(item);
    } else {
      group = item[props.key] as ObjectIndexType;
    }

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(item);
  }

  return groups;
};

export default group;
