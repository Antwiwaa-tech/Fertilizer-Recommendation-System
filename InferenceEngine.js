async function loadKnowledgeBase() {
  try {
    const response = await fetch("/knowledge_base.json");
    if (!response.ok) {
      throw new Error("Failed to load the knowledge base.");
    }
    const data = await response.json();
    return data; // Return the data when loaded
  } catch (error) {
    console.error("Error loading knowledge base:", error);
    return null;
  }
}

export default async function inferRecommendations(inputs) {
  const knowledgeBase = await loadKnowledgeBase();
  if (!knowledgeBase) {
    return { error: "Knowledge base not loaded." };
  }

  const rules = knowledgeBase?.fertilizerRecommendations?.rules;

  if (!Array.isArray(rules)) {
    return { error: "No rules found in the knowledge base." };
  }

  for (const rule of rules) {
    let match = true;

    for (const key in rule.conditions) {
      if (inputs[key] !== undefined && inputs[key] !== rule.conditions[key]) {
        match = false;
        break;
      }
    }

    if (match) {
      return rule.recommendations;
    }
  }

  return { error: "No matching recommendation found." };
}