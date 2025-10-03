//helper

export function nextCreatedCursor(lastCreatedAt: string | Date | null): Date {
  if (!lastCreatedAt) {
    return new Date(1970, 1, 1);
  }

  const date =
    typeof lastCreatedAt === "string"
      ? new Date(lastCreatedAt)
      : lastCreatedAt;

  
  return new Date(date.getTime() + 1);
}

export function resetCursor(): Date {
  return new Date(1970, 1, 1);
}

