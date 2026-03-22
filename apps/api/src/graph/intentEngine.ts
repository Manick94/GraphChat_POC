// ============================================
// Advanced Intent Recognition Engine
// ============================================

import { ConversationEdge, IntentDefinition, EmotionType } from '@conversation-trainer/types';

interface TokenFrequency {
  [token: string]: number;
}

interface IntentMatch {
  intentId: string;
  intentName: string;
  confidence: number;
  category: string;
  matchedExamples: string[];
}

export class IntentEngine {
  private intents: IntentDefinition[];
  private idfCache: Map<string, number> = new Map();

  constructor(intents: IntentDefinition[]) {
    this.intents = intents;
    this.buildIdfCache();
  }

  private buildIdfCache() {
    const documentFrequency = new Map<string, number>();
    const allDocuments: string[][] = [];

    // Build documents from all intent examples
    this.intents.forEach((intent) => {
      intent.examples.forEach((example) => {
        const tokens = this.tokenize(example);
        allDocuments.push(tokens);
        const uniqueTokens = new Set(tokens);
        uniqueTokens.forEach((token) => {
          documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
        });
      });
    });

    const totalDocs = allDocuments.length;
    documentFrequency.forEach((df, token) => {
      this.idfCache.set(token, Math.log((totalDocs + 1) / (df + 1)) + 1);
    });
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 1 && !this.isStopWord(token));
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
      'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
      'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
      'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be',
      'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
      'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by',
      'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
      'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
      'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
      'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'don', 'should',
      'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn',
      'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn',
      'wasn', 'weren', 'won', 'wouldn'
    ]);
    return stopWords.has(word);
  }

  private computeTF(tokens: string[]): TokenFrequency {
    const tf: TokenFrequency = {};
    tokens.forEach((token) => {
      tf[token] = (tf[token] ?? 0) + 1;
    });
    const totalTokens = tokens.length;
    Object.keys(tf).forEach((token) => {
      tf[token] = tf[token] / totalTokens;
    });
    return tf;
  }

  private computeTFIDF(tf: TokenFrequency): TokenFrequency {
    const tfidf: TokenFrequency = {};
    Object.entries(tf).forEach(([token, frequency]) => {
      const idf = this.idfCache.get(token) ?? 1;
      tfidf[token] = frequency * idf;
    });
    return tfidf;
  }

  private cosineSimilarity(vecA: TokenFrequency, vecB: TokenFrequency): number {
    const allTokens = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    allTokens.forEach((token) => {
      const a = vecA[token] ?? 0;
      const b = vecB[token] ?? 0;
      dotProduct += a * b;
      magnitudeA += a * a;
      magnitudeB += b * b;
    });

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  }

  private levenshteinDistance(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, () => 
      Array.from<number>({ length: b.length + 1 }).fill(0)
    );
    
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost);
        }
      }
    }
    return dp[a.length][b.length];
  }

  private jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  }

  detectIntent(input: string): IntentMatch | null {
    const inputTokens = this.tokenize(input);
    const inputTF = this.computeTF(inputTokens);
    const inputTFIDF = this.computeTFIDF(inputTF);
    const inputSet = new Set(inputTokens);

    const matches: IntentMatch[] = [];

    this.intents.forEach((intent) => {
      let maxSimilarity = 0;
      const matchedExamples: string[] = [];

      intent.examples.forEach((example) => {
        const exampleTokens = this.tokenize(example);
        const exampleTF = this.computeTF(exampleTokens);
        const exampleTFIDF = this.computeTFIDF(exampleTF);
        const exampleSet = new Set(exampleTokens);

        // Combine multiple similarity metrics
        const cosineSim = this.cosineSimilarity(inputTFIDF, exampleTFIDF);
        const jaccardSim = this.jaccardSimilarity(inputSet, exampleSet);
        const keywordBoost = this.calculateKeywordBoost(inputTokens, exampleTokens);
        
        // Weighted combination
        const similarity = (cosineSim * 0.5) + (jaccardSim * 0.3) + (keywordBoost * 0.2);

        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
        }
        if (similarity > 0.3) {
          matchedExamples.push(example);
        }
      });

      const threshold = intent.confidenceThreshold ?? 0.5;
      if (maxSimilarity >= threshold * 0.8) { // Allow some flexibility
        matches.push({
          intentId: intent.id,
          intentName: intent.name,
          confidence: Math.min(maxSimilarity, 1.0),
          category: intent.category,
          matchedExamples
        });
      }
    });

    matches.sort((a, b) => b.confidence - a.confidence);
    return matches.length > 0 ? matches[0] : null;
  }

  private calculateKeywordBoost(tokens1: string[], tokens2: string[]): number {
    const criticalKeywords = new Set([
      'angry', 'frustrated', 'upset', 'unhappy', 'disappointed',
      'happy', 'satisfied', 'pleased', 'great', 'excellent',
      'help', 'support', 'issue', 'problem', 'error',
      'buy', 'purchase', 'price', 'cost', 'budget',
      'yes', 'no', 'maybe', 'confirm', 'cancel',
      'urgent', 'asap', 'immediately', 'soon'
    ]);

    const keywords1 = tokens1.filter((t) => criticalKeywords.has(t));
    const keywords2 = tokens2.filter((t) => criticalKeywords.has(t));

    if (keywords1.length === 0 && keywords2.length === 0) return 0;
    if (keywords1.length === 0 || keywords2.length === 0) return 0;

    const overlap = keywords1.filter((k) => keywords2.includes(k)).length;
    return overlap / Math.max(keywords1.length, keywords2.length);
  }

  detectEmotion(input: string): EmotionType {
    const emotionKeywords: Record<EmotionType, string[]> = {
      neutral: ['okay', 'alright', 'fine', 'normal', 'regular'],
      happy: ['happy', 'great', 'excellent', 'wonderful', 'fantastic', 'pleased', 'satisfied', 'love', 'amazing'],
      concerned: ['concerned', 'worried', 'uncertain', 'unsure', 'question', 'doubt'],
      frustrated: ['frustrated', 'angry', 'upset', 'annoyed', 'irritated', 'unhappy', 'disappointed', 'terrible', 'awful'],
      empathetic: ['understand', 'empathize', 'sorry', 'apologize', 'regret'],
      confident: ['confident', 'certain', 'sure', 'definitely', 'absolutely'],
      uncertain: ['maybe', 'perhaps', 'possibly', 'might', 'could', 'unsure'],
      grateful: ['thank', 'grateful', 'appreciate', 'thanks', 'gratitude'],
      disappointed: ['disappointed', 'letdown', 'expected', 'hoped', 'wish'],
      hopeful: ['hope', 'expect', 'look forward', 'anticipate', 'optimistic']
    };

    const lowerInput = input.toLowerCase();
    const scores: Record<string, number> = {};

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter((kw) => lowerInput.includes(kw)).length;
      scores[emotion] = matches;
    });

    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'neutral';

    const detectedEmotions = Object.entries(scores)
      .filter(([, score]) => score === maxScore)
      .map(([emotion]) => emotion as EmotionType);

    return detectedEmotions[0];
  }

  matchEdgeByIntent(edges: ConversationEdge[], input: string): { edge: ConversationEdge; confidence: number } | null {
    const intentEdges = edges.filter((edge) => edge.trigger.type === 'intent' || edge.intentId);
    
    if (intentEdges.length === 0) return null;

    const detectedIntent = this.detectIntent(input);
    if (!detectedIntent) return null;

    const matchedEdge = intentEdges.find(
      (edge) => edge.intentId === detectedIntent.intentId ||
        (edge.trigger.type === 'intent' && 
         Array.isArray(edge.trigger.value) && 
         edge.trigger.value.some((v) => 
           detectedIntent.intentName.toLowerCase().includes(String(v).toLowerCase()) ||
           detectedIntent.category.toLowerCase().includes(String(v).toLowerCase())
         ))
    );

    if (matchedEdge) {
      return { edge: matchedEdge, confidence: detectedIntent.confidence };
    }

    return null;
  }
}
