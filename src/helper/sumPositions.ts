import { InvoicePosition } from "@prisma/client";

const sumPositions = (positions: InvoicePosition[]) =>
  positions.reduce(
    (sum, position) => sum + position.amount * position.price,
    0
  );

export default sumPositions;
