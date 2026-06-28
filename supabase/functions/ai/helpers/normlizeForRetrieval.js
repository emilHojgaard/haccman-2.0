export function normalizeForRetrieval(input) {
        return (input ?? "")
          .normalize("NFD")                         // split accents
          .replace(/\p{Diacritic}/gu, "")          // remove accents (Søren -> Soren)
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s]+/gu, " ")      // strip punctuation (quotes, commas, parens…)
          .replace(/\s+/g, " ")                    // collapse whitespace
          .trim();
      }