const formatter = new Intl.DateTimeFormat("en-us", {});

export const now = (): { year: string; month: string; day: string } => {
  return formatter.formatToParts(new Date().getTime()).reduce(
    (date, part) => {
      if (part.type !== "literal") {
        return {
          ...date,
          [part.type]: part.value,
        };
      }

      return date;
    },
    { day: "", month: "", year: "" }
  );
};
