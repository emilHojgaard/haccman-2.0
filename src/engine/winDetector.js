import winRules from "../content/winRules.json";

function containsAny(text, terms = []) {
  const lower = text.toLowerCase();
  return terms.some((t) => lower.includes(t.toLowerCase()));
}

export function checkWin(taskId, botResponseText) {
  const rule = winRules[String(taskId)];
  if (!rule) return false;

  switch (rule.type) {
    case "phrase":
      return containsAny(botResponseText, rule.phrases);
    case "keyword-and":
      return containsAny(botResponseText, rule.required) && containsAny(botResponseText, rule.confirm);
    case "phrase-or-keyword":
      return (
        containsAny(botResponseText, rule.phrases) ||
        containsAny(botResponseText, rule.listOfWords) ||
        (containsAny(botResponseText, rule.name) && containsAny(botResponseText, rule.cpr))
      );
    case "narrative-hint":
      // No automatic win condition; resolution is left to player/host judgement.
      return false;
    default:
      return false;
  }
}
