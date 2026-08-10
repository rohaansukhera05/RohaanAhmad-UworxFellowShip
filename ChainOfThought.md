# Chain-of-Thought Prompt Comparison Across Five AI Models

## 1. Prompt

The following was sent to each model:

A shop buys a jacket for $80 and marks it up 50%. In a sale, it takes 30%
off the marked price. A customer with a loyalty card gets a further 10% off
the sale price.

Does the shop make a profit or a loss on that jacket, and how much?

Think step by step, showing each calculation. Then give your final answer.

Output exactly two labelled sections: REASONING, ANSWER.

## 2. Answer Key

```
REASONING:
Cost price: $80.
Markup of 50%: 80 × 1.50 = $120 marked price.
Sale discount of 30% off the marked price: 120 × 0.70 = $84.
Loyalty discount of 10% off the sale price: 84 × 0.90 = $75.60.
Compare to cost: 75.60 − 80.00 = −4.40.

ANSWER: A loss of $4.40 per jacket.
```

## 3. Full Responses

### 3.1 Gemini

```
REASONING:

1. Original Cost Price = $80.00
2. Marked Price = $80.00 + (50% of $80.00) = $80.00 + $40.00 = $120.00
3. Sale Price = $120.00 - (30% of $120.00) = $120.00 - $36.00 = $84.00
4. Final Selling Price with Loyalty Discount = $84.00 - (10% of $84.00) =
   $84.00 - $8.40 = $75.60
5. Profit / Loss = Final Selling Price - Original Cost Price = $75.60 - $80.00
   = -$4.40

ANSWER:
The shop makes a loss of $4.40 on the jacket.
```

### 3.2 ChatGPT

```
REASONING

1. **Cost price:** $80
2. **50% markup:**
   $80 × 50% = $40
   Marked price = $80 + $40 = **$120**
3. **30% sale discount:**
   $120 × 30% = $36
   Sale price = $120 − $36 = **$84**
4. **Further 10% loyalty discount:**
   $84 × 10% = $8.40
   Final selling price = $84 − $8.40 = **$75.60**
5. **Compare with cost:**
   $75.60 − $80 = **−$4.40**

ANSWER

**The shop makes a loss of $4.40 on the jacket.**
```

### 3.3 Grok

```
REASONING

Cost price = $80.
Markup of 50%: \(80 \times 1.5 = 120\). Marked price = $120.
30% off marked price: \(120 \times 0.7 = 84\). Sale price = $84.
Further 10% off sale price: \(84 \times 0.9 = 75.6\). Final selling price =
$75.60.
Compare to cost: \(80 - 75.6 = 4.4\). This is a loss of $4.40.

ANSWER

Loss of $4.40
```

### 3.4 DeepAI

```
REASONING:

1. The shop buys the jacket for $80.
2. It marks up the price by 50%.
   Marked price = $80 + (50% of $80) = $80 + (0.50 × $80) = $80 + $40 = $120.
3. During the sale, it takes 30% off the marked price.
   Sale price = $120 - (30% of $120) = $120 - (0.30 × $120) = $120 - $36 = $84.
4. A customer with a loyalty card gets an additional 10% off the sale price.
   Final price = $84 - (10% of $84) = $84 - (0.10 × $84) = $84 - $8.40 = $75.60.
5. The shop's cost is $80, and the final selling price is $75.60.
   Since $75.60 < $80, the shop incurs a loss.

ANSWER:
The shop makes a loss of $4.40 on the jacket.
```

### 3.5 Perplexity

```
REASONING

1. Cost price = $80.
2. Marked price after a 50% markup:
   \[
   \$80 + (50\% \times \$80)=\$80+\$40=\$120
   \]
3. Sale price after 30% off:
   \[
   \$120 \times 70\%=\$84
   \]
4. Loyalty-card price after a further 10% off:
   \[
   \$84 \times 90\%=\$75.60
   \]
5. Since the final selling price is less than the cost price:
   \[
   \$80-\$75.60=\$4.40
   \]

The successive discounts are applied to the marked price and then to the reduced
sale price.

ANSWER

The shop makes a **loss of $4.40** on the jacket.
```
