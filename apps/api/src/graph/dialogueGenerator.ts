// ============================================
// Natural Dialogue Generator with Personality
// ============================================

import {
  ConversationNode,
  Persona,
  EmotionType,
  DialogueVariation,
} from "@conversation-trainer/types";

interface DialogueConfig {
  includeFillers: boolean;
  includeEmpathy: boolean;
  includeValidation: boolean;
  suggestNextSteps: boolean;
}

export class DialogueGenerator {
  private personas: Map<string, Persona>;

  constructor(personas: Persona[]) {
    this.personas = new Map(personas.map((p) => [p.id, p]));
  }

  private getPersona(personaId: string): Persona | undefined {
    return this.personas.get(personaId);
  }

  private getFillerWords(tone: string): string[] {
    const fillers: Record<string, string[]> = {
      formal: ["Indeed", "Certainly", "I see", "Understood", "Noted"],
      casual: ["Hey", "So", "Well", "Alright", "Got it"],
      friendly: ["Great", "Wonderful", "Thanks", "Perfect", "Awesome"],
      assertive: [
        "Look",
        "Here's the thing",
        "Let me be clear",
        "The fact is",
        "Simply put",
      ],
      empathetic: [
        "I understand",
        "I hear you",
        "That makes sense",
        "I can imagine",
        "That must be",
      ],
    };
    return fillers[tone] ?? fillers.formal;
  }

  private getEmpatheticPhrases(emotion: EmotionType): string[] {
    const phrases: Record<EmotionType, string[]> = {
      neutral: ["I understand.", "Thanks for sharing.", "I see."],
      happy: ["That's wonderful to hear!", "I'm so glad!", "Fantastic!"],
      concerned: [
        "I understand your concern.",
        "That's a valid point.",
        "Let me address that.",
      ],
      frustrated: [
        "I completely understand your frustration.",
        "I'm sorry this happened.",
        "Let me make this right.",
      ],
      empathetic: [
        "I'm here to help.",
        "You're not alone in this.",
        "We'll work through this together.",
      ],
      confident: [
        "I've got this covered.",
        "Consider it done.",
        "I'll take care of it.",
      ],
      uncertain: [
        "Let me look into that.",
        "I'll find out for you.",
        "Give me a moment to check.",
      ],
      grateful: ["You're very welcome!", "My pleasure!", "Happy to help!"],
      disappointed: [
        "I understand your disappointment.",
        "Let me see what I can do.",
        "I'll do my best to help.",
      ],
      hopeful: [
        "There's definitely potential here.",
        "I'm optimistic we can resolve this.",
        "Let's explore the possibilities.",
      ],
    };
    return phrases[emotion] ?? phrases.neutral;
  }

  private selectVariation(node: ConversationNode, context?: any): string {
    if (!node.dialogueVariations || node.dialogueVariations.length === 0) {
      return typeof node.content === "string"
        ? node.content
        : Array.isArray(node.content)
          ? node.content
              .map((b) => (typeof b === "string" ? b : b.value))
              .join(" ")
          : "";
    }

    // Weighted random selection
    const totalWeight = node.dialogueVariations.reduce(
      (sum, v) => sum + (v.weight ?? 1),
      0,
    );
    let random = Math.random() * totalWeight;

    for (const variation of node.dialogueVariations) {
      if (random < (variation.weight ?? 1)) {
        if (
          variation.conditions &&
          !this.checkConditions(variation.conditions, context)
        ) {
          random -= variation.weight ?? 1;
          continue;
        }
        return variation.text;
      }
      random -= variation.weight ?? 1;
    }

    return node.dialogueVariations[0].text;
  }

  private checkConditions(
    conditions: Record<string, any>,
    context: any,
  ): boolean {
    if (!context) return false;
    return Object.entries(conditions).every(
      ([key, value]) => context[key] === value,
    );
  }

  generateResponse(
    node: ConversationNode,
    context?: any,
    config: DialogueConfig = {
      includeFillers: true,
      includeEmpathy: true,
      includeValidation: true,
      suggestNextSteps: true,
    },
  ): { text: string; emotion?: EmotionType } {
    const persona = this.getPersona(node.personaId);
    const baseText = this.selectVariation(node, context);
    const emotion = node.metadata?.emotion ?? "neutral";
    const tone = persona?.personality.tone ?? "formal";

    let responseParts: string[] = [];

    // Add empathetic opening if appropriate
    if (config.includeEmpathy && emotion !== "neutral") {
      const empatheticPhrases = this.getEmpatheticPhrases(emotion);
      const selectedPhrase =
        empatheticPhrases[Math.floor(Math.random() * empatheticPhrases.length)];
      responseParts.push(selectedPhrase);
    }

    // Add main content
    responseParts.push(baseText);

    // Add validation or next steps based on emotion
    if (config.includeValidation && emotion === "frustrated") {
      responseParts.push(
        "Let me document this and ensure we address it properly.",
      );
    }

    if (config.suggestNextSteps && emotion !== "neutral") {
      responseParts.push("What would you like to do next?");
    }

    const finalText = responseParts.join(" ");
    return {
      text: finalText,
      emotion,
    };
  }

  generateQuickReplies(
    options: Array<{ id: string; label: string; emotion?: EmotionType }>,
  ): string[] {
    return options.map((opt) => opt.label);
  }

  addTypingDelay(persona: Persona | undefined): number {
    const baseDelay = 800;
    const styleMultiplier: Record<string, number> = {
      direct: 0.8,
      diplomatic: 1.2,
      detailed: 1.5,
      brief: 0.6,
    };

    const style = persona?.personality.communicationStyle ?? "direct";
    return baseDelay * (styleMultiplier[style] ?? 1);
  }

  generateFollowUp(question: string, context?: any): string {
    const followUps = [
      `To clarify, ${question.toLowerCase()}`,
      `Could you tell me more about ${question.toLowerCase().replace("?", "")}?`,
      `I'd like to understand better - ${question}`,
      `Help me understand - ${question.toLowerCase()}`,
      `When you mention ${question.toLowerCase().replace("?", "")}, what specifically comes to mind?`,
    ];

    return followUps[Math.floor(Math.random() * followUps.length)];
  }

  personalizeResponse(text: string, persona: Persona | undefined): string {
    if (!persona) return text;

    const personalizations: Record<string, (t: string) => string> = {
      formal: (t) =>
        t
          .replace(/\bI'm\b/g, "I am")
          .replace(/\bcan't\b/g, "cannot")
          .replace(/\bwon't\b/g, "will not"),
      casual: (t) => t,
      friendly: (t) => {
        const friendlyStarters = [
          "Great!",
          "Thanks for that!",
          "Perfect!",
          "Wonderful!",
        ];
        return `${friendlyStarters[Math.floor(Math.random() * friendlyStarters.length)]} ${t}`;
      },
      assertive: (t) => {
        const assertiveStarters = [
          "Here's what we'll do:",
          "Let's be clear:",
          "The solution is:",
        ];
        return `${assertiveStarters[Math.floor(Math.random() * assertiveStarters.length)]} ${t}`;
      },
      empathetic: (t) => {
        const empatheticStarters = [
          "I understand how you feel.",
          "I hear you.",
          "That makes complete sense.",
        ];
        return `${empatheticStarters[Math.floor(Math.random() * empatheticStarters.length)]} ${t}`;
      },
    };

    return personalizations[persona.personality.tone]?.(text) ?? text;
  }
}
