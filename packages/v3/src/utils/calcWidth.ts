interface Parse<T> {
  (time: T): number;
}

interface Diff<T> {
  (start: T, end: T, parser?: Parse<T>): number;
}

interface Encoder<T> {
  (time: number): T;
}

interface GetBeginPosition<T> {
  (time: T, scale: Scale, parser?: Parse<T>, encoder?: Encoder<T>): T;
}

interface GetEndPosition<T> {
  (time: T, scale: Scale, parser?: Parse<T>, encoder?: Encoder<T>): T;
}

type Scale = number;

type Time = string | Date;

const OneSecond = 1000;
const OneMinute = OneSecond * 60;
const OneHour = OneMinute * 60;

const nativeTimeParser: Parse<Time> = (time: Time): number => {
  if (typeof time === "string") {
    return new Date(time).getTime();
  } else {
    return time.getTime();
  }
};

const nativeTimeEncoder: Encoder<Date> = (time: number): Date => {
  return new Date(time);
};

const diffTime: Diff<Time> = (
  start: Time,
  end: Time,
  parser: Parse<Time> = nativeTimeParser
): number => {
  const diff = parser(end) - parser(start);
  return diff;
};

function isAvailableScale(scale: Scale): boolean {
  if (scale <= 0) return false;
  const milliSecondsInDay = 24 * 60 * 60 * OneSecond;
  return milliSecondsInDay % scale == 0;
}

const getBeginTimeOfTimeLine: GetBeginPosition<Date> = (
  time: Date,
  scale: Scale,
  parser: Parse<Date> = nativeTimeParser,
  encoder: Encoder<Date> = nativeTimeEncoder
): Date => {
  if (!isAvailableScale(scale)) {
    throw new RangeError("invalid scale");
  }

  let temp = parser(time);

  let newDate = new Date(temp);
  let count;

  // for milliSeconds
  if (scale < OneSecond) {
    count = Math.floor(newDate.getMilliseconds() / scale);
    newDate.setMilliseconds(count * scale);
  }

  // for seconds
  if (scale < 60 * OneSecond && scale >= OneSecond) {
    const scaleToSecond = scale / OneSecond;
    newDate.setMilliseconds(0);
    count = Math.floor(newDate.getSeconds() / scaleToSecond);
    newDate.setSeconds(count * scaleToSecond);
  }

  // for minutes
  if (scale < OneHour && scale >= OneMinute) {
    const scaleToMinute = scale / OneMinute;
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    count = Math.floor(newDate.getMinutes() / scaleToMinute);
    newDate.setMinutes(count * scaleToMinute);
  }

  // for hours
  if (scale <= 24 * OneHour && scale >= OneHour) {
    const scaleToHour = scale / OneHour;
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    count = Math.floor(newDate.getHours() / scaleToHour);
    newDate.setHours(count * scaleToHour);
  }

  return encoder(newDate.getTime());
};

const getEndTimeOfTimeLine: GetEndPosition<Date> = (
  time: Date,
  scale: Scale,
  parser: Parse<Date> = nativeTimeParser,
  encoder: Encoder<Date> = nativeTimeEncoder
): Date => {
  let result = getBeginTimeOfTimeLine(time, scale, parser, encoder);
  return encoder(result.valueOf() + scale);
};

export {
  diffTime,
  isAvailableScale,
  getBeginTimeOfTimeLine,
  getEndTimeOfTimeLine,
  OneSecond,
  OneMinute,
  OneHour,
};
