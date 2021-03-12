if (!Number.isNaN) {
  Number.isNaN = (value: any) => {
    return typeof value === "number" && isNaN(value);
  };
}
