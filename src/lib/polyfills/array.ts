if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, "fill", {
    value: function (...args: any[]) {
      // Steps 1-2.
      if (this == null) {
        throw new TypeError("this is null or not defined");
      }

      const O = Object(this);

      // Steps 3-5.
      const len = O.length >>> 0;

      // Steps 6-7.
      const start = args[1];
      const relativeStart = start >> 0;

      // Step 8.
      let k =
        relativeStart < 0
          ? Math.max(len + relativeStart, 0)
          : Math.min(relativeStart, len);

      // Steps 9-10.
      const end = args[2];
      const relativeEnd = end === undefined ? len : end >> 0;

      // Step 11.
      const finalValue =
        relativeEnd < 0
          ? Math.max(len + relativeEnd, 0)
          : Math.min(relativeEnd, len);

      // Step 12.
      while (k < finalValue) {
        O[k] = args[0];
        k++;
      }

      // Step 13.
      return O;
    },
  });
}
