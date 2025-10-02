//helper

/**
 * Add +1 ms to the last createdAt date
 * to avoid duplicates caused by "createdAt >= created" filter in the backend.
 *
 * @param lastCreatedAt - ISO string or Date of the last item
 * @returns Date to use as the new cursor
 */
export function nextCreatedCursor(lastCreatedAt: string | Date | null): Date {
  if (!lastCreatedAt) {
    // Default: go back to the beginning of time
    return new Date(1970, 1, 1);
  }

  const date =
    typeof lastCreatedAt === "string"
      ? new Date(lastCreatedAt)
      : lastCreatedAt;

  // Add +1 millisecond to avoid fetching the same record again
  return new Date(date.getTime() + 1);
}

/**
 * Reset the cursor.
 * Useful when changing items per page
 * or applying new filters.
 */
export function resetCursor(): Date {
  return new Date(1970, 1, 1);
}

