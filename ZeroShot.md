# Zero-Shot Prompt Comparison Across Five AI Models

## 1. Prompt

The following was sent to each model, with no examples, no system
prompt, and no follow-up turns:

A farmer must cross a river with a wolf, a goat, and a cabbage. The boat
holds the farmer plus any two of the three items. Left alone together, the
wolf eats the goat, and the goat eats the cabbage.

Give the minimum number of river crossings and a valid sequence.

Output exactly two labelled sections: CROSSINGS, SEQUENCE.
No preamble.

## 2. Reference Answer

```
CROSSINGS: 3

SEQUENCE: Take the wolf and cabbage across, leaving the goat alone. Return
empty. Take the goat across.
```


## 3. Full Responses

### 3.1 Gemini

```
CROSSINGS: 3

SEQUENCE:
The farmer takes the wolf and the cabbage across to the far shore, leaving the
goat alone on the starting shore.
The farmer returns alone to the starting shore.
The farmer takes the goat across to the far shore.
```

### 3.2 ChatGPT

```
CROSSINGS 3

SEQUENCE
Farmer takes wolf + cabbage across. Farmer returns alone. Farmer takes goat
across.
```

### 3.3 Grok

```
CROSSINGS 3

SEQUENCE
Farmer takes wolf and cabbage to the far side Farmer returns alone Farmer takes
goat to the far side
```


### 3.4 DeepAI

```
CROSSINGS: 7
SEQUENCE:
Farmer and goat cross to the right.
Farmer returns alone.
Farmer and cabbage cross to the right.
Farmer takes the goat back to the left.
Farmer and wolf cross to the right.
Farmer returns alone.
Farmer and goat cross to the right
```


### 3.5 Perplexity

```
CROSSINGS
7

SEQUENCE
Goat goes over, farmer returns alone, Wolf goes over, Goat returns, Cabbage goes
over, farmer returns alone, Goat goes over
```

