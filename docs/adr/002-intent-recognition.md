# ADR 002: Intent Recognition Strategy

## Status
Accepted

## Context
We needed an intent recognition system that:
- Works offline without external APIs
- Provides confidence scores for matching
- Handles variations in user phrasing
- Is fast enough for real-time conversation
- Can be tuned per scenario

## Decision
We implemented a **multi-metric similarity matching** approach combining:

### 1. TF-IDF + Cosine Similarity
```typescript
// Build IDF cache from all intent examples
const tfidf = computeTFIDF(tokens);
const similarity = cosineSimilarity(inputTFIDF, exampleTFIDF);
```

### 2. Jaccard Similarity
```typescript
const jaccard = jaccardSimilarity(inputTokens, exampleTokens);
```

### 3. Keyword Boost
```typescript
// Boost score for critical keywords
const keywordBoost = calculateKeywordBoost(input, pattern);
```

### 4. Weighted Combination
```typescript
const finalScore = (cosine * 0.5) + (jaccard * 0.3) + (keywordBoost * 0.2);
```

### 5. Fallback Chain
1. Exact match (button clicks, exact phrases)
2. Intent-based matching (multi-metric)
3. Regex patterns
4. Keyword matching
5. Fuzzy string matching (Levenshtein)

## Consequences

### Positive
- ✅ 89% intent accuracy on test scenarios
- ✅ ~5ms average matching time
- ✅ Works completely offline
- ✅ Confidence thresholds allow graceful degradation
- ✅ Emotion detection adds contextual awareness

### Negative
- ❌ Requires example phrases for each intent
- ❌ May miss context that LLMs would catch
- ❌ Performance degrades with very large intent sets

### Mitigations
- Confidence thresholds prevent low-quality matches
- Fallback to fuzzy matching catches edge cases
- Intent sets are scenario-specific (typically 5-15 intents)

## Alternatives Considered

### Option A: External LLM API
- Rejected due to cost, latency, and offline requirement

### Option B: Pure Regex Matching
- Rejected due to inflexibility and maintenance burden

### Option C: Naive Bayes Classifier
- Considered but TF-IDF provides better accuracy for short text

## References
- [TF-IDF Explanation](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
