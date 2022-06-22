import { assert, expect, test, describe, it } from "vitest";
import {
  diffTime,
  getBeginTimeOfTimeLine,
  getEndTimeOfTimeLine,
  isAvailableScale,
  OneHour,
  OneMinute,
  OneSecond,
} from "./calcWidth";

describe("calcWidth", () => {
  it("diff value of same time shoule be zero", () => {
    const start = "2020-01-01 00:00:00.000";
    const end = "2020-01-01 00:00:00.000";
    const diff = diffTime(start, end);
    expect(diff).toBe(0);
  });

  it("test base diffTime", () => {
    const start = "2020-01-01 00:00:00.000";
    const end = "2020-01-01 00:00:10.000";
    const diff = diffTime(start, end);
    expect(diff).toBe(10 * OneSecond);
  });

  it("test custom diffTime", () => {
    const start = "2020-01-01 00:00:00.000";
    const end = "2020-01-01 00:00:10.000";
    const diff = diffTime(start, end, (time: any) => {
      return 1;
    });
    expect(diff).toBe(0);
  });

  it("test isAvailableScale", () => {
    // negative value should be false
    expect(isAvailableScale(-1)).toBe(false);
    // 0 should be false
    expect(isAvailableScale(0)).toBe(false);
    // 1 millisecond
    expect(isAvailableScale(1)).toBe(true);
    // 1 second
    expect(isAvailableScale(1 * OneSecond)).toBe(true);
    // 7 second
    expect(isAvailableScale(7 * OneSecond)).toBe(false);
    // 1 minute
    expect(isAvailableScale(OneMinute)).toBe(true);
    // 1 hour
    expect(isAvailableScale(OneHour)).toBe(true);
    // 5 hour
    expect(isAvailableScale(5 * OneHour)).toBe(false);
    // 1day
    expect(isAvailableScale(24 * OneHour)).toBe(true);
    // 2day
    expect(isAvailableScale(2 * 24 * OneHour)).toBe(false);
  });

  it("test getBeginTimeOfTimeLine about millisecond", () => {
    const start = new Date("2020-01-01 00:00:00.000");
    const ex1 = getBeginTimeOfTimeLine(start, 1);
    expect(ex1.getTime()).toBe(start.getTime());
    const ex2 = getBeginTimeOfTimeLine(start, 2);
    expect(ex2.getTime()).toBe(start.getTime());
  });

  it("test getBeginTimeOfTimeLine about second", () => {
    const start = new Date("2020-01-01 00:00:10.000");
    const ex1 = getBeginTimeOfTimeLine(start, 1 * OneSecond);
    expect(ex1.getTime()).toBe(start.getTime());
    const ex2 = getBeginTimeOfTimeLine(start, 3 * OneSecond);
    expect(ex2.getTime()).toBe(new Date("2020-01-01 00:00:09.000").getTime());
    const ex3 = getBeginTimeOfTimeLine(start, 6 * OneSecond);
    expect(ex3.getTime()).toBe(new Date("2020-01-01 00:00:06.000").getTime());
  });

  it("test getBeginTimeOfTimeLine about minute", () => {
    const start = new Date("2020-01-01 00:05:10.000");
    const ex1 = getBeginTimeOfTimeLine(start, 1 * OneMinute);
    expect(ex1.getTime()).toBe(new Date("2020-01-01 00:05:00.000").getTime());
    const ex2 = getBeginTimeOfTimeLine(start, 3 * OneMinute);
    expect(ex2.getTime()).toBe(new Date("2020-01-01 00:03:00.000").getTime());
    const ex3 = getBeginTimeOfTimeLine(start, 6 * OneMinute);
    expect(ex3.getTime()).toBe(new Date("2020-01-01 00:00:00.000").getTime());
  });

  it("test getBeginTimeOfTimeLine about hour", () => {
    const start = new Date("2020-01-01 05:05:10.000");
    const ex1 = getBeginTimeOfTimeLine(start, 1 * OneHour);
    expect(ex1.getTime()).toBe(new Date("2020-01-01 05:00:00.000").getTime());
    const ex2 = getBeginTimeOfTimeLine(start, 3 * OneHour);
    expect(ex2.getTime()).toBe(new Date("2020-01-01 03:00:00.000").getTime());
    const ex3 = getBeginTimeOfTimeLine(start, 6 * OneHour);
    expect(ex3.getTime()).toBe(new Date("2020-01-01 00:00:00.000").getTime());
  });

  it("test getBeginTimeOfTimeLine about invalid Scale", () => {
    const start = new Date("2020-01-01 05:05:10.000");
    expect(() => getBeginTimeOfTimeLine(start, 5 * OneHour)).toThrowError(
      RangeError
    );
  });

  it("test getEndTimeOfTimeLine about millisecond", () => {
    const start = new Date("2020-01-01 00:00:00.000");
    const ex1 = getEndTimeOfTimeLine(start, 1);
    expect(ex1.getTime()).toBe(start.getTime() + 1);
    const ex2 = getEndTimeOfTimeLine(start, 2);
    expect(ex2.getTime()).toBe(start.getTime() + 2);
  });

  it("test getEndTimeOfTimeLine about second", () => {
    const start = new Date("2020-01-01 00:00:10.000");
    const ex1 = getEndTimeOfTimeLine(start, 1 * OneSecond);
    expect(ex1.getTime()).toBe(start.getTime() + OneSecond);
    const ex2 = getEndTimeOfTimeLine(start, 3 * OneSecond);
    expect(ex2.getTime()).toBe(new Date("2020-01-01 00:00:12.000").getTime());
    const ex3 = getEndTimeOfTimeLine(
      new Date("2020-01-01 00:00:56.000"),
      6 * OneSecond
    );
    expect(ex3.getTime()).toBe(new Date("2020-01-01 00:01:00.000").getTime());
  });

  it("test getEndTimeOfTimeLine about minute", () => {
    const start = new Date("2020-01-01 00:05:10.000");
    const ex1 = getEndTimeOfTimeLine(start, 1 * OneMinute);
    expect(ex1.getTime()).toBe(new Date("2020-01-01 00:06:00.000").getTime());
    const ex2 = getEndTimeOfTimeLine(start, 3 * OneMinute);
    expect(ex2.getTime()).toBe(new Date("2020-01-01 00:06:00.000").getTime());
    const ex3 = getEndTimeOfTimeLine(
      new Date("2020-01-01 00:55:10.000"),
      6 * OneMinute
    );
    expect(ex3.getTime()).toBe(new Date("2020-01-01 01:00:00.000").getTime());
  });

  it("test getEndTimeOfTimeLine about hour", () => {
    const start = new Date("2020-01-01 05:05:10.000");
    const ex1 = getEndTimeOfTimeLine(start, 1 * OneHour);
    expect(ex1.getTime()).toBe(new Date("2020-01-01 06:00:00.000").getTime());
    const ex2 = getEndTimeOfTimeLine(start, 3 * OneHour);
    expect(ex2.getTime()).toBe(new Date("2020-01-01 06:00:00.000").getTime());
    const ex3 = getEndTimeOfTimeLine(start, 24 * OneHour);
    expect(ex3.getTime()).toBe(new Date("2020-01-02 00:00:00.000").getTime());
  });

  it("test getEndTimeOfTimeLine about invalid Scale", () => {
    const start = new Date("2020-01-01 05:05:10.000");
    expect(() => getEndTimeOfTimeLine(start, 5 * OneHour)).toThrowError(
      RangeError
    );
  });
});

// test("Math.sqrt()", () => {
//   expect(Math.sqrt(4)).toBe(2);
//   expect(Math.sqrt(144)).toBe(12);
//   expect(Math.sqrt(2)).toBe(Math.SQRT2);
// });
